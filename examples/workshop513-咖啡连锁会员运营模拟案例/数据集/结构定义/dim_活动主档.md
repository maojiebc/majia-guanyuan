我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: le21397bebf6c4ffaa81d9cc
- 数据集名称: dim_活动主档
- 显示类型: EXCEL
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dim_活动主档
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 50 行
- 字段列数: 9 列

## 时间信息
- 创建时间: 2026-05-20 18:03:09+0800
- 更新时间: 2026-05-20 18:03:30+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 9
- **普通字段**: 9 个
- **计算字段**: 0 个
- **维度字段**: 8 个
- **度量字段**: 1 个

### 字段列表

- 活动ID (fdId: w03e3b54266764859b2eb52a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 活动名称 (fdId: ce592e94a7f0042239a6ac85)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 活动类型 (fdId: sdded9b7504414c51a31b5a7)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 活动渠道 (fdId: g7f91ffe30c0e4f0eb323fec)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 目标人群标签 (fdId: g2cbfbd6743a349a6ae3bd69)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 开始日期 (fdId: j6134bc6d519442c9bfcbf98)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 结束日期 (fdId: g04de880196d34f66b3fb02a)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 目标人群等级 (fdId: p13dee56746fd41d1ac2fa82)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 预算 (fdId: f44d8354688ae4c1a9840e95)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dim_活动主档` is table('le21397bebf6c4ffaa81d9cc') extend {
  // Base columns from table:
  //   - 活动ID (STRING)
  //   - 活动名称 (STRING)
  //   - 活动类型 (STRING)
  //   - 活动渠道 (STRING)
  //   - 目标人群标签 (STRING)
  //   - 开始日期 (DATE)
  //   - 结束日期 (DATE)
  //   - 目标人群等级 (STRING)
  //   - 预算 (LONG)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (3)
- **etl_dws_私域转化漏斗 (10节点·F+C+G+C+G+J+C)** (DATA_PROCESS_ETL)
  - ID: g4469ecdd670a4d91bd92055
- **etl_ads_活动权益复盘 (17节点·C+G+F+C+G×2+S+J×3+C)** (DATA_PROCESS_ETL)
  - ID: g75c5f907f4bb4e87938fa35
- **repro_活动权益复盘_前端编辑bug** (DATA_PROCESS_ETL)
  - ID: p38ae465fd99b47bebd3c5eb
