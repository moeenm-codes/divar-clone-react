// numbers.js
const e2p = (s) => s?.toString()?.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]) || "";

const p2e = (s) =>
  s?.toString()?.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)) || "";

const sp = (number) => {
  // بررسی آیا number وجود دارد
  if (number === undefined || number === null || number === "") {
    return "";
  }

  const seperatedNumber = number
    .toString()
    .match(/(\d+?)(?=(\d{3})+(?!\d)|$)/g);

  // بررسی آیا seperatedNumber معتبر است
  if (!seperatedNumber) {
    return e2p(number.toString());
  }

  const joinedNumber = seperatedNumber.join(",");
  return e2p(joinedNumber);
};

export { e2p, p2e, sp };
