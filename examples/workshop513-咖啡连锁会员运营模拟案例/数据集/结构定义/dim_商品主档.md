我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: hef208f72e96a4a16a4ebf71
- 数据集名称: dim_商品主档
- 显示类型: EXCEL
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dim_商品主档
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 74 行
- 字段列数: 12 列

## 时间信息
- 创建时间: 2026-05-20 18:02:38+0800
- 更新时间: 2026-05-20 18:03:17+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 12
- **普通字段**: 12 个
- **计算字段**: 0 个
- **维度字段**: 10 个
- **度量字段**: 2 个

### 字段列表

- 商品ID (fdId: q8ca10dac48d34ab4a62dd33)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 商品版本ID (fdId: be10157e8422d4d179dcfc1b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 商品名称 (fdId: tc46a2ed63f6a412093aea87)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 商品编码 (fdId: oe9b56f942ffe4257bafc64d)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 一级类目 (fdId: r74f1442ff20a4a48b82f723)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 二级类目 (fdId: f4705de1e12524265902c703)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 售价 (fdId: h6576edf7ee0c463b9c4fab7)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 成本 (fdId: k6e8c1ed33edb4e369dfd6f2)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 上架日期 (fdId: kf63b7cfbcf3b44d8a6b85d1)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 下架日期 (fdId: k2c6b0a56c9dc43528cb7791)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 是否季节限定 (fdId: p3f6d0a6f82e4461c8871953)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 是否在售 (fdId: wbe6763218ffd444fba118dc)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dim_商品主档` is table('hef208f72e96a4a16a4ebf71') extend {
  // Base columns from table:
  //   - 商品ID (STRING)
  //   - 商品版本ID (STRING)
  //   - 商品名称 (STRING)
  //   - 商品编码 (STRING)
  //   - 一级类目 (STRING)
  //   - 二级类目 (STRING)
  //   - 售价 (LONG)
  //   - 成本 (LONG)
  //   - 上架日期 (DATE)
  //   - 下架日期 (STRING)
  //   - 是否季节限定 (STRING)
  //   - 是否在售 (STRING)

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
