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
