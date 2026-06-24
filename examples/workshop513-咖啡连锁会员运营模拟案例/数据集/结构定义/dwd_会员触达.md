我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: xc82fb232ecdc474f84cd43d
- 数据集名称: dwd_会员触达
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dwd_会员触达
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 500000 行
- 字段列数: 11 列

## 时间信息
- 创建时间: 2026-05-21 09:12:53+0800
- 更新时间: 2026-05-21 09:13:21+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 11
- **普通字段**: 11 个
- **计算字段**: 0 个
- **维度字段**: 10 个
- **度量字段**: 1 个

### 字段列表

- 触达ID (fdId: n49fc8145f39347e182cb9d8)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 触达时间 (fdId: wf51430ad98d04f16aa06eae)
  - 字段类型: TIMESTAMP
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 触达日期 (fdId: o806304d89d11422b84ddca3)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员ID (fdId: j9a0678428a974dcaa7abfbc)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 员工ID (fdId: k6a497c83b83a478a88835d2)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 触达渠道 (fdId: q8db7e65b8256465e93df02c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 内容类型 (fdId: pfbb61036729a4efcbd4fdb1)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 内容ID (fdId: b39770fedc24d4d6bbd4fdaa)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 活动ID (fdId: q93bd7917cfca407ab89ef2a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 是否查看 (fdId: l3ab0b56a34534ee8bad7dc6)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 触达状态 (fdId: s5cade37f35f54c4394751d2)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dwd_会员触达` is table('xc82fb232ecdc474f84cd43d') extend {
  // Base columns from table:
  //   - 触达ID (STRING)
  //   - 触达时间 (TIMESTAMP)
  //   - 触达日期 (DATE)
  //   - 会员ID (STRING)
  //   - 员工ID (STRING)
  //   - 触达渠道 (STRING)
  //   - 内容类型 (STRING)
  //   - 内容ID (STRING)
  //   - 活动ID (STRING)
  //   - 是否查看 (LONG)
  //   - 触达状态 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (6)
- **ads_会员私域驾驶舱** (DATA_PROCESS_ETL)
  - ID: n5eed53432fec411f8b3250f
- **ads_高层经营驾驶舱** (DATA_PROCESS_ETL)
  - ID: s85830984b37045b39c1c816
- **etl_dws_私域转化漏斗 (10节点·F+C+G+C+G+J+C)** (DATA_PROCESS_ETL)
  - ID: g4469ecdd670a4d91bd92055
- **etl_ads_活动权益复盘 (17节点·C+G+F+C+G×2+S+J×3+C)** (DATA_PROCESS_ETL)
  - ID: g75c5f907f4bb4e87938fa35
- **etl_dws_员工导购效能 (8节点·F+S+J+C)** (DATA_PROCESS_ETL)
  - ID: heeb294b1dbc041318ea5aaf
- **repro_活动权益复盘_前端编辑bug** (DATA_PROCESS_ETL)
  - ID: p38ae465fd99b47bebd3c5eb
