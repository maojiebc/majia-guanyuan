我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: gb9ba62434aa54e3eadc082a
- 数据集名称: dwd_订单商品
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dwd_订单商品
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 2.865073e+06 行
- 字段列数: 7 列

## 时间信息
- 创建时间: 2026-05-21 09:13:46+0800
- 更新时间: 2026-05-21 09:15:18+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 7
- **普通字段**: 7 个
- **计算字段**: 0 个
- **维度字段**: 2 个
- **度量字段**: 5 个

### 字段列表

- 订单ID (fdId: u85c434323b844f54b036600)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 商品序号 (fdId: t0679fc0d24e047388e6b032)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 商品ID (fdId: m84a9107a8c2247799bdafdd)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 数量 (fdId: i7a3e35ade569490c9be942a)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 单价 (fdId: na00cc686eebb46fca9dad1c)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 行金额 (fdId: aa1c5e43c39ff4a0b9b50851)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 是否主商品 (fdId: oba095a2728ac4e7a825a794)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dwd_订单商品` is table('gb9ba62434aa54e3eadc082a') extend {
  // Base columns from table:
  //   - 订单ID (STRING)
  //   - 商品序号 (LONG)
  //   - 商品ID (STRING)
  //   - 数量 (LONG)
  //   - 单价 (DOUBLE)
  //   - 行金额 (DOUBLE)
  //   - 是否主商品 (LONG)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (1)
- **etl_dws_商品销售分析** (DATA_PROCESS_ETL)
  - ID: l6cf2ad96bdd641c9a02447c
