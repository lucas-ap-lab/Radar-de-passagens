// src/lib/env.js
const REQUIRED = ["AMADEUS_API_KEY", "AMADEUS_API_SECRET"];

export function getEnv() {
  const missing = [];
  const out = {};
  for (const k of REQUIRED) {
    const v = process.env[k];
    if (!v || v.trim() === "") missing.push(k);
    else out[k] = v;
  }
  if (missing.length) {
    throw new Error(`Faltando variáveis: ${missing.join(", ")}`);
  }
  return out;
}
