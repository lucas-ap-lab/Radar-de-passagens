// pages/api/search.js
export default async function handler(req, res) {
  try {
    const { originLocationCode, destinationLocationCode, departureDate, adults = "1", currencyCode = "BRL", max = "10" } = req.query;

    if (!originLocationCode || !destinationLocationCode || !departureDate) {
      return res.status(400).json({ error: "Parâmetros obrigatórios: originLocationCode, destinationLocationCode, departureDate (YYYY-MM-DD)" });
    }

    const clientId = process.env.AMADEUS_API_KEY;
    const clientSecret = process.env.AMADEUS_API_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: "Variáveis de ambiente AMADEUS_API_KEY/AMADEUS_API_SECRET não configuradas." });
    }

    // 1) Obter access_token (OAuth2 client_credentials)
    const tokenResp = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResp.ok) {
      const text = await tokenResp.text();
      return res.status(500).json({ error: "Falha ao obter token Amadeus", details: text });
    }

    const { access_token } = await tokenResp.json();

    // 2) Buscar ofertas de voo
    const params = new URLSearchParams({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults,
      currencyCode,
      max,
    });

    const offersResp = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?${params.toString()}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const data = await offersResp.json();

    if (!offersResp.ok) {
      return res.status(offersResp.status).json({ error: "Erro na busca de voos", details: data });
    }

    // Enviar o JSON cru para o front (mantemos flexível)
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro inesperado", details: String(err) });
  }
}
