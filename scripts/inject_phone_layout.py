#!/usr/bin/env python3
"""注入 phoneLayout 到 guanvis pack 出的 ZIP 里。

用法：
  python3 inject_phone_layout.py <input.zip> <output.zip> <chart_height>
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
import zipfile


def inject(input_zip, output_zip, chart_h, has_selector=True):
    tmpdir = tempfile.mkdtemp(prefix='zinj_')
    try:
        # 解压
        with zipfile.ZipFile(input_zip, 'r') as z:
            z.extractall(tmpdir)
        # 找 PK-* 子目录
        sub = [d for d in os.listdir(tmpdir) if d.startswith('PK-')]
        if not sub:
            print('NO_PK_DIR', file=sys.stderr); sys.exit(1)
        pkdir = os.path.join(tmpdir, sub[0])
        desc_path = os.path.join(pkdir, 'descriptor.json')
        with open(desc_path) as f:
            desc = json.load(f)

        # 找 card cdIds（普通卡片 + selector）
        card_ids = []
        selector_ids = []
        for r in desc:
            if r.get('description') == 'card':
                rid = r['resourceId']
                # 看 cdType 6 = selector (display chartType 47 是 SearchBox selector)
                m = r.get('meta', {}).get('card', {})
                if m.get('cdType') == 6:
                    selector_ids.append(rid)
                else:
                    card_ids.append(rid)

        # 找 page 修改 inner meta
        for r in desc:
            if r.get('description') == 'page':
                page_obj = r['meta']['page']
                inner_meta = page_obj['meta']
                if isinstance(inner_meta, str):
                    inner_meta = json.loads(inner_meta)

                # 主卡片：page.layout[0] 的 cdId 通常就是主 customChart
                main_card = inner_meta['layout'][0]['i']

                phone_layout = {
                    'layoutSetting': {
                        'compact': True,
                        'col': 6,
                        'margin': [6, 6],
                        'rowHeight': 14,
                        'cardMargin': 6,
                        'card': {'border': {'radius': 2}},
                        'page': {'background': {'image': {'enabled': False}}}
                    },
                    'layout': [],
                    'layoutItemMap': {},
                    'tabMap': {},
                    'mobileAnchorCds': []
                }

                cur_y = 0
                # 如果有 selector，放一个 group 在顶部
                if has_selector and selector_ids:
                    group_id = 'group_AUTO_PHONE'
                    phone_layout['layout'].append({
                        'w': 6, 'h': 3, 'x': 0, 'y': cur_y,
                        'i': group_id,
                        'minW': 6, 'minH': 2, 'maxH': 4,
                        'moved': False, 'static': False,
                        'isDraggable': True, 'isResizable': True
                    })
                    phone_layout['layoutItemMap'][group_id] = {
                        'cdIds': selector_ids
                    }
                    cur_y += 3

                # 主卡片
                phone_layout['layout'].append({
                    'w': 6, 'h': chart_h, 'x': 0, 'y': cur_y,
                    'i': main_card,
                    'minW': 1, 'minH': 2,
                    'moved': False, 'static': False,
                    'isDraggable': True, 'isResizable': True
                })

                inner_meta['phoneLayout'] = phone_layout

                # 也确保 layoutSetting 有 mobileHeightUnit
                ls = inner_meta.setdefault('layoutSetting', {})
                ls['mobileHeightUnit'] = 60

                # 写回：BI ZIP 格式里 page.meta 必须是 JSON 字符串
                page_obj['meta'] = json.dumps(inner_meta, ensure_ascii=False)
                break

        # 写 descriptor.json
        with open(desc_path, 'w') as f:
            json.dump(desc, f, ensure_ascii=False)

        # 重新打 ZIP
        if os.path.exists(output_zip):
            os.remove(output_zip)
        with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as z:
            for root, _, files in os.walk(pkdir):
                for fn in files:
                    full = os.path.join(root, fn)
                    arc = os.path.relpath(full, tmpdir)
                    z.write(full, arc)
        print(f'OK: {output_zip} (mainCard={main_card}, selectors={selector_ids}, h={chart_h})')
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


if __name__ == '__main__':
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)
    inject(sys.argv[1], sys.argv[2], int(sys.argv[3]))
