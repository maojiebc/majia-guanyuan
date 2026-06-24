我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: nda316bda403346669b3fa1d
- 数据集名称: ads_会员经营任务池
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>ads_会员经营任务池
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 50000 行
- 字段列数: 32 列

## 时间信息
- 创建时间: 2026-05-21 09:21:42+0800
- 更新时间: 2026-05-21 15:34:26+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 32
- **普通字段**: 32 个
- **计算字段**: 0 个
- **维度字段**: 28 个
- **度量字段**: 4 个

### 字段列表

- 任务ID (fdId: hcd3cbf6928444924be57dd5)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 任务优先级 (fdId: h1b8ebbf438e94819924a96f)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 任务类型 (fdId: p71bc15997bed48148339a62)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 任务来源 (fdId: j1b053522255b4ab487c60bb)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员ID (fdId: f3b0ba1eb636b4a63914fd82)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员等级 (fdId: qdcdfc61f923f4948b689b97)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员城市 (fdId: d885b533c2e894408bb97b7e)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 归属门店ID (fdId: rc36b42866bc7462c86fc50d)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店名称 (fdId: wdbf082b415594d72b1909a3)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店城市 (fdId: ra8c4972b32a84c3b971a33c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 店型 (fdId: o99c04c89bc144b0c8ac631a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店类型 (fdId: g24f2ed1f78ff44a387ca324)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 员工导购ID (fdId: q861aa36644b4434e95dc1e1)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 员工姓名 (fdId: ob6a0e11f3f9b41bd8d20525)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 岗位 (fdId: m8712a85a278448998c08959)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 角色标签 (fdId: e52b0fb9118174c7f95d50ab)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 人群标签 (fdId: l41eff1c7ec4e453097f9770)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 推荐动作 (fdId: vfa76a1dfab68404db612848)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 推荐权益 (fdId: kaca0c5c03d344b97a6cdbdd)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 推荐原因 (fdId: vab714c937e3c4a8db95ac3b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 预计价值 (fdId: ie4fb7f68807e41e5bba3239)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 任务生成时间 (fdId: w42b0e26047f44666aa1c322)
  - 字段类型: TIMESTAMP
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 任务截止时间 (fdId: n71501cddfaa14b7c943747f)
  - 字段类型: TIMESTAMP
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 任务失效时间 (fdId: b9b00c6c4884b4aa3a05429b)
  - 字段类型: TIMESTAMP
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 触达状态 (fdId: ef8dc1b7e75354829b695856)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 触达时间 (fdId: le85dc34c1bb14513b670a59)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 触达方式 (fdId: ae98d79d5dc13498295ee69c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 触达后下单 (fdId: r9ac98dd50b56497ba17e642)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 触达后下单金额 (fdId: t568787f4792d468389a5e69)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 任务结果 (fdId: ted9b63f581494424a8fceab)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 执行状态 (fdId: b96b8ea4210e346ab98d6fa2)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 转化阶段 (fdId: d104ec5ec1ccb4041b81468c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `ads_会员经营任务池` is table('nda316bda403346669b3fa1d') extend {
  // Base columns from table:
  //   - 任务ID (STRING)
  //   - 任务优先级 (STRING)
  //   - 任务类型 (STRING)
  //   - 任务来源 (STRING)
  //   - 会员ID (STRING)
  //   - 会员等级 (STRING)
  //   - 会员城市 (STRING)
  //   - 归属门店ID (STRING)
  //   - 门店名称 (STRING)
  //   - 门店城市 (STRING)
  //   - 店型 (STRING)
  //   - 门店类型 (STRING)
  //   - 员工导购ID (STRING)
  //   - 员工姓名 (STRING)
  //   - 岗位 (STRING)
  //   - 角色标签 (STRING)
  //   - 人群标签 (STRING)
  //   - 推荐动作 (STRING)
  //   - 推荐权益 (STRING)
  //   - 推荐原因 (STRING)
  //   - 预计价值 (DOUBLE)
  //   - 任务生成时间 (TIMESTAMP)
  //   - 任务截止时间 (TIMESTAMP)
  //   - 任务失效时间 (TIMESTAMP)
  //   - 触达状态 (STRING)
  //   - 触达时间 (LONG)
  //   - 触达方式 (STRING)
  //   - 触达后下单 (LONG)
  //   - 触达后下单金额 (DOUBLE)
  //   - 任务结果 (STRING)
  //   - 执行状态 (STRING)
  //   - 转化阶段 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **ads_会员经营任务池** (DATA_PROCESS_ETL)
  - ID: feb59f5aa87e249c681d88da

### 下游资源 (1)
- **03-会员经营任务池** (DATA_ANALYSIS_PAGE)
  - ID: defb99073b4e9c029bc7c05d
