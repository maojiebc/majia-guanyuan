我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: e620121168c3447c3abe4948
- 数据集名称: dim_加盟商主档
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dim_加盟商主档
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 141 行
- 字段列数: 11 列

## 时间信息
- 创建时间: 2026-05-21 14:33:31+0800
- 更新时间: 2026-05-21 14:33:37+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 11
- **普通字段**: 11 个
- **计算字段**: 0 个
- **维度字段**: 9 个
- **度量字段**: 2 个

### 字段列表

- 加盟商ID (fdId: vd440dfead18844999061feb)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 加盟商名称 (fdId: pb1896b04fb164e68abaa756)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 加盟商类型 (fdId: g379e08db5572494ea4df36a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 联系人 (fdId: c6cdb27744d26446a90b3838)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 手机号Hash (fdId: xb925992e2a5642a2b09d686)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 签约省份 (fdId: pf643ca2896674cb7b2abb8c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 入网日期 (fdId: g1ec109852e9342ebb6fe543)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 合作状态 (fdId: g0f8170b52fef416baa8123b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 信用等级 (fdId: p1f6fc28fec594f22a7ea639)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 保证金金额 (fdId: w653dbd7722f64dc3a7d56cf)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 门店数量 (fdId: d0d91a505826246ddac7b2a0)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dim_加盟商主档` is table('e620121168c3447c3abe4948') extend {
  // Base columns from table:
  //   - 加盟商ID (STRING)
  //   - 加盟商名称 (STRING)
  //   - 加盟商类型 (STRING)
  //   - 联系人 (STRING)
  //   - 手机号Hash (STRING)
  //   - 签约省份 (STRING)
  //   - 入网日期 (DATE)
  //   - 合作状态 (STRING)
  //   - 信用等级 (STRING)
  //   - 保证金金额 (LONG)
  //   - 门店数量 (LONG)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (2)
- **etl_dws_加盟商经营汇总 (7节点·S+J+C)** (DATA_PROCESS_ETL)
  - ID: h6494295926ddfddc3bc9575
- **etl_ads_加盟商单店报告 (9节点·S+J×2+C)** (DATA_PROCESS_ETL)
  - ID: s951c54cfa317c9e7e17524a
