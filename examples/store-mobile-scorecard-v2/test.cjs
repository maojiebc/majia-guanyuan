const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(require('path').join(__dirname,'scorecard.js'),'utf8');
const c={};vm.createContext(c);vm.runInContext(src.slice(src.indexOf('  var esc ='),src.indexOf('  function rows('))+src.slice(src.indexOf('  function couponConversionData('),src.indexOf('  function couponSheet()')),c);
function row(name,day,vouchers,stats,total){return {'券类型名称':name,'核销日期':day,'核销券数':vouchers,'转化明细':JSON.stringify({version:1,...stats,total})};}
// One order stacks two coupon types: each type has ¥80, combined total is ¥80, not ¥160.
const day1={orders:1,valid:1,paid:80,gross:100,discount:20,stacked:1};
const day2={orders:1,valid:1,paid:9,gross:10,discount:1};
const rs=[row('A','2026-03-19',1,day1,{...day1,vouchers:2}),row('B','2026-03-19',1,day1),row('A','2026-03-20',1,day2,{...day2,vouchers:1})];
let x=c.couponConversionData(rs);assert(x.ready);assert.equal(x.total.paid,89);assert.equal(x.total.orders,2);assert.equal(x.total.vouchers,3);assert.equal(x.types.reduce((n,r)=>n+r.paid,0),169);assert.equal(c.couponDiscount(x.total),'8.1折');assert.equal(x.types[0].vouchers,2);
// Restrict to a single day without retaining any total from another period.
x=c.couponConversionData(rs.filter(r=>r['核销日期']==='2026-03-20'));assert.equal(x.total.paid,9);assert.equal(x.total.vouchers,1);
// Payment vouchers remain visible, but must not imply a zero-cost / 10-discount result.
x=c.couponConversionData([row('员工福利','2026-03-20',2,{orders:1,valid:0,payment:1,pending_vouchers:2},{orders:1,vouchers:2,valid:0,payment:1,pending_vouchers:2})]);assert.equal(c.couponDiscount(x.total),'—');assert(c.couponPending(x.types[0]).includes('券作支付'));
assert(!c.couponConversionData([{'转化明细':'bad'}]).ready);
assert(!c.couponConversionData([row('A','2026-03-20',1,day2)]).ready);
assert.equal(c.couponDiscount({valid:1,gross:100,paid:0}),'0.0折');
assert.equal(c.couponDiscount({valid:0,gross:0,paid:0}),'—');
console.log('PASS: stacked coupon totals, period isolation, weighted discount, payment-voucher unknown values, free orders, incomplete data.');

const a={CTX:null};vm.createContext(a);vm.runInContext(src.slice(src.indexOf('  function memberAnomalyData()'),src.indexOf('  function memberAnomalyWarning()')),a);
assert.equal(a.memberAnomalyData(),null);a.CTX={'会员异常诊断':JSON.stringify({version:1,orders:3,days:2,amount:1000,share:.2})};assert(a.memberAnomalyData());
a.CTX={'会员异常诊断':JSON.stringify({version:1,orders:3,days:1,amount:1000,share:.2})};assert.equal(a.memberAnomalyData(),null);
a.CTX={'会员异常诊断':'invalid'};assert.equal(a.memberAnomalyData(),null);
console.log('PASS: anomaly evidence boundary and malformed payload.');

// Store identity: preserve string IDs, isolate other stores, and clear stale badges.
const g={D:[],V:{newold:0,context:1,member:2},CTX:null,STORE:'示例店'};vm.createContext(g);
vm.runInContext(src.slice(src.indexOf('  var esc ='),src.indexOf('  function rows('))+src.slice(src.indexOf('  function customerStoreCode()'),src.indexOf('  function periodMembers()'))+src.slice(src.indexOf('  function storeHeading()'),src.indexOf('  function header()')),g);
g.D=[[{'门店编号':'001'}],[{'门店编号':'001','门店名称':'示例店'}],[{'门店编号':'001','消费会员数':3},{'门店编号':'002','消费会员数':99}]];
assert(g.storeHeading().includes('编号 001'));assert.equal(g.customerMetricRows(2).length,1);
g.D[0]=[{'门店编号':'002'}];g.D[1]=[{'门店编号':'002','门店名称':'示例店'}];assert(g.storeHeading().includes('编号 002'));assert(!g.storeHeading().includes('编号 001'));
g.D=[[],[{'门店编号':'001','门店名称':'示例店'},{'门店编号':'002','门店名称':'示例店'}]];assert(!g.storeHeading().includes('store-code'));
g.D=[[],[]];assert(!g.storeHeading().includes('store-code'));
g.CTX={'门店编号':'<001>'};assert(g.storeHeading().includes('&lt;001&gt;'));assert(!g.storeHeading().includes('编号 <001>'));
console.log('PASS: store-code isolation, leading zero, switching, ambiguous/missing IDs and escaping.');

const rep={CTX:null};vm.createContext(rep);
vm.runInContext(src.slice(src.indexOf('  var esc ='),src.indexOf('  function rows('))+src.slice(src.indexOf('  function repurchaseData('),src.indexOf('  function memberReview(')),rep);
rep.CTX={'会员堂食复购参评状态':'观察期不足','非会员堂食复购参评状态':'观察期不足'};
assert(rep.repurchaseReview().includes('不足30天'));
rep.CTX={'会员堂食复购参评状态':'可对比','会员堂食复购率':.349,'同店型会员复购前25门槛':.35,'同店型会员复购门店数':10};
assert(rep.repurchaseReview().includes('还差'));assert(!rep.repurchaseReview().includes('已达到'));
rep.CTX['同店型会员复购门店数']=9;assert(rep.repurchaseReview().includes('参照样本不足'));
rep.CTX['同店型会员复购门店数']=10;rep.CTX['会员堂食复购率']=.35;assert(rep.repurchaseReview().includes('已达到'));
assert.equal(rep.pct(.004),'0.4%');assert.equal(rep.pct(0),'0%');assert.equal(rep.pct(null),'—');
console.log('PASS: repurchase observation/sample gates, unrounded threshold comparison and small percentages.');
