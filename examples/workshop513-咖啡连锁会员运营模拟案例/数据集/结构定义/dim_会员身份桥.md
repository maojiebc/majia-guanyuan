我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: t4e218b665ef647018afdc28
- 数据集名称: dim_会员身份桥
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dim_会员身份桥
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 120000 行
- 字段列数: 14 列

## 时间信息
- 创建时间: 2026-05-20 18:04:54+0800
- 更新时间: 2026-05-20 18:08:54+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 14
- **普通字段**: 14 个
- **计算字段**: 0 个
- **维度字段**: 13 个
- **度量字段**: 1 个

### 字段列表

- 身份桥ID (fdId: k05a6e216594745c7bdaab46)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员ID (fdId: me22042369a7e4510bc154b1)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员卡号 (fdId: bc80e8bab4a684177b5e49ee)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 手机号Hash (fdId: gd205d6adba2f45c78a4e1de)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 微信OpenID (fdId: g1e58d4ef82494a458120d9b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 微信UnionID (fdId: v762e797de3f747a4b852586)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 企微外部联系人ID (fdId: hda92da216dc6429e8c6c46a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 支付渠道用户ID (fdId: ne62c1a13afb14c0ca637ae2)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 身份类型 (fdId: ac449d9280d4d43bc815631a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 绑定状态 (fdId: bacb7a2f18cfb4508b7ca9ab)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 首次出现时间 (fdId: le0ca8a6e946d47ec89f0983)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 最近出现时间 (fdId: c0199bf58e1ff4d5e92638a1)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 匹配置信度 (fdId: ka4b22c2d2d81421da166b2e)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 匹配方式 (fdId: c9c897483d41d4c1d812f42f)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dim_会员身份桥` is table('t4e218b665ef647018afdc28') extend {
  // Base columns from table:
  //   - 身份桥ID (STRING)
  //   - 会员ID (STRING)
  //   - 会员卡号 (STRING)
  //   - 手机号Hash (STRING)
  //   - 微信OpenID (STRING)
  //   - 微信UnionID (STRING)
  //   - 企微外部联系人ID (STRING)
  //   - 支付渠道用户ID (STRING)
  //   - 身份类型 (STRING)
  //   - 绑定状态 (STRING)
  //   - 首次出现时间 (DATE)
  //   - 最近出现时间 (DATE)
  //   - 匹配置信度 (DOUBLE)
  //   - 匹配方式 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系
