我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: t2a6721b5e2d04f58ad6b8f9
- 数据集名称: dws_会员同期群留存
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_会员同期群留存
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 48 行
- 字段列数: 3 列

## 时间信息
- 创建时间: 2026-05-21 09:20:37+0800
- 更新时间: 2026-05-21 09:27:55+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 3
- **普通字段**: 3 个
- **计算字段**: 0 个
- **维度字段**: 2 个
- **度量字段**: 1 个

### 字段列表

- 注册月份 (fdId: v3c55ee768b964e289d3f8e9)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 留存桶 (fdId: ub7476ef4a48749e9ab2f344)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 留存人数 (fdId: xc5ed4bd86c89414b8e1680d)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_会员同期群留存` is table('t2a6721b5e2d04f58ad6b8f9') extend {
  // Base columns from table:
  //   - 注册月份 (DATE)
  //   - 留存桶 (STRING)
  //   - 留存人数 (LONG)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_会员同期群留存** (DATA_PROCESS_ETL)
  - ID: ge6799d1eedb34eda93a502b
