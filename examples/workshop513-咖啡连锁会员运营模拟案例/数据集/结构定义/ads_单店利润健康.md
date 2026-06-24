我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: p39cc9d0866ac442bb777c63
- 数据集名称: ads_单店利润健康
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>ads_单店利润健康
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 4661 行
- 字段列数: 37 列

## 时间信息
- 创建时间: 2026-05-21 14:47:30+0800
- 更新时间: 2026-05-21 14:47:31+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 37
- **普通字段**: 37 个
- **计算字段**: 0 个
- **维度字段**: 17 个
- **度量字段**: 20 个

### 字段列表

- 门店ID (fdId: fbc4f3e7baa4e4033a994762)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店名称 (fdId: maa51d4e434754a289ea4149)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 省份 (fdId: keeaeb29b6efb40c9a46d9f0)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市 (fdId: j44b4cc8d458f4dbe949643b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市层级 (fdId: n9a2c8c4dea2a4e029564dad)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店类型 (fdId: ea3a9e4d8bd0e4afdb5a5159)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 商圈 (fdId: w94b0308fe89443008b6dbd8)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 直营加盟类型 (fdId: i37cf1dbaff5140d2be9afd2)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 月份 (fdId: wefc2f54c3556437e8afcc0d)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 月营收 (fdId: f5d51c7f4fc4a41ef92024fe)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 毛利 (fdId: c70d9b5a04a354056ac030e7)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 店面贡献利润 (fdId: x6b526f37d987477586eff2a)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 单店净利润 (fdId: i0411da3374184c01aaf1d9f)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 毛利率 (fdId: b6f706b5540ee4e69a8fe26a)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 店面贡献利润率 (fdId: ldb1547b8f64649209caa71f)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 单店净利率 (fdId: uf52eee6c122a4f5893c3848)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 堂食占比 (fdId: eb44127251126456ab67ff30)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 外卖占比 (fdId: bf40a2f48ff5d42bea27a1ea)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 人工占比 (fdId: x01fba14ffb974bcf98ba3bd)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 房租占比 (fdId: p22ede4f431de42d0a0535e5)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 客单价 (fdId: v4ef38265570d403ead53dca)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 房租占比上限 (fdId: vdbea42006916427eb9ce82a)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 人工占比上限 (fdId: c83570fc1dbb646209111fd7)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 堂食占比下限 (fdId: o64753f0da9a44adf9b7fbe9)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 持续亏损预警月数 (fdId: gca22cdae45f84380ae76829)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 毛利率塌方阈值pp (fdId: t64e7248b93b34a45b0fc53c)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 适用范围 (fdId: t2c69587618944304b94f29e)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 房租超标 (fdId: mb3f1702816c744f0a1b1b40)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 人工超标 (fdId: h7ebb483017a24dc0b393ed5)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 堂食衰减 (fdId: q4fe9b81490cf4fefb6fc1de)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 本月亏损 (fdId: xc695305438ea4920bb45f58)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 利润健康等级 (fdId: h5b5e04d3b9a8445ba17faf2)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 预警条数 (fdId: o31fa171136394838bdf5e08)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 建议动作 (fdId: ha69f7786b5f641418272bb6)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 历史亏损月数 (fdId: q5f1ca1bd687449f18830eed)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 近3月有亏损 (fdId: d4fe9577729874901a896118)
  - 字段类型: INT
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 持续亏损标签 (fdId: nadcc9baba3fb4915a12d7a2)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `ads_单店利润健康` is table('p39cc9d0866ac442bb777c63') extend {
  // Base columns from table:
  //   - 门店ID (STRING)
  //   - 门店名称 (STRING)
  //   - 省份 (STRING)
  //   - 城市 (STRING)
  //   - 城市层级 (STRING)
  //   - 门店类型 (STRING)
  //   - 商圈 (STRING)
  //   - 直营加盟类型 (STRING)
  //   - 月份 (STRING)
  //   - 月营收 (DOUBLE)
  //   - 毛利 (DOUBLE)
  //   - 店面贡献利润 (DOUBLE)
  //   - 单店净利润 (DOUBLE)
  //   - 毛利率 (DOUBLE)
  //   - 店面贡献利润率 (DOUBLE)
  //   - 单店净利率 (DOUBLE)
  //   - 堂食占比 (DOUBLE)
  //   - 外卖占比 (DOUBLE)
  //   - 人工占比 (DOUBLE)
  //   - 房租占比 (DOUBLE)
  //   - 客单价 (DOUBLE)
  //   - 房租占比上限 (DOUBLE)
  //   - 人工占比上限 (DOUBLE)
  //   - 堂食占比下限 (DOUBLE)
  //   - 持续亏损预警月数 (LONG)
  //   - 毛利率塌方阈值pp (DOUBLE)
  //   - 适用范围 (STRING)
  //   - 房租超标 (STRING)
  //   - 人工超标 (STRING)
  //   - 堂食衰减 (STRING)
  //   - 本月亏损 (STRING)
  //   - 利润健康等级 (STRING)
  //   - 预警条数 (LONG)
  //   - 建议动作 (STRING)
  //   - 历史亏损月数 (LONG)
  //   - 近3月有亏损 (INT)
  //   - 持续亏损标签 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_ads_单店利润健康 (6节点·J+C+S)** (DATA_PROCESS_ETL)
  - ID: r6e540f679bb0a514080e509

### 下游资源 (3)
- **etl_ads_异常归因清单** (DATA_PROCESS_ETL)
  - ID: teb265115511846f1bc47f0b
- **etl_dqc_归因清单对账** (DATA_PROCESS_ETL)
  - ID: l63a55ec75d7f45418e42823
- **07-单店利润健康** (DATA_ANALYSIS_PAGE)
  - ID: mf8fa8eea789f71cbf61c87d
