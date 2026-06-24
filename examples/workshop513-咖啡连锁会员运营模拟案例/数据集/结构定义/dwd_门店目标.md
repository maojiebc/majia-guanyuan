我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: g7d7bf84e1e96448f9c0dfe3
- 数据集名称: dwd_门店目标
- 显示类型: EXCEL
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dwd_门店目标
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 14400 行
- 字段列数: 5 列

## 时间信息
- 创建时间: 2026-05-21 09:10:40+0800
- 更新时间: 2026-05-21 09:11:13+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 5
- **普通字段**: 5 个
- **计算字段**: 0 个
- **维度字段**: 4 个
- **度量字段**: 1 个

### 字段列表

- 目标ID (fdId: ke2983970c7c441f5a030ee1)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店ID (fdId: k85ce9254477647cdacb50d3)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 年月 (fdId: we12381a57a364b9f8026abf)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 目标指标 (fdId: l8c524cb777c3448a89e3ef3)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 目标值 (fdId: d6f61244e21b242339547f7f)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dwd_门店目标` is table('g7d7bf84e1e96448f9c0dfe3') extend {
  // Base columns from table:
  //   - 目标ID (STRING)
  //   - 门店ID (STRING)
  //   - 年月 (DATE)
  //   - 目标指标 (STRING)
  //   - 目标值 (LONG)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (1)
- **etl_dws_目标达成** (DATA_PROCESS_ETL)
  - ID: dea6744905a504af3ae9e35c
