我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: x808f7e31adc4423e9471801
- 数据集名称: dws_会员生命周期
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_会员生命周期
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 80000 行
- 字段列数: 15 列

## 时间信息
- 创建时间: 2026-05-21 09:24:36+0800
- 更新时间: 2026-05-21 09:27:26+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 15
- **普通字段**: 15 个
- **计算字段**: 0 个
- **维度字段**: 9 个
- **度量字段**: 6 个

### 字段列表

- 会员ID (fdId: c37dff805d6574762938949a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员等级 (fdId: x16b96b644dc54130a614ad5)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 注册日期 (fdId: f8c0a6ab68d9e4b81b053b1c)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 注册渠道 (fdId: i64488e4a0d5c4ed0b73c5e5)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 注册门店ID (fdId: w3fd8a46f7e8742df94565c9)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市 (fdId: paf3eb8648a3242548212223)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 注册天数 (fdId: i57bc1000e01b41609729bd5)
  - 字段类型: INT
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 首单日期 (fdId: x03f9662517c44a30a71ac86)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 末单日期 (fdId: o7b6e5e8c04044e7e969a037)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 总订单数 (fdId: t4125fafd96ed4ebdaa972f8)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 总消费金额 (fdId: t9b76fe0e02f74c19b26cf17)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 近30天订单 (fdId: a0d17c145d1df4a6382e6ec9)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 近7天订单 (fdId: ka96af32758024b618609875)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 距末单天数 (fdId: a7b62705051064e48b92294c)
  - 字段类型: INT
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 生命周期阶段 (fdId: k7e0ef21071d84c4382f978f)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_会员生命周期` is table('x808f7e31adc4423e9471801') extend {
  // Base columns from table:
  //   - 会员ID (STRING)
  //   - 会员等级 (STRING)
  //   - 注册日期 (DATE)
  //   - 注册渠道 (STRING)
  //   - 注册门店ID (STRING)
  //   - 城市 (STRING)
  //   - 注册天数 (INT)
  //   - 首单日期 (DATE)
  //   - 末单日期 (DATE)
  //   - 总订单数 (LONG)
  //   - 总消费金额 (DOUBLE)
  //   - 近30天订单 (LONG)
  //   - 近7天订单 (LONG)
  //   - 距末单天数 (INT)
  //   - 生命周期阶段 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_会员生命周期** (DATA_PROCESS_ETL)
  - ID: n8c42426e84ac4c81a755a03
