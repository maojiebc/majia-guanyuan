我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: o0d4c4a0f11dd4411b832c5a
- 数据集名称: dwd_私域事件
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dwd_私域事件
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 200000 行
- 字段列数: 10 列

## 时间信息
- 创建时间: 2026-05-21 09:12:37+0800
- 更新时间: 2026-05-21 09:12:48+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 10
- **普通字段**: 10 个
- **计算字段**: 0 个
- **维度字段**: 10 个
- **度量字段**: 0 个

### 字段列表

- 事件ID (fdId: x732723d1a8534c7b86775c8)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 事件时间 (fdId: od341b2263e9a4eff9f3d71b)
  - 字段类型: TIMESTAMP
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 事件日期 (fdId: j0917d28df496435fbc3f17c)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 事件类型 (fdId: a031c4dced4b6405abf7e53b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员ID (fdId: i1220f461b4254e5eaca410f)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 员工ID (fdId: a777a56fc4c85400098d1d9e)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店ID (fdId: fbb342e4ac6a84a63b9b651c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 来源渠道 (fdId: kc37299cb403c47b481e0e9e)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 标签 (fdId: uc47f8a3f4eea425ca1342a3)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 状态 (fdId: md14b85e662614960867a29e)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dwd_私域事件` is table('o0d4c4a0f11dd4411b832c5a') extend {
  // Base columns from table:
  //   - 事件ID (STRING)
  //   - 事件时间 (TIMESTAMP)
  //   - 事件日期 (DATE)
  //   - 事件类型 (STRING)
  //   - 会员ID (STRING)
  //   - 员工ID (STRING)
  //   - 门店ID (STRING)
  //   - 来源渠道 (STRING)
  //   - 标签 (STRING)
  //   - 状态 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系
