我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: i2e9c28c8e656429ca007f68
- 数据集名称: dws_会员RFM分层
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_会员RFM分层
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 69264 行
- 字段列数: 13 列

## 时间信息
- 创建时间: 2026-05-21 09:19:54+0800
- 更新时间: 2026-05-21 12:15:11+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 13
- **普通字段**: 13 个
- **计算字段**: 0 个
- **维度字段**: 6 个
- **度量字段**: 7 个

### 字段列表

- 会员ID (fdId: u134ab9dc351947328fd66e1)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员等级 (fdId: pfd23ebdf10b44b11bb750ef)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 注册渠道 (fdId: w5c544b962c694759953d195)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市 (fdId: odcd8f4fa0dba402297fa27e)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 最近消费日期 (fdId: td8c616d383c841a3b91eb94)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 距今天数 (fdId: t229cb02b2a5b4c27a443583)
  - 字段类型: INT
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 消费次数 (fdId: j5a1e30477f5743a59ca6ca0)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 消费金额 (fdId: na86cb922dcf34a52a9283f2)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- R分 (fdId: gd5718c383bd44142bc3eaed)
  - 字段类型: INT
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- F分 (fdId: uf6a676eeca174fce976bbc2)
  - 字段类型: INT
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- M分 (fdId: t6d1814d487024348b6a315b)
  - 字段类型: INT
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- RFM总分 (fdId: idbed11a1d93048a3a904e80)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- RFM标签 (fdId: r4f11621f203842c09698a1c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_会员RFM分层` is table('i2e9c28c8e656429ca007f68') extend {
  // Base columns from table:
  //   - 会员ID (STRING)
  //   - 会员等级 (STRING)
  //   - 注册渠道 (STRING)
  //   - 城市 (STRING)
  //   - 最近消费日期 (DATE)
  //   - 距今天数 (INT)
  //   - 消费次数 (LONG)
  //   - 消费金额 (DOUBLE)
  //   - R分 (INT)
  //   - F分 (INT)
  //   - M分 (INT)
  //   - RFM总分 (LONG)
  //   - RFM标签 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_会员RFM分层 (10节点·F+C+G+S+J)** (DATA_PROCESS_ETL)
  - ID: c4bd62b609bf4449ca4a09fc

### 下游资源 (1)
- **02-会员私域驾驶舱** (DATA_ANALYSIS_PAGE)
  - ID: vcfce6dc372db7a906517eb3
