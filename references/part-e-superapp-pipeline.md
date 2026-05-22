# Part E：SuperApp（开放应用）开发流水线

> **来源**：2026-05-22 在 workshop513（`https://app.guandata.com`）从零起一个完整 SuperApp demo「会员经营任务池 OS」的全流程沉淀。涉及脚手架 / 数据集异步预览 / **BI 表单建表反向工程** / **LLM 中转两个 JSON 校验 bug** / 同源 fetch credentials 问题，每一坑都有命中和绕过路径。
>
> **何时读这里**：用户要在 BI 域内嵌一个自定义业务前端（看 + 想 + 做闭环工作台 / AI 副驾 / 加盟商专属 PWA / 写回 form 的填报系统）/ 给出 `guancli app create` `guancli app publish` 命令但发现 publish 默认建新应用 / SuperApp 里调 `/api/llm-config/list` 拿不到数据 / 想在 SuperApp 里 add 一条 form 数据但脚手架没暴露建表 API。

---

## §1 SuperApp 是什么 · 资源定位

| 维度 | 内容 |
|------|------|
| UI 称呼 | SuperApp / 超级应用 |
| 后端实体名 | `open-apps`（资源类型代码） |
| 访问 URL | `https://<bi-host>/open-apps/<appId>/` |
| 与其他资源关系 | 与 ETL / Page / Card / Form **平行**，不在任何目录树里 |
| 平台托管范围 | `index.html` + 静态产物（不含后端） |
| 路由模式 | **必须 SPA**（不支持 MPA，因为只托管 `index.html`） |
| 同源能力 | 复用 BI 同源 `/api`、`/static`、`/survey-engine` + 登录 cookie |
| 发布权限 | **需要管理员权限**（普通编辑者发不出去） |

**典型场景**（不是给 Page 换皮）：

- 任务派发 / 决策审批 / 营销发券 / 加盟商专属 PWA / AI 副驾型业务系统
- 「看 + 想 + 做」三层闭环（Page 只覆盖第一层）
- 同代码多端（PC 工作台 + 手机 H5 PWA）

边界判断：如果只是"换个 UI 壳"的看板，用 Page；如果有**写回数据 / 写入填报 / 触发动作 / 嵌入 LLM** 任一动作类需求，走 SuperApp。

---

## §2 三个核心 API（CLI 内部封装）

| 端点 | 用途 | 触发场景 |
|------|------|----------|
| `POST /api/open-apps/upload` | 上传 zip 包 | `guancli app publish` 第 1 步 |
| `POST /api/open-apps/create` | 首次发布（**新建一个 appId**） | `--app-id` 留空时 |
| `POST /api/open-apps/update` | 更新已有应用 | `--app-id <existing>` 时 |

---

## §3 guancli app 命令实测细节

### §3.1 create — 拉模板到本地

```bash
mkdir -p ~/superapp-demo            # 必须先建目录！
guancli app create --name superapp-demo --path ~/superapp-demo
```

**坑**：`--path` **必须是已存在的目录**，否则报 `--path 对应的目录不存在`。

生成的实际项目目录是 `<path>/<name>/`（套娃一层）。

模板来源：`https://guandata-official-website.oss-cn-hangzhou.aliyuncs.com/cdn/guandata-studio-startup-master.zip`，是 React + Vite + TS + React Router v6 + Vitest + ESLint 全套，含 `.env.template`、`/dev`、`/publish` 两个内置 UI。

create 完成后自动跑 `git init` + `npm install` + 拉起 `npm run dev`（在 `--path` 检测可用端口）。

### §3.2 publish — CLI 不读 .env，必须显式传 --app-id

```bash
# ❌ 默认行为：每次都新建一个 appId（操作类型 create）
guancli app publish --path ~/superapp-demo/superapp-demo

# ✅ 真正的 update：必须显式传 --app-id
guancli app publish --path ~/superapp-demo/superapp-demo \
  --app-id ve2f78b92e329450e95549ff
```

**关键坑（亲测踩到）**：`.env` 里的 `VITE_APP_ID` 字段**只对模板自带的 `/publish` 在线 UI 生效**，**CLI 不读这个变量**。第一次发布不传 `--app-id` 就走 create 新建；想 update 已有 app 必须从命令行显式传。

