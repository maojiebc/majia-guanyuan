我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: m6fdb5eaefa5742ef9e0ac58
- 数据集名称: dim_员工导购
- 显示类型: EXCEL
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dim_员工导购
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 600 行
- 字段列数: 8 列

## 时间信息
- 创建时间: 2026-05-20 18:03:27+0800
- 更新时间: 2026-05-20 18:03:41+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 8
- **普通字段**: 8 个
- **计算字段**: 0 个
- **维度字段**: 8 个
- **度量字段**: 0 个

### 字段列表

- 员工ID (fdId: t5d265bf554a1458eb8ab39c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 姓名 (fdId: e6e34b10ccfaa44bfa3013fd)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 归属门店ID (fdId: ia758f294a4314185bd8cf9c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 岗位 (fdId: e5f6fa12f5625490c81e6b58)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 角色标签 (fdId: ge397f8764040408ab0e89c7)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 入职日期 (fdId: q8d069453b6804c68aa7f954)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 状态 (fdId: ld1e7faffd00246369e1ce97)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 员工等级 (fdId: necd6e9ccc4bb42d7949070a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dim_员工导购` is table('m6fdb5eaefa5742ef9e0ac58') extend {
  // Base columns from table:
  //   - 员工ID (STRING)
  //   - 姓名 (STRING)
  //   - 归属门店ID (STRING)
  //   - 岗位 (STRING)
  //   - 角色标签 (STRING)
  //   - 入职日期 (DATE)
  //   - 状态 (STRING)
  //   - 员工等级 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (2)
- **etl_dws_员工导购效能 (8节点·F+S+J+C)** (DATA_PROCESS_ETL)
  - ID: heeb294b1dbc041318ea5aaf
- **ads_会员经营任务池** (DATA_PROCESS_ETL)
  - ID: feb59f5aa87e249c681d88da
