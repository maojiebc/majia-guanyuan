我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: h551155a12fc04d88a57d319
- 数据集名称: dim_会员主档
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dim_会员主档
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 80000 行
- 字段列数: 13 列

## 时间信息
- 创建时间: 2026-05-20 18:04:20+0800
- 更新时间: 2026-05-20 18:08:08+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 13
- **普通字段**: 13 个
- **计算字段**: 0 个
- **维度字段**: 12 个
- **度量字段**: 1 个

### 字段列表

- 会员ID (fdId: kc5c3dbe911324129885e1ac)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 注册日期 (fdId: sf7b12cabf2a64238ab971c6)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 注册门店ID (fdId: u347c89f00b66447ab66278f)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 注册渠道 (fdId: ta9ed7ea3569346998cc2dc4)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员等级 (fdId: sb1fadc7534c34367bcfeb65)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 性别 (fdId: s3a35d63f8744415ab7965fe)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 年龄段 (fdId: ice7cdeedf9b74984bed1a00)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 生日 (fdId: l85a908c7728245d6b740a87)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市 (fdId: g833f3f034b3f49898de0c18)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 手机号 (fdId: o9f92893df7034324af39877)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 会员状态 (fdId: da198dac4951a4f6b895f5c3)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 最近活跃日期 (fdId: i8f308678aac94e9a83a8696)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 等级升级日期 (fdId: o565d269ec8724231ae71a7b)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dim_会员主档` is table('h551155a12fc04d88a57d319') extend {
  // Base columns from table:
  //   - 会员ID (STRING)
  //   - 注册日期 (DATE)
  //   - 注册门店ID (STRING)
  //   - 注册渠道 (STRING)
  //   - 会员等级 (STRING)
  //   - 性别 (STRING)
  //   - 年龄段 (STRING)
  //   - 生日 (DATE)
  //   - 城市 (STRING)
  //   - 手机号 (LONG)
  //   - 会员状态 (STRING)
  //   - 最近活跃日期 (STRING)
  //   - 等级升级日期 (DATE)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (5)
- **etl_dws_会员生命周期** (DATA_PROCESS_ETL)
  - ID: n8c42426e84ac4c81a755a03
- **etl_dws_会员同期群留存** (DATA_PROCESS_ETL)
  - ID: ge6799d1eedb34eda93a502b
- **etl_dws_渠道迁移分析** (DATA_PROCESS_ETL)
  - ID: c5362567a2d0a402881968b3
- **etl_dws_会员RFM分层 (10节点·F+C+G+S+J)** (DATA_PROCESS_ETL)
  - ID: c4bd62b609bf4449ca4a09fc
- **ads_会员经营任务池** (DATA_PROCESS_ETL)
  - ID: feb59f5aa87e249c681d88da