后果：如果忘了，平台上会留多条 SuperApp 记录，要去 BI 网页里手动清。

publish 内部链路：vite build → 自动 ZIP `dist.<version>.zip` → POST `/api/open-apps/upload` → POST `/api/open-apps/create` 或 `/update`。

### §3.3 包大小参考

```
React 18 + Router 6 + 完整工作台 UI + form CRUD + LLM 流式
→ 172 KB JS / 14 KB CSS（gzip 后 57 + 3.5 KB）
```

平台对包大小没硬限，但用户首屏要在登录 BI 主 SPA 之上加载，包越小越好。

---

## §4 脚手架内置的 bi-services 速查

| 文件 | 暴露能力 | 是否能完成业务闭环 |
|------|----------|--------------------|
| `card.ts` | `getCardInfo` + `getStandardCardData(cdId, params)` | ✅ 直接吃 BI 卡片数据 |
| `dataset.ts` | 数据集详情 + 异步预览 3 步链路 + 文件上传建数据集 | ✅ 取数 |
| `form.ts` | 表单 CRUD（add/update/remove/query）+ `getFormDetail`/`getFormColumns` | ⚠️ **没建表 API**（见 §6） |
| `llm.ts` | `listAvailableLLMServices` + `fetchFromLLMChat` + 流式 stream parser | ⚠️ list 接口被 unwrap 吞（见 §7） |
| `page.ts` / `selector.ts` / `task.ts` / `user.ts` | 页面/筛选器/任务状态/用户信息 | 基础读 |

> ⚠️ 重要：脚手架 `bi-services/*` 全部走 `core/request.ts` 的 BI 标准 unwrap 链路，对**返回裸数组**或**返回非 BIUniversalJsonResponse 包装**的端点会拿到 undefined（见 §7、§8）。

---

## §5 数据集异步预览三步链路（最常用 BI 取数路径）

`getStandardCardData` 适合"卡片已存在"场景。如果你要的是数据集明细行（比如 demo 里 50000 行 ads_会员经营任务池），走异步预览：

```ts
import { previewDatasetDataWithFilterAsync, readDatasetPreviewFile } from '@/bi-services/dataset';
import { getTaskStatus } from '@/bi-services/task';

async function pollDatasetPreviewTask(taskId: string, timeoutMs = 30000, intervalMs = 800): Promise<string> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        const status = await getTaskStatus(taskId);
        if (status.status === 'FINISHED') {
            // ⚠️ result 字段嵌套了 BIUniversalJsonResponse 包装
            const result = status.result as { response?: { value?: string }; value?: string } | null;
            const fileName = result?.response?.value ?? result?.value;
            if (!fileName) throw new Error('任务完成但缺 fileName');
            return fileName;
        }
        if (status.status === 'FAILED' || status.status === 'CANCELED') {
            throw new Error(`任务异常: ${status.status}`);
        }
        await new Promise((r) => setTimeout(r, intervalMs));
    }
    throw new Error('预览任务超时');
}

export async function fetchTaskPoolRows(dsId: string, limit = 200) {
    const preview = await previewDatasetDataWithFilterAsync(dsId, { limit });
    const fileName = await pollDatasetPreviewTask(preview.taskId);
    const file = await readDatasetPreviewFile({ taskId: preview.taskId, fileName });

    // ⚠️ columns 用 col.name 索引（不是 fdId 不是 title）
    return file.preview.map((row) => {
        const obj: Record<string, string> = {};
        file.columns.forEach((col, i) => {
            obj[col.name] = row[i] ?? '';
        });
        return obj;
    });
}
```

**坑速记**：
1. `getTaskStatus(taskId).result` 实际是嵌套 `{response: {value: fileName}}` 结构（双层 unwrap）
2. `readDatasetPreviewFile` 返回的 `columns` 用 `col.name` 索引，不是 `col.title` 也不是 `col.fdId`
3. 50000 行的数据集别一次拉全，前 200 行做客户端筛选 + 排序足够 demo 用

---

## §6 BI 表单建表的反向工程（脚手架完全没暴露！）

### §6.1 现象

