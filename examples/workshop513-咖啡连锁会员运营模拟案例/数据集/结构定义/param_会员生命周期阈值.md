我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: jc8be722fd6cb49fa87206f0
- 数据集名称: param_会员生命周期阈值
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>param_会员生命周期阈值
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 9 行
- 字段列数: 3 列

## 时间信息
- 创建时间: 2026-06-13 01:00:51+0800
- 更新时间: 2026-06-13 01:01:29+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 3
- **普通字段**: 3 个
- **计算字段**: 0 个
- **维度字段**: 2 个
- **度量字段**: 1 个

### 字段列表

- 门店类型 (fdId: b5c8ebef0c9ff4607996133a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员占比月降幅预警 (fdId: u36a789b8f38544ffbcb2c5b)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 定标方法 (fdId: s4ed0a5879d624a76bc82060)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `param_会员生命周期阈值` is table('jc8be722fd6cb49fa87206f0') extend {
  // Base columns from table:
  //   - 门店类型 (STRING)
  //   - 会员占比月降幅预警 (DOUBLE)
  //   - 定标方法 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (2)
- **etl_ads_异常归因清单** (DATA_PROCESS_ETL)
  - ID: teb265115511846f1bc47f0b
- **etl_dqc_归因清单对账** (DATA_PROCESS_ETL)
  - ID: l63a55ec75d7f45418e42823
