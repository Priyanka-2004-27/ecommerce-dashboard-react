const USD_TO_INR = 83.5;

export function toINR(usdPrice: number): number {
  return usdPrice * USD_TO_INR;
}

export function formatINR(usdPrice: number): string {
  return `₹${toINR(usdPrice).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}
