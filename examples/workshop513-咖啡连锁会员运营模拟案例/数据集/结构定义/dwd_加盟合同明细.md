我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: w55d0570b98a143579807416
- 数据集名称: dwd_加盟合同明细
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dwd_加盟合同明细
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 566 行
- 字段列数: 18 列

## 时间信息
- 创建时间: 2026-05-21 14:34:44+0800
- 更新时间: 2026-05-21 14:34:50+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 18
- **普通字段**: 18 个
- **计算字段**: 0 个
- **维度字段**: 10 个
- **度量字段**: 8 个

### 字段列表

- 合同ID (fdId: l00cbe0cfe5cc44e98116b84)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 加盟商ID (fdId: u473d6bcf06e44c1cb9433d6)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店ID (fdId: gc17988600c064622b278c22)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店类型 (fdId: hf70cd918789349809d63ca9)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 签约日期 (fdId: udef86975d93d4608b6f244d)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 合同期年数 (fdId: q93f4ef4927ae4e9b9e4802f)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 到期日 (fdId: f32331900ffe743d3809431f)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 分成模型 (fdId: k742eb3e44cb744989a6d22a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 流水抽成率 (fdId: i54b7a9d455b045a0b116ea5)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 年加盟费 (fdId: pd291f6f407d94a5097d2d57)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 装修标准 (fdId: q1d4338396db7485583c36d4)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 装修投入金额 (fdId: h1d74d9fba56e4b25a7b70f6)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 设备投入金额 (fdId: r2a621b0846454dd08f602b5)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 加盟费金额 (fdId: i336a8b7ce4184b5a84af181)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 保证金金额 (fdId: u7082ed33a33b4832bb33a2c)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 总投资额 (fdId: xc3134f4c211b4ea989cebe8)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 续约状态 (fdId: qe73ff7fa3aed42489c243a1)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 合同状态 (fdId: q2c881b287a0749afa1e066c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dwd_加盟合同明细` is table('w55d0570b98a143579807416') extend {
  // Base columns from table:
  //   - 合同ID (STRING)
  //   - 加盟商ID (STRING)
  //   - 门店ID (STRING)
  //   - 门店类型 (STRING)
  //   - 签约日期 (DATE)
  //   - 合同期年数 (LONG)
  //   - 到期日 (DATE)
  //   - 分成模型 (STRING)
  //   - 流水抽成率 (DOUBLE)
  //   - 年加盟费 (LONG)
  //   - 装修标准 (STRING)
  //   - 装修投入金额 (LONG)
  //   - 设备投入金额 (LONG)
  //   - 加盟费金额 (LONG)
  //   - 保证金金额 (LONG)
  //   - 总投资额 (LONG)
  //   - 续约状态 (STRING)
  //   - 合同状态 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (3)
- **etl_dws_加盟商经营汇总 (7节点·S+J+C)** (DATA_PROCESS_ETL)
  - ID: h6494295926ddfddc3bc9575
- **etl_dws_加盟回本测算 (9节点·S×3+J+C)** (DATA_PROCESS_ETL)
  - ID: n844deaa4fe2957780f0f542
- **etl_ads_加盟商单店报告 (9节点·S+J×2+C)** (DATA_PROCESS_ETL)
  - ID: s951c54cfa317c9e7e17524a
