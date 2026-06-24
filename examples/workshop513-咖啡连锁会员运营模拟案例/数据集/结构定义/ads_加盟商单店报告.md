我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: n7e1bd96a3dcf48e88f18022
- 数据集名称: ads_加盟商单店报告
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>ads_加盟商单店报告
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 2189 行
- 字段列数: 51 列

## 时间信息
- 创建时间: 2026-05-21 14:50:31+0800
- 更新时间: 2026-05-21 14:50:31+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 51
- **普通字段**: 51 个
- **计算字段**: 0 个
- **维度字段**: 19 个
- **度量字段**: 32 个

### 字段列表

- 门店ID (fdId: m0f22eac66dde435187b092c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店名称 (fdId: od6da604f80174f8cbbed135)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 省份 (fdId: p0f9ded7d263d44079e4a225)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市 (fdId: ke99262f4f6dc4920a2be5e6)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市层级 (fdId: qc837700f105345a09a7749f)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店类型 (fdId: l611a91648e2e4940830fbf3)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 商圈 (fdId: k5852284807934832a3bf9ee)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 加盟商ID (fdId: h98dfd4e844fa4a2d8372338)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 加盟商名称 (fdId: r5694a02cfb03435fa4054b1)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 加盟商类型 (fdId: e617252ba10d2407683e01d4)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 合作状态 (fdId: sd9bffaa7a6634d5c9e2b141)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 信用等级 (fdId: mceb20b44a0ae4852b2eb4d4)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 签约日期 (fdId: c2d12f253251f4c4fa064a95)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 月份 (fdId: x9511087195ea4e35aae7039)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 月营收 (fdId: b5065ce0f8747426bb81fda8)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 堂食营收 (fdId: c5b6b81e14f9e4ff3a13602c)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 外卖营收 (fdId: ce456ee8a8d9244d785b43e0)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 订单数 (fdId: gbdbefcaebe4f47088d11019)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 毛利 (fdId: q0acdd9289de64202b7ec071)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 店面贡献利润 (fdId: h507270ba8998474eba6a92d)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 单店净利润 (fdId: m8e4c89a0bd9a4c4b984e1b4)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 毛利率 (fdId: ice3ed9f6d7524cf8a2ca008)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 店面贡献利润率 (fdId: rc31399fe6485496fbdf1323)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 堂食占比 (fdId: g25679ce2f194470cacb6bfd)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 外卖占比 (fdId: k08d9959700bc4c2c9ee83a3)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 人工占比 (fdId: a56364b6cff4a48b4beb9130)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 房租占比 (fdId: fc740649cc23b4340a9c954f)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 客单价 (fdId: u86a53591aae14c1483ab662)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 同侪门店数 (fdId: ica249507ea1944079e4c5a2)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 城市同店型_营收_P25 (fdId: lff373aefe89d4f81b201eae)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 城市同店型_营收_中位数 (fdId: l7c121d1bf56c4d29abc56ae)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 城市同店型_营收_P75 (fdId: q926869bf65ef4dc5bfd31bb)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 城市同店型_利润率_P25 (fdId: ef60a6540bdfd4ca79746ad5)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 城市同店型_利润率_中位数 (fdId: i1705393320824335bedb6a5)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 城市同店型_利润率_P75 (fdId: v2fb7e85b829046818ee6282)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 城市同店型_堂食占比_中位数 (fdId: rd8d3d5408b7e42e18202f5f)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 营收_对中位数比 (fdId: n9a991695c7814743801a0d0)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 利润率_对中位数差 (fdId: xefd9e03742e74629a8815d1)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 堂食占比_对中位数差 (fdId: w17b75b3d21644d15b4b3a37)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 总投资额 (fdId: gc894fc2a75464a2bbfd2dcc)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 累计店面贡献利润 (fdId: qbee6223a7f934893ba1bdad)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 累计回本率 (fdId: tb2055cacaa674ae59961f37)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 预计完整回本月数 (fdId: tc351ee015e1a47d1a344765)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 已开业月数 (fdId: s365dd383bbf34de2a90074b)
  - 字段类型: INT
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 招商承诺回本月数 (fdId: i16613fa018c64b51a527a42)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 回本偏离度 (fdId: pff503edbaef2426ca5e6bf9)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 回本风险等级 (fdId: c3d97bf366f0d47a68352fdf)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 标杆门店标志 (fdId: wcda32ada7e5f4115b1dba14)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 本店位置标签 (fdId: ncd37f65208ee421d89eee1f)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 可改进项 (fdId: s653a55a1ffa246c8a6b6320)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 总部本月支持 (fdId: q23b9c340135043e4849f941)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `ads_加盟商单店报告` is table('n7e1bd96a3dcf48e88f18022') extend {
  // Base columns from table:
  //   - 门店ID (STRING)
  //   - 门店名称 (STRING)
  //   - 省份 (STRING)
  //   - 城市 (STRING)
  //   - 城市层级 (STRING)
  //   - 门店类型 (STRING)
  //   - 商圈 (STRING)
  //   - 加盟商ID (STRING)
  //   - 加盟商名称 (STRING)
  //   - 加盟商类型 (STRING)
  //   - 合作状态 (STRING)
  //   - 信用等级 (STRING)
  //   - 签约日期 (DATE)
  //   - 月份 (STRING)
  //   - 月营收 (DOUBLE)
  //   - 堂食营收 (DOUBLE)
  //   - 外卖营收 (DOUBLE)
  //   - 订单数 (LONG)
  //   - 毛利 (DOUBLE)
  //   - 店面贡献利润 (DOUBLE)
  //   - 单店净利润 (DOUBLE)
  //   - 毛利率 (DOUBLE)
  //   - 店面贡献利润率 (DOUBLE)
  //   - 堂食占比 (DOUBLE)
  //   - 外卖占比 (DOUBLE)
  //   - 人工占比 (DOUBLE)
  //   - 房租占比 (DOUBLE)
  //   - 客单价 (DOUBLE)
  //   - 同侪门店数 (LONG)
  //   - 城市同店型_营收_P25 (DOUBLE)
  //   - 城市同店型_营收_中位数 (DOUBLE)
  //   - 城市同店型_营收_P75 (DOUBLE)
  //   - 城市同店型_利润率_P25 (DOUBLE)
  //   - 城市同店型_利润率_中位数 (DOUBLE)
  //   - 城市同店型_利润率_P75 (DOUBLE)
  //   - 城市同店型_堂食占比_中位数 (DOUBLE)
  //   - 营收_对中位数比 (DOUBLE)
  //   - 利润率_对中位数差 (DOUBLE)
  //   - 堂食占比_对中位数差 (DOUBLE)
  //   - 总投资额 (LONG)
  //   - 累计店面贡献利润 (DOUBLE)
  //   - 累计回本率 (DOUBLE)
  //   - 预计完整回本月数 (DOUBLE)
  //   - 已开业月数 (INT)
  //   - 招商承诺回本月数 (DOUBLE)
  //   - 回本偏离度 (DOUBLE)
  //   - 回本风险等级 (STRING)
  //   - 标杆门店标志 (STRING)
  //   - 本店位置标签 (STRING)
  //   - 可改进项 (STRING)
  //   - 总部本月支持 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_ads_加盟商单店报告 (9节点·S+J×2+C)** (DATA_PROCESS_ETL)
  - ID: s951c54cfa317c9e7e17524a

### 下游资源 (1)
- **08-加盟商单店报告** (DATA_ANALYSIS_PAGE)
  - ID: fa189510e4ce38db268dfc20
