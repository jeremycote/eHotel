export function calcEndDate(months: number) {
  let d = new Date();
  d.setMonth(new Date().getMonth() + months);
  return d;
}
