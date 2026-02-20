export function waLink(num: string, msg: string) {
  const m = encodeURIComponent(msg);
  return `https://wa.me/${num}?text=${m}`;
}
export function telLink(num: string) {
  return `tel:${num}`;
}
