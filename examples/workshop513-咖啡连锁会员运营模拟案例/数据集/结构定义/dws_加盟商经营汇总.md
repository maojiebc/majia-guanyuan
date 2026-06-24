我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: e2189adc50d654868b2724d3
- 数据集名称: dws_加盟商经营汇总
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_加盟商经营汇总
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 564 行
- 字段列数: 25 列

## 时间信息
- 创建时间: 2026-05-21 14:44:03+0800
- 更新时间: 2026-05-21 14:44:03+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 25
- **普通字段**: 25 个
- **计算字段**: 0 个
- **维度字段**: 10 个
- **度量字段**: 15 个

### 字段列表

- 加盟商ID (fdId: pf131070a88354ea4adba34c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 加盟商名称 (fdId: i9e09f3f8e2c44b9a98eca2f)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 加盟商类型 (fdId: s7c5fb3b040c541e3b4c8c6c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 签约省份 (fdId: ac51b29c724364295890a2ac)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 合作状态 (fdId: m302742fff7b34c3fa27767a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 信用等级 (fdId: sfbe0214d550142959e5bc19)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 入网日期 (fdId: wd313052f2ef942adb802960)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 月份 (fdId: g3d5a6ed4402640f9bd1150b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 经营门店数 (fdId: f4799dea1243e4cd9bb741d0)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 月总营收 (fdId: a762bdb2e3e3d4937be00f35)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 月总堂食营收 (fdId: j80d06de034cd423aa9ac412)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 月总外卖营收 (fdId: l0fd0aaf62e9448bbbd419ae)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 月总订单数 (fdId: rb80500c93aa44ac98217035)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 月总毛利 (fdId: ifbb0d74f209745a0abc7542)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 月总店面贡献利润 (fdId: t9b485ddf8f324413a344f84)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 月总单店净利润 (fdId: u696151d78aff44928fa2c43)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 平均贡献利润率 (fdId: o42bfebf7b29f4dcb81435a0)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 平均堂食占比 (fdId: vbd1c66f9b5d6439a9fc3243)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 亏损门店数 (fdId: d189e08f71bc9455189686b3)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 盈利门店数 (fdId: u5061c1872e74485185942d0)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 门均营收 (fdId: f8974f5b51e90440b9189433)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 门均贡献利润 (fdId: vb7b7847c7cc645d3a2e3ce6)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 亏损率 (fdId: c0b9341035f23490c8608844)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 经营健康等级 (fdId: vb9792505743741279f3f84c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 续约风险 (fdId: k2ca66190cade4a18931034a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_加盟商经营汇总` is table('e2189adc50d654868b2724d3') extend {
  // Base columns from table:
  //   - 加盟商ID (STRING)
  //   - 加盟商名称 (STRING)
  //   - 加盟商类型 (STRING)
  //   - 签约省份 (STRING)
  //   - 合作状态 (STRING)
  //   - 信用等级 (STRING)
  //   - 入网日期 (DATE)
  //   - 月份 (STRING)
  //   - 经营门店数 (LONG)
  //   - 月总营收 (DOUBLE)
  //   - 月总堂食营收 (DOUBLE)
  //   - 月总外卖营收 (DOUBLE)
  //   - 月总订单数 (LONG)
  //   - 月总毛利 (DOUBLE)
  //   - 月总店面贡献利润 (DOUBLE)
  //   - 月总单店净利润 (DOUBLE)
  //   - 平均贡献利润率 (DOUBLE)
  //   - 平均堂食占比 (DOUBLE)
  //   - 亏损门店数 (LONG)
  //   - 盈利门店数 (LONG)
  //   - 门均营收 (DOUBLE)
  //   - 门均贡献利润 (DOUBLE)
  //   - 亏损率 (DOUBLE)
  //   - 经营健康等级 (STRING)
  //   - 续约风险 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_加盟商经营汇总 (7节点·S+J+C)** (DATA_PROCESS_ETL)
  - ID: h6494295926ddfddc3bc9575
