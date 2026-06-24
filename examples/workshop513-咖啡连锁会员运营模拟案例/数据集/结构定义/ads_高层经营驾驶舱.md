我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: r9024c50adcdb45c397cde0a
- 数据集名称: ads_高层经营驾驶舱
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>ads_高层经营驾驶舱
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 91 行
- 字段列数: 11 列

## 时间信息
- 创建时间: 2026-05-21 09:22:14+0800
- 更新时间: 2026-05-21 09:33:30+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 11
- **普通字段**: 11 个
- **计算字段**: 0 个
- **维度字段**: 1 个
- **度量字段**: 10 个

### 字段列表

- 业务日期 (fdId: d8ff2ac6c171e423fa8b3c0f)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 总销售 (fdId: t6df47b1f4ed243e8a519747)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 会员销售 (fdId: g76d60ceac2c94cd1a7e09e7)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 到店销售 (fdId: d9b4f0e6e72cc4235bd803e3)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 总订单数 (fdId: te0f42b779ebb4a64bd2b912)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 活跃会员数 (fdId: ie9a600ffcd5b49ecabc1a55)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 新增会员数 (fdId: x46a46405d823429f9775449)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 私域贡献销售 (fdId: ddf699c12cefc4d6e8ce82aa)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 会员销售占比 (fdId: kf3311d3783154d209709fea)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 到店订单占比 (fdId: c68c6a5dd88ea4ccc82a2c08)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 私域贡献收入占比 (fdId: k76f9ee69c70c4601a6f1ddd)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `ads_高层经营驾驶舱` is table('r9024c50adcdb45c397cde0a') extend {
  // Base columns from table:
  //   - 业务日期 (DATE)
  //   - 总销售 (DOUBLE)
  //   - 会员销售 (DOUBLE)
  //   - 到店销售 (DOUBLE)
  //   - 总订单数 (LONG)
  //   - 活跃会员数 (LONG)
  //   - 新增会员数 (LONG)
  //   - 私域贡献销售 (DOUBLE)
  //   - 会员销售占比 (DOUBLE)
  //   - 到店订单占比 (DOUBLE)
  //   - 私域贡献收入占比 (DOUBLE)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **ads_高层经营驾驶舱** (DATA_PROCESS_ETL)
  - ID: s85830984b37045b39c1c816

### 下游资源 (1)
- **01-高层经营驾驶舱** (DATA_ANALYSIS_PAGE)
  - ID: l5b686c77ff07c1e21e49d0a
