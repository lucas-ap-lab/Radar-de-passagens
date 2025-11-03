const REQUIRED = ["AMADEUS_API_KEY", "AMADEUS_API_SECRET"] as const;
type RequiredEnv = { [K in typeof REQUIRED[number]]: string };

export function getEnv(): RequiredEnv {
  const missing: string[] = [];
  const out: any = {};
  for (const k of REQUIRED) {
    const v = process.env[k];
    if (!v || v.trim() === "") missing.push(k);
    else out[k] = v;
  }
  if (missing.length) {
    throw new Error(`Faltando variáveis: ${missing.join(", ")}`);
  }
  return out as RequiredEnv;
}
