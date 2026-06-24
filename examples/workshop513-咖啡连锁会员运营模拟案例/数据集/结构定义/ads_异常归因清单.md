我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: tf166544dfa5b407593e22ec
- 数据集名称: ads_异常归因清单
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>ads_异常归因清单
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 6115 行
- 字段列数: 15 列

## 时间信息
- 创建时间: 2026-06-12 02:57:47+0800
- 更新时间: 2026-06-24 10:46:30+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 15
- **普通字段**: 15 个
- **计算字段**: 0 个
- **维度字段**: 15 个
- **度量字段**: 0 个

### 字段列表

- 业务日期 (fdId: r3ca72edd2b7241fc84ed5d9)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 粒度 (fdId: f4ef09538539c43168ba9206)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店ID (fdId: e01f15e58694f46d79602a00)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店名称 (fdId: nae56370e88864118864c437)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店类型 (fdId: a3848663f24424728b0b3d4a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市 (fdId: t6bff4bb1e433472ca003ddf)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 店长姓名 (fdId: i9e050239d4034b8ba17ef9c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 区域经理 (fdId: o3197b0df44044813a30d37c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 异常来源 (fdId: gd50b4ac39b8f49119e411af)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 异常类型 (fdId: nd0b38a3b9eca4f03b122aa3)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 异常详情 (fdId: p2201228cb8bc41eba42b0dc)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 风险等级 (fdId: n91149da05b80411e8c73105)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 豁免标记 (fdId: vbefb2b82d61542c5b80f8bf)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 处理状态 (fdId: bbb314526a918468e87bafda)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 建议动作 (fdId: wa3ba90aaae7b4982a20ec55)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `ads_异常归因清单` is table('tf166544dfa5b407593e22ec') extend {
  // Base columns from table:
  //   - 业务日期 (DATE)
  //   - 粒度 (STRING)
  //   - 门店ID (STRING)
  //   - 门店名称 (STRING)
  //   - 门店类型 (STRING)
  //   - 城市 (STRING)
  //   - 店长姓名 (STRING)
  //   - 区域经理 (STRING)
  //   - 异常来源 (STRING)
  //   - 异常类型 (STRING)
  //   - 异常详情 (STRING)
  //   - 风险等级 (STRING)
  //   - 豁免标记 (STRING)
  //   - 处理状态 (STRING)
  //   - 建议动作 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_ads_异常归因清单** (DATA_PROCESS_ETL)
  - ID: teb265115511846f1bc47f0b

### 下游资源 (2)
- **etl_dqc_归因清单对账** (DATA_PROCESS_ETL)
  - ID: l63a55ec75d7f45418e42823
- **10-异常归因作战页** (DATA_ANALYSIS_PAGE)
  - ID: pd73a4ff1a76bad8f64799f8
