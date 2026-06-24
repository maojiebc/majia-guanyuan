我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: l9312c8ef7ec14877889f06b
- 数据集名称: param_利润健康阈值
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>param_利润健康阈值
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 9 行
- 字段列数: 7 列

## 时间信息
- 创建时间: 2026-05-21 14:25:42+0800
- 更新时间: 2026-06-12 02:53:40+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 7
- **普通字段**: 7 个
- **计算字段**: 0 个
- **维度字段**: 2 个
- **度量字段**: 5 个

### 字段列表

- 门店类型 (fdId: i5db8059b62ca4f74ba74068)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 房租占比上限 (fdId: hc4f817647e0848faa2b2570)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 人工占比上限 (fdId: c0a32854ce7ea4cedbf9dfb9)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 堂食占比下限 (fdId: me2503172432143048413a4c)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 持续亏损预警月数 (fdId: wfc308b65e96948eb885924f)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 毛利率塌方阈值pp (fdId: jf2a59314503949fcbc64219)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 适用范围 (fdId: j78fb9f1b047a4056b0eece3)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `param_利润健康阈值` is table('l9312c8ef7ec14877889f06b') extend {
  // Base columns from table:
  //   - 门店类型 (STRING)
  //   - 房租占比上限 (DOUBLE)
  //   - 人工占比上限 (DOUBLE)
  //   - 堂食占比下限 (DOUBLE)
  //   - 持续亏损预警月数 (LONG)
  //   - 毛利率塌方阈值pp (DOUBLE)
  //   - 适用范围 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (2)
- **etl_ads_单店利润健康 (6节点·J+C+S)** (DATA_PROCESS_ETL)
  - ID: r6e540f679bb0a514080e509
- **etl_dqc_归因清单对账** (DATA_PROCESS_ETL)
  - ID: l63a55ec75d7f45418e42823