脚手架 `bi-services/form.ts` 只暴露**数据 CRUD**（add/update/remove/query）和**读 schema**（getFormDetail/getFormColumns），**没有建表 API**。

```bash
$ guancli form --help
# 子命令只有 list/schema/query/add/update/delete —— 没有 create
```

工坊环境实测 `guancli form list` 返回 `共: 0 个表单`，BI 网页里也找不到「新建表单」按钮（可能权限或入口隐藏）。

### §6.2 反向工程过程

实测通过的端点尝试（用 curl + workshop513 token，根目录 ID = `"0"`）：

| 端点 | 结果 |
|------|------|
| `POST /survey-engine/api/folder/create-form` | 404 |
| `POST /survey-engine/api/forms` | 404 |
| `POST /survey-engine/api/form` | 404 |
| `POST /survey-engine/api/form/create` | 405（实际是 GET 读取端点 `/form/<fmId>`） |
| `POST /api/directory/FORM` | 500（错误方法） |
| **`POST /survey-engine/api/form/add`** | ✅ **真正的建表入口** |

### §6.3 建表 body 完整 schema

```json
POST /survey-engine/api/form/add
{
  "name": "form_任务执行记录",
  "parentId": "0",
  "folderId": "0",
  "fmType": "FORM",
  "settings": {},
  "definition": [
    {
      "fdId": "f01",
      "keyId": "task_id",
      "name": "任务ID",
      "type": "STRING",
      "seqNo": 1,
      "settings": { "required": true, "editable": true }
    }
  ]
}
```

返回：

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "fmId": "a_5ab553-4754-4d89-a7f2-7d7ab38f27fa",
    "definition": [
      {
        "fdId": "a_e37904-cfe9-42a7-bb7e-101c8f71a345",   // ← 被后端重写！
        "keyId": "task_id",                                  // ← 我传的，保留
        ...
      }
    ]
  }
}
```

### §6.4 五个隐性坑

1. **`settings: {}` 不能漏**（必须传空对象），否则 NPE：
   ```
   Cannot invoke "JSONObject.getInteger(String)" because
   the return value of "Form.getSettings()" is null
   ```

2. **字段 fdId 会被后端重写**：传什么都被覆盖成 `a_xxx-yyyy-...` 格式（38 字符）。但 **必须传非空**，否则报错。

3. **字段 keyId 是开发者可控** + **DB 是 varchar(20)**：
   - UUID 36 字符会爆 `PSQLException: value too long for type character varying(20)`
   - 用语义化短串：`task_id` / `member_id` / `reached_at` / `channel` 等
   - 代码里用 keyId 做映射查找的稳定标识

4. **查询返回行按 fdId 索引**（不是 keyId 也不是 name）：
   ```json
   {
     "rowId": "...",
     "a_e37904-cfe9-42a7-bb7e-101c8f71a345": "T00000001",
     "a_d5812d-7fb8-454d-aedf-68436a2aa917": "M0064858",
     ...
   }
   ```
   代码里要先用 `getFormDetail(fmId)` 缓存 `keyId → fdId` 映射，再按 fdId 取值。

5. **字段值可能是裸字符串或数组**，统一兼容：
   ```ts
   function pluckValue(row: Record<string, unknown>, fdId: string): string {
       const raw = row[fdId];
       if (Array.isArray(raw)) return raw[0] == null ? '' : String(raw[0]);
       return raw == null ? '' : String(raw);
   }
   ```

### §6.5 删除数据 API 残留 bug

`POST /survey-engine/api/form/<fmId>/data/remove` body `["<rowId>"]` 会报：

```
java.lang.NullPointerException: Cannot invoke
"java.lang.Boolean.booleanValue()" because "submitterEditable" is null
```

**根因**：建表时 `settings` 只传 `{}`，缺 `submitterEditable` 字段。

**修法**：建表时 settings 补全（具体补哪些字段还没探明完整集，先记下这个坑）。短期绕过：用户在 BI 后台手动删脏数据。

### §6.6 完整建表 + add + query 模板代码

```ts
// src/services/task-form.ts (节选)

