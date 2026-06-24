我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: s44dad3e0887d41dcb5dfc52
- 数据集名称: dws_渠道迁移分析
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_渠道迁移分析
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 69264 行
- 字段列数: 8 列

## 时间信息
- 创建时间: 2026-05-21 09:21:18+0800
- 更新时间: 2026-05-21 09:28:32+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 8
- **普通字段**: 8 个
- **计算字段**: 0 个
- **维度字段**: 4 个
- **度量字段**: 4 个

### 字段列表

- 会员ID (fdId: u7af39bdcd17340f7961cc1a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员等级 (fdId: a0247a3c429dc41f3a86b999)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市 (fdId: qc50f2b3d08e24e4f886e0cf)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 近30天堂食 (fdId: i3e7ad8cc2f234b559d16716)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 近30天外卖 (fdId: w5f45291970bc4a23a6b7baa)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 前60天堂食 (fdId: m21a42c7691564f1fbc6d498)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 前60天外卖 (fdId: d72745914a3244471b34b2a2)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 迁移类型 (fdId: fc9a51d3b79f74d47a20ac5c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_渠道迁移分析` is table('s44dad3e0887d41dcb5dfc52') extend {
  // Base columns from table:
  //   - 会员ID (STRING)
  //   - 会员等级 (STRING)
  //   - 城市 (STRING)
  //   - 近30天堂食 (LONG)
  //   - 近30天外卖 (LONG)
  //   - 前60天堂食 (LONG)
  //   - 前60天外卖 (LONG)
  //   - 迁移类型 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_渠道迁移分析** (DATA_PROCESS_ETL)
  - ID: c5362567a2d0a402881968b3
