我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: p2bcc84756ad94855896dd97
- 数据集名称: ads_会员私域驾驶舱
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>ads_会员私域驾驶舱
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 4 行
- 字段列数: 11 列

## 时间信息
- 创建时间: 2026-05-21 09:21:50+0800
- 更新时间: 2026-05-21 09:29:01+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 11
- **普通字段**: 11 个
- **计算字段**: 0 个
- **维度字段**: 1 个
- **度量字段**: 10 个

### 字段列表

- 年月 (fdId: b9e81412ec76548309899a0f)
  - 字段类型: TIMESTAMP
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 当月活跃会员 (fdId: kd2bc1cd90cbb47629ddd324)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 新增首单会员 (fdId: n443eb318cf8244d2a451912)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 总销售 (fdId: pf2195413ef3e465f879d849)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 会员销售 (fdId: i6e6da705287f4b9abe0cbd7)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 到店销售 (fdId: r9adad75526614ec7a4524f8)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 总订单数 (fdId: k28fd2e64c1b74a909a9cc79)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 触达次数 (fdId: v7a6c0b117eba4c368207ef4)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 触达会员数 (fdId: m6710b80d2b824956b1694be)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 会员销售占比 (fdId: e58db22994a42431a9f1bf35)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 到店销售占比 (fdId: cf61e8717320047d5805ec9b)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `ads_会员私域驾驶舱` is table('p2bcc84756ad94855896dd97') extend {
  // Base columns from table:
  //   - 年月 (TIMESTAMP)
  //   - 当月活跃会员 (LONG)
  //   - 新增首单会员 (LONG)
  //   - 总销售 (DOUBLE)
  //   - 会员销售 (DOUBLE)
  //   - 到店销售 (DOUBLE)
  //   - 总订单数 (LONG)
  //   - 触达次数 (LONG)
  //   - 触达会员数 (LONG)
  //   - 会员销售占比 (DOUBLE)
  //   - 到店销售占比 (DOUBLE)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **ads_会员私域驾驶舱** (DATA_PROCESS_ETL)
  - ID: n5eed53432fec411f8b3250f