export const EXECUTION_FORM_ID = 'a_5ab553-4754-4d89-a7f2-7d7ab38f27fa';
export const FIELD_KEYS = ['task_id', 'member_id', 'channel', 'reached_at', 'script', 'result', 'executor', 'remark'] as const;
type FieldKey = (typeof FIELD_KEYS)[number];
type FieldMap = Record<FieldKey, { fdId: string; keyId: string; name: string; type: FormFieldType }>;

let fieldMapPromise: Promise<FieldMap | null> | null = null;

export async function loadExecutionFormSchema(): Promise<FieldMap | null> {
    if (!fieldMapPromise) {
        fieldMapPromise = getFormDetail(EXECUTION_FORM_ID)
            .then((detail) => buildFieldMap(detail.definition.filter((d): d is IFormFieldControl => 'keyId' in d)))
            .catch(() => null);
    }
    return fieldMapPromise;
}

export async function addExecutionRecord(record: ExecutionRecord): Promise<boolean> {
    const map = await loadExecutionFormSchema();
    if (!map) return false;
    const payload = (key: FieldKey, value: string) => ({
        fdId: map[key].fdId,
        keyId: map[key].keyId,
        type: map[key].type,
        value: [value],
    });
    await addFormData(EXECUTION_FORM_ID, {
        data: [
            payload('task_id', record.taskId),
            payload('member_id', record.memberId),
            // ...
        ],
    });
    return true;
}
```

---

## §7 BI 的 LLM 中转两个 JSON 校验 bug

### §7.1 `/api/llm-config/list` 返回裸数组

脚手架 `listAvailableLLMServices()` 走 `getJSON` → `unwrapBIResponse` → 期望 `{response: T}` 包装，**但 LLM list 端点实际返回裸数组**：

```bash
$ curl /api/llm-config/list
[{"llmConfigId":"u7c1aaf...","name":"...","model":"claude-opus-4-6",...}]
```

`unwrapBIResponse` 拿 `data?.response`（undefined），listAvailable 返回 undefined，调用方 `configs[0]` 触发 TypeError 被 catch 吞，前端误以为"未配置 LLM"。

**修法**：用原生 fetch 绕过 unwrap：

```ts
async function listLlmServicesRaw(): Promise<ILLMServiceConfig[]> {
    const response = await fetch('/api/llm-config/list', { credentials: 'include' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    const wrapped = (parsed as { response?: unknown }).response;
    if (Array.isArray(wrapped)) return wrapped;
    throw new Error('llm-config 响应不是数组');
}
```

### §7.2 `/api/llm/chat/completions` 双向 JSON 校验失败

| stream 参数 | BI 中转表现 |
|------|--------|
| `stream: true` | 报 `NOT_JSON_RES`（"请求返回格式错误,需要JSON"），SSE 流被 BI 当成 JSON 校验失败 |
| `stream: false` | 报 `ILLEGAL_JSON_RES`，**完整 LLM 响应被塞在 `error_message` 字段** |

实测 stream=false 的报错原文：

```json
{
  "error_code": "ILLEGAL_JSON_RES",
  "error_message": "非法的JSON结构: {\"id\":\"msg_...\",\"choices\":[{\"index\":0,\"message\":{\"role\":\"assistant\",\"content\":\"我可以用中文回答你的问题。\"},...}]}"
}
```

LLM 真的回了，只是 BI 中转的 JSON 适配层把 OpenAI 标准格式当成"非法 JSON"。

### §7.3 三路径解析模板

绕过 BI 中转的 unwrap，统一用 stream=false + 客户端模拟流式，解析时尝试三种格式：

```ts
function extractFromOpenAIShape(payload: unknown): string | null {
    if (!payload || typeof payload !== 'object') return null;
    const choices = (payload as { choices?: Array<{ message?: { content?: string } }> }).choices;
    return choices?.[0]?.message?.content ?? null;
}

function extractFromIllegalJsonError(json: { error_message?: string }): string | null {
    const msg = json?.error_message;
    if (typeof msg !== 'string') return null;
    const match = msg.match(/^非法的JSON结构:\s*({[\s\S]+})$/);
    if (!match) return null;
    try {
        const inner = JSON.parse(match[1]);
        return extractFromOpenAIShape(inner);
    } catch {
        return null;
    }
}

function extractContent(json: any): { content: string | null; error: string | null } {
    // Path 1: BI 标准包装
    const wrapped = json?.response;
    const fromWrapped = extractFromOpenAIShape(wrapped);
    if (fromWrapped) return { content: fromWrapped, error: null };

    // Path 2: BI pass-through 直接 OpenAI 格式
    const fromDirect = extractFromOpenAIShape(json);
    if (fromDirect) return { content: fromDirect, error: null };

    // Path 3: ILLEGAL_JSON_RES 包装（实测命中）
    const fromBuriedError = extractFromIllegalJsonError(json);
    if (fromBuriedError) return { content: fromBuriedError, error: null };

    return { content: null, error: json?.error_message ?? '响应无内容' };
}
```

### §7.4 客户端模拟流式打字效果

拿到完整响应后按字符 tick 喂 setState：

```ts
function tickFakeStream(content: string, onUpdate, resolve) {
    const step = Math.max(2, Math.ceil(content.length / 60));  // 60 步走完
    let cursor = 0;
    const tick = () => {
        cursor = Math.min(cursor + step, content.length);
        const isLast = cursor >= content.length;
        onUpdate({ content: content.slice(0, cursor), done: isLast, error: null });
        if (isLast) resolve();
        else setTimeout(tick, 30);  // 30ms 一帧
    };
    tick();
}
```

视觉上有"AI 正在打字"效果，实际响应是一次性拿全的（更稳）。

### §7.5 prompt 设计经验（针对 BI 业务话术场景）

实测有效的 prompt 模板（针对会员触达话术）：

```
你是一个连锁餐饮品牌的门店导购，要给一个会员发触达话术。

[这次任务的背景]
- 任务类型: ${row.任务类型}
- 推荐动作: ${row.推荐动作}
- 推荐原因: ${row.推荐原因}
- 推荐权益: ${row.推荐权益}

[会员]
- 等级: ${row.会员等级}
- 人群标签: ${row.人群标签}
- 城市: ${row.会员城市}

[门店]
${row.门店名称}（${row.店型}）

请写 3 段实际可用的触达话术，分别用于【企微 1V1】【电话开场】【短信】三个渠道。

硬要求:
- 每条话术开头用【企微】【电话】【短信】标注渠道，紧跟话术正文
- 不要"您好""尊敬的会员""我们的活动"这种营销腔，要像店长平时和老熟客聊天的语气
- 必须带具体动作或时间锚点，如"今晚下班路上""周末给您留了""中午订餐前扫码"
- 整条话术 40 字以内
- 输出三条，每条一行，不要 markdown 不要序号不要解释
```

claude-opus-4-6 跟 prompt 的命中率非常高：会**自动把门店编号拆成角色称呼**（"我是 0783 店小张"）、**把"流失"会员翻译成自然语气**（"好久没见你来取餐了"）、**用真实餐饮品牌爆款语言**（"生椰拿铁""明天午饭前下单"）。

---

## §8 脚手架 core/request.ts 的 get/getJSON 陷阱

### §8.1 默认行为

```ts
// core/request-core.ts 节选
const DEFAULT_VALIDATE_STATUS = (status) => status >= 200 && status < 300;
const defaultConfig = {
    responseType: 'auto',                  // 按 content-type 自动 JSON 解析
    validateStatus: DEFAULT_VALIDATE_STATUS,
    // 没有显式 credentials/cookie 控制
};
```

### §8.2 实测翻车

`get<T>('/api/llm-config/list')` 在 SuperApp **生产域**里**返回 undefined**（curl 直接打能正常拿数组）。最可能原因：脚手架 `dispatchRequest` 内部走 fetch 时没显式 `credentials: 'include'`，BI 同源 cookie 可能没自动带（取决于 fetch 默认策略）。

### §8.3 稳妥做法：BI 内部 API 用原生 fetch

```ts
// ❌ 不稳：脚手架 get/getJSON
const result = await get<ILLMServiceConfig[]>('/api/llm-config/list');

// ✅ 稳：原生 fetch + credentials: 'include'
const response = await fetch('/api/llm-config/list', { credentials: 'include' });
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const data = await response.json();
```

`fetchFromLLMChat` 用 `responseType: 'response'` 拿原始 Response 是对的——绕过了 unwrap 和 validateStatus。

### §8.4 把错误冒泡，别 .catch(() => null) 吞掉

调试时把错误暴露到 UI，不要默默返回 null：

```ts
// ❌ 静默失败
llmConfigPromise = listLlmServicesRaw()
    .then((configs) => configs[0]?.llmConfigId ?? null)
    .catch(() => null);

// ✅ 错误冒泡
llmConfigPromise = listLlmServicesRaw()
    .then((configs): LlmConfigState => ({ llmConfigId: configs[0]?.llmConfigId ?? null, error: null }))
    .catch((err: Error): LlmConfigState => ({ llmConfigId: null, error: err.message }));
// UI 显示 error.message,用户能告诉你具体是哪种失败
```

---

## §9 路由 + base href 处理

### §9.1 index.html 自动注入 `<base>`

模板的 index.html 自带这段：

```html
<script>
  const matched = window.location.pathname.match(/^(.*\/open-apps\/[^/]+)(?:\/|$)/);
  const appBasename = matched ? matched[1] : '';
  const baseHref = appBasename ? appBasename + '/' : '/';
  window.__APP_BASENAME__ = appBasename;
  const baseElement = document.createElement('base');
  baseElement.setAttribute('href', baseHref);
  document.head.insertBefore(baseElement, document.head.firstChild);
</script>
```

效果：访问 `/open-apps/<appId>/foo/bar` 时，`<base>` 设为 `/open-apps/<appId>/`，所有相对路径自动解析正确。

### §9.2 React Router 用 basename

main.tsx 已经处理好：

```tsx
<BrowserRouter basename={getRouterBasename()}>
  <App />
</BrowserRouter>
```

业务路由用相对路径即可（不要硬编 `/open-apps/...`）。

### §9.3 dev vs 生产 URL 处理

`core/url.ts` 的 `getBIResourceUrl(path)`：

- dev：baseUrl 为空，依赖 `dev-proxy.mjs` 转发 `/api`、`/static` 到 `.env` 里的 `VITE_BI_HOST`
- 生产：baseUrl 来自 `detectBIBaseRouteUrl(pathname)` 正则 `^(.*)\/open-apps`

只对 `/api`、`/static`、`/survey-engine` 三个前缀拼 baseUrl，其他保持原样。

---

## §10 设计纪律（沿用 docs/design/）

模板自带两套预设：

| 文件 | 适用 |
|------|------|
| `docs/design/DESIGN-workbench-light.md` | 表格 + 操作流程混合页（任务池、中后台、报表） |
| `docs/design/DESIGN-dashboard-dark.md` | 实时监控 / 异常告警队列 / 长时间值守大屏 |

**核心硬约束**（违反 `npm run design:lint` 直接 error）：

- 单数字 ≤ 40px（KPI 主值 28-32px）
- 圆角 ≤ 8px
- `box-shadow` 模糊 ≤ 8px
- **三层独立 token**：系统色 / 状态色 / 图表色，绝不同源
- 数字字段用 `font-variant-numeric: tabular-nums`
- App Shell 布局（左 sidebar + topbar + content），禁止单列从上滚到下
- **禁区**：紫蓝渐变 / 玻璃拟态 / 渐变光晕铺底 / 巨型数字 / 营销 CTA / Hero 区

```bash
npm run design:lint   # 机械自检,有 error 必须修
```

### §10.1 任务池工作台的 token 选择

实测命中的浅色工作台 token（基于 DESIGN-workbench-light.md）：

```css
--bg: #f7f8fa;
--surface-1: #ffffff;
--surface-2: #f1f3f5;
--text-1: #17202a;
--text-2: #3f4b5f;
--text-3: #6b778c;
--border: #dfe3ea;
--accent: #2563eb;
--accent-soft: #e8f0ff;
--success: #0f9f6e;
--warning: #b7791f;
--danger: #d64545;

/* 优先级专用色 */
--priority-p0: #d64545;
--priority-p1: #b7791f;
--priority-p2: #2563eb;
--priority-p3: #6b778c;
```

---

## §11 ESLint 硬限制（脚手架默认）

| 规则 | 上限 |
|------|------|
| 单文件行数 | ≤ 400 行 |
| 单函数复杂度 | ≤ 10 |
| `no-useless-escape` | 字符类内 `[` 不要转义为 `\[` |

复杂逻辑务必拆 helper。常见冒头：

- 组件文件超 400 → 拆子组件到独立文件
- 函数复杂度超 10 → 拆 `extractXxx`、`isTerminalYyy` 等 helper
- 字符类正则报错 → 把 `/^[【\[]...[】\]]/` 改成 `/^[【[]...[\]】]/`

---

## §12 模板内置的两个开发期 UI

| 路径 | 用途 |
|------|------|
| `http://localhost:8000/dev` | UI 改 BI 地址 / Token / AppId，保存自动写回 `.env` + dev server 重载 |
| `http://localhost:8000/publish` | UI 触发本地打包 + 预览 + 发布（这里**会读 VITE_APP_ID**） |

demo 时 CLI 更顺，但给客户演示"如何接入"时这两个 UI 很值。

---

## §13 部署后访问的细节

### §13.1 必须在登录的浏览器里访问

```
https://<bi-host>/open-apps/<appId>/
```

直接 curl 拿到的是 **BI 主 SPA 的 shell HTML**（不是你的 SuperApp 产物），因为 BI 把 `/open-apps/<appId>/` 当成主 SPA 内部路由，要走前端 router 才能进到你的应用。

### §13.2 验证清单

发完一版 publish，最快的验证顺序：

```bash
# 1. 操作类型必须是 update 不是 create（避免新建一堆 app）
guancli app publish --path <dir> --app-id <id>
# → 看输出 "操作: update"

# 2. 检查产物大小没有意外膨胀（基准 ~170 KB JS）
ls -la <dir>/dist.<version>.zip

# 3. 浏览器登录后开 URL,F12 看
#    - /api/llm-config/list 是否 200 OK 返回数组
#    - /survey-engine/api/form/<fmId>/data 是否 200 OK
#    - 没有 401/403 cookie 透传问题
```

### §13.3 删除已发布的 SuperApp

`guancli app` 子命令**只有 create + publish**，没有 delete / list。删除需去 BI 网页的「超级应用」管理界面手动操作。

---

## §14 SuperApp vs Page 的边界判断（决策树）

```
用户的需求是"看数据" → Page（标准报表、月报、上下钻）
                ↓ 否则
用户需要"写回数据 / 触发动作 / 嵌 AI" → SuperApp
                ↓ 是
是不是单次需求 → 单次走脚手架 + guancli app
              ↓ 是
是不是需要响应式 / 多端形态 → 同代码 PWA
              ↓ 是
需要嵌入 BI 卡片 → getStandardCardData(cdId)（无需自己跑 SQL）
              ↓ 是
需要 LLM 副驾 → fetch /api/llm/chat/completions stream=false + 三路径解析
```

**反面案例**：如果只是想"把 Page 换个皮肤"，**不要走 SuperApp**——成本不对称（要写 React + 设计纪律 + ESLint + 发布流），还不如改 Page 主题或用自定义图表（Part C）。

---

## §15 实战案例：会员经营任务池 OS

| 项 | 值 |
|---|---|
| appId | `ve2f78b92e329450e95549ff` |
| 域 | workshop513（`https://app.guandata.com`） |
| 数据底座 | `ads_会员经营任务池` (dsId=`nda316bda403346669b3fa1d`, 50000 行, 32 字段) |
| 写回表 | `form_任务执行记录` (fmId=`a_5ab553-4754-4d89-a7f2-7d7ab38f27fa`, 8 字段) |
| LLM | claude-opus-4-6 (llmConfigId=`u7c1aaf61fc6d40f1ab6f332`) |
| 包大小 | 172 KB JS / 14 KB CSS（gzip 后 57 + 3.5 KB） |

**完整业务闭环**：

1. 启动时 `fetchTaskPoolRows(200)` 拉数据集 → 按 P0 + 预计价值排序
2. 启动时 `queryAllExecutionRecords()` 拉历史 → 按 `taskId` 索引 → 还原任务卡片"已触达"状态
3. 点任务 → 抽屉打开 → 显示推荐动作 + 会员 360° + 历史执行记录（如有）
4. 点"生成 3 段触达话术" → 调 `/api/llm/chat/completions` → 三路径解析 → 客户端模拟流式
5. 点其中一条话术 → setState 选中 → 底部主按钮变蓝"用【企微】这条话术 · 标记已触达"
6. 点蓝按钮 → 调 `addExecutionRecord` → POST `/survey-engine/api/form/.../data/add` → 真写回 BI
7. 任务卡片右下出现 `✓ 企微 · 已触达`，下次刷新自动还原

**核心叙事**：把数据集字段 `推荐动作: "电话回访+召回券"` 通过 LLM 变成 3 条可读、可用、带感情的话术，再让人选一条真写回 form，闭合"看 → 想 → 选 → 做 → 留痕"全链路。这是 Page 做不到的边界。

---

## §16 反模式 · 不要做这些

| 反模式 | 为什么不行 | 替代 |
|--------|-----------|------|
| 把 SuperApp 当"换皮 Page" | 工程成本高 10×，无价值增量 | 改 Page 主题 / 走 Part C 自定义图表 |
| 用 MPA（多 HTML 入口） | 平台只托管 `index.html` | SPA + React Router |
| 用 UUID 36 字符作为 form field keyId | DB varchar(20) 报错 | 语义化短串 `task_id` |
| 把 LLM 调用走 `stream: true` | BI 中转 JSON 校验失败 | stream=false + 客户端模拟流式 |
| `listAvailableLLMServices()` | 走 unwrap 拿不到裸数组 | 原生 fetch + credentials: 'include' |
| publish 不传 `--app-id` 期望 update | CLI 不读 `.env`，每次新建 | 显式传 `--app-id` |
| 在 SuperApp 里硬撸建表 SQL | 没建表 API 等于 0 | 反向工程 `/survey-engine/api/form/add` |
| 把执行历史存 localStorage | 换浏览器就丢 | 写回 form 真持久化 |

---

## §17 工程目录参考结构

```text
~/superapp-demo/superapp-demo/
├── src/
│   ├── App.tsx                    # App Shell（左 filter + 中 board + 右 detail drawer）
│   ├── main.tsx                   # BrowserRouter + basename
│   ├── styles.css                 # 浅色工作台 token + 紧凑布局
│   ├── components/
│   │   ├── TaskCard.tsx           # 任务卡片（priority bar + 推荐 + meta + footer）
│   │   └── TaskDetail.tsx         # 抽屉（推荐 / AI 话术 / 360° / 时间窗 / 动作）
│   ├── services/
│   │   ├── task-pool.ts           # 数据集异步预览三步链路 + 过滤/排序 helper
│   │   ├── task-form.ts           # form_任务执行记录 schema + add/query
│   │   └── copilot.ts             # LLM 配置加载 + 话术生成 + 三路径解析
│   └── bi-services/               # 脚手架自带（不动）
├── public/settings.json           # name / title 运行时配置
├── docs/design/                   # 脚手架自带设计预设(不动)
├── .env                           # VITE_BI_HOST / VITE_APP_ID(只对 /publish UI 生效)
├── index.html                     # 自动注入 <base href>
└── package.json
```

---

## §18 何时回到这份文档

| 触发场景 | 跳到 |
|----------|------|
| `guancli app create` 报"目录不存在" | §3.1 |
| `guancli app publish` 没走 update 而是新建一个 | §3.2 |
| 数据集异步预览 columns 用 fdId/title 拿不到值 | §5 |
| 想在 SuperApp 里 add form 数据但没建表 API | §6 |
| 建表后 add 数据成功但 remove 报 NPE | §6.5 |
| `listAvailableLLMServices()` 返回空但 curl 正常 | §7.1 / §8 |
| `/api/llm/chat/completions` 报 NOT_JSON_RES 或 ILLEGAL_JSON_RES | §7.2 / §7.3 |
| LLM 输出格式不稳，话术质量参差 | §7.5（prompt 模板） |
| ESLint 报 max-lines / complexity | §11 |
| `<base>` / React Router 路径错乱 | §9 |
| 评估 SuperApp 还是 Page | §14 |
