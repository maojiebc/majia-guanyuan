我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: lecec5a5b95314eada3fe69e
- 数据集名称: dwd_加盟分账明细
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dwd_加盟分账明细
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 2189 行
- 字段列数: 14 列

## 时间信息
- 创建时间: 2026-05-21 14:35:03+0800
- 更新时间: 2026-05-21 14:35:09+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 14
- **普通字段**: 14 个
- **计算字段**: 0 个
- **维度字段**: 7 个
- **度量字段**: 7 个

### 字段列表

- 分账明细ID (fdId: id17e972e9e0f4b928079244)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 加盟商ID (fdId: b58e060f9edfa4bdaa516c25)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店ID (fdId: w578f53a165e949fdba249d4)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 合同ID (fdId: h161e67aac0ec4d899371955)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 月份 (fdId: la03fbadf14b14475944dbd3)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 月营收基数 (fdId: p88de38c3167f40fcb3db151)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 流水抽成金额 (fdId: m8fa0604ade8c448eb870222)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 原料供应链利润 (fdId: if1d65b4789cb4255958f268)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 年加盟费分摊 (fdId: p8ec9e9d4b79441ac8cae79b)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 督导费用 (fdId: pdbd118a217ac4bb1bdfe969)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 总部当月收入 (fdId: we08fe0e252334879bf433b2)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 总部当月净收益 (fdId: a39848830ef3042cbb53b464)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 对账状态 (fdId: s13c36a9f91524cf9ba9d888)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 结算日期 (fdId: dad5e2b7b24d24737897774a)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dwd_加盟分账明细` is table('lecec5a5b95314eada3fe69e') extend {
  // Base columns from table:
  //   - 分账明细ID (STRING)
  //   - 加盟商ID (STRING)
  //   - 门店ID (STRING)
  //   - 合同ID (STRING)
  //   - 月份 (DATE)
  //   - 月营收基数 (DOUBLE)
  //   - 流水抽成金额 (DOUBLE)
  //   - 原料供应链利润 (DOUBLE)
  //   - 年加盟费分摊 (DOUBLE)
  //   - 督导费用 (DOUBLE)
  //   - 总部当月收入 (DOUBLE)
  //   - 总部当月净收益 (DOUBLE)
  //   - 对账状态 (STRING)
  //   - 结算日期 (DATE)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系
