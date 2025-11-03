// src/lib/amadeus.js
import { getEnv } from "./env.js";

let tokenCache = { token: null, expiresAt: 0 };

async function getToken() {
  const now = Date.now();
  if (tokenCache.token && tokenCache.expiresAt > now + 10_000) {
    return tokenCache.token;
  }

  const { AMADEUS_API_KEY, AMADEUS_API_SECRET } = getEnv();

  const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AMADEUS_API_KEY,
      client_secret: AMADEUS_API_SECRET
    })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Falha ao obter token Amadeus: ${res.status} ${txt}`);
  }

  const data = await res.json(); // { access_token, expires_in }
  tokenCache = {
    token: data.access_token,
    expiresAt: now + (data.expires_in - 30) * 1000
  };
  return tokenCache.token;
}

export async function searchAirports(keyword) {
  const token = await getToken();
  const url = new URL("https://test.api.amadeus.com/v1/reference-data/locations");
  url.searchParams.set("subType", "AIRPORT");
  url.searchParams.set("keyword", keyword);
  url.searchParams.set("page[limit]", "10");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Busca de aeroportos falhou: ${res.status} ${txt}`);
  }

  const json = await res.json();
  const items = Array.isArray(json.data) ? json.data : [];
  return items.map((a) => ({
    iata: a.iataCode,
    name: a.name,
    city: a.address?.cityName ?? a.address?.cityCode ?? "",
    country: a.address?.countryName ?? ""
  }));
}
