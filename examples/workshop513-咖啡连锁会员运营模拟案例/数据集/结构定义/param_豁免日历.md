我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: idc628b87ed3a4f1d91e5e1c
- 数据集名称: param_豁免日历
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>param_豁免日历
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 16 行
- 字段列数: 3 列

## 时间信息
- 创建时间: 2026-06-12 02:55:00+0800
- 更新时间: 2026-06-12 02:59:10+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 3
- **普通字段**: 3 个
- **计算字段**: 0 个
- **维度字段**: 2 个
- **度量字段**: 1 个

### 字段列表

- 门店类型 (fdId: m0e70103de2994f8ba0d6f39)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 豁免月份 (fdId: ed963690ff6884371b919a5c)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 豁免原因 (fdId: t63d0405c6006472997578f8)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `param_豁免日历` is table('idc628b87ed3a4f1d91e5e1c') extend {
  // Base columns from table:
  //   - 门店类型 (STRING)
  //   - 豁免月份 (DOUBLE)
  //   - 豁免原因 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (1)
- **etl_ads_异常归因清单** (DATA_PROCESS_ETL)
  - ID: teb265115511846f1bc47f0b
