我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: vf66c6e915ad048c49cbcf25
- 数据集名称: dws_加盟回本测算
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_加盟回本测算
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 566 行
- 字段列数: 23 列

## 时间信息
- 创建时间: 2026-05-21 14:45:44+0800
- 更新时间: 2026-05-21 14:45:45+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 23
- **普通字段**: 23 个
- **计算字段**: 0 个
- **维度字段**: 10 个
- **度量字段**: 13 个

### 字段列表

- 门店ID (fdId: u1375d71a090947c4a976b5a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 加盟商ID (fdId: fe45dbbae57154869b12c513)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店类型 (fdId: w8e56307ca9694c1db7e62e4)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 签约日期 (fdId: lef9219bd98424ba7af1b388)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 合同期年数 (fdId: kb6d1f70b29a04e69bd41878)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 到期日 (fdId: o8279f6f2c7464c718b9d1b0)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 分成模型 (fdId: i3ea585ea320446018ede924)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 续约状态 (fdId: oeabc907fc0f14a05bc99192)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 总投资额 (fdId: o4f0a967a2d8e48f7bbf22d3)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 可回收投资 (fdId: b73b6cee6b8ac43f2bb2091b)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 经营月数 (fdId: ce42fa0421187446fab4651f)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 累计营收 (fdId: i618c60c1776a48a389822e3)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 累计店面贡献利润 (fdId: xf3da238630ac4e9c8d73055)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 月均店面贡献利润 (fdId: qbe661d6d87f941a79e0000d)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 平均贡献利润率 (fdId: e2bf5a83abdd44659bd6bf14)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 累计回本率 (fdId: l11b2dd731b7346a98c9c370)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 预计完整回本月数 (fdId: m77cb845de88e46179338531)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 已开业月数 (fdId: cc7493c0d6d224183b994cbf)
  - 字段类型: INT
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 预计完整回本日期 (fdId: i62eea3d7e5e04d77960adfb)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 招商承诺回本月数 (fdId: x939c4ada3bb3456b8c81926)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 回本偏离度 (fdId: k1578ee1614714ac68717cb8)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 回本风险等级 (fdId: je4eb2381ca3a4160b272d57)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 标杆门店标志 (fdId: s99f4775c1d5a46408e44fdb)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_加盟回本测算` is table('vf66c6e915ad048c49cbcf25') extend {
  // Base columns from table:
  //   - 门店ID (STRING)
  //   - 加盟商ID (STRING)
  //   - 门店类型 (STRING)
  //   - 签约日期 (DATE)
  //   - 合同期年数 (LONG)
  //   - 到期日 (DATE)
  //   - 分成模型 (STRING)
  //   - 续约状态 (STRING)
  //   - 总投资额 (LONG)
  //   - 可回收投资 (LONG)
  //   - 经营月数 (LONG)
  //   - 累计营收 (DOUBLE)
  //   - 累计店面贡献利润 (DOUBLE)
  //   - 月均店面贡献利润 (DOUBLE)
  //   - 平均贡献利润率 (DOUBLE)
  //   - 累计回本率 (DOUBLE)
  //   - 预计完整回本月数 (DOUBLE)
  //   - 已开业月数 (INT)
  //   - 预计完整回本日期 (DATE)
  //   - 招商承诺回本月数 (DOUBLE)
  //   - 回本偏离度 (DOUBLE)
  //   - 回本风险等级 (STRING)
  //   - 标杆门店标志 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_加盟回本测算 (9节点·S×3+J+C)** (DATA_PROCESS_ETL)
  - ID: n844deaa4fe2957780f0f542

### 下游资源 (1)
- **etl_ads_加盟商单店报告 (9节点·S+J×2+C)** (DATA_PROCESS_ETL)
  - ID: s951c54cfa317c9e7e17524a
