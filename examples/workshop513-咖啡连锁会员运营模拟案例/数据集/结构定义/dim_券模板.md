我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: m5e3bf1eed73f434280fa950
- 数据集名称: dim_券模板
- 显示类型: EXCEL
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dim_券模板
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 30 行
- 字段列数: 9 列

## 时间信息
- 创建时间: 2026-05-20 18:02:23+0800
- 更新时间: 2026-05-20 18:03:06+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 9
- **普通字段**: 9 个
- **计算字段**: 0 个
- **维度字段**: 5 个
- **度量字段**: 4 个

### 字段列表

- 券模板ID (fdId: c40d533a66899453a91e95c5)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 券名称 (fdId: c69a778a34ef0410c9f2ba23)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 券类型 (fdId: jbde4da0c085d4c768af3c74)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 优惠形式 (fdId: kd3e3562239b34862b3224f4)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 面值 (fdId: o2bc4deabccea4b8b8ef265a)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 使用门槛 (fdId: ac3bba5536d6f428ea0bb45d)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 折扣率 (fdId: r4180b798ca194cfe85db2ac)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 适用品类 (fdId: o30bb14a1c7364fe1bf74b50)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 是否有效 (fdId: f71477b1accfd45e4a8d714b)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dim_券模板` is table('m5e3bf1eed73f434280fa950') extend {
  // Base columns from table:
  //   - 券模板ID (STRING)
  //   - 券名称 (STRING)
  //   - 券类型 (STRING)
  //   - 优惠形式 (STRING)
  //   - 面值 (DOUBLE)
  //   - 使用门槛 (LONG)
  //   - 折扣率 (DOUBLE)
  //   - 适用品类 (STRING)
  //   - 是否有效 (LONG)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (1)
- **etl_dws_券效益分析** (DATA_PROCESS_ETL)
  - ID: v0a6e6562f9984c789f8a8cc
