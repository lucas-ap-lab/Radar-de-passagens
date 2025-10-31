// pages/index.js
import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [origin, setOrigin] = useState("GRU");
  const [destination, setDestination] = useState("GIG");
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0,10)); // amanhã
  const [adults, setAdults] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);

  async function onSearch(e) {
    e.preventDefault();
    setError("");
    setResults([]);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        originLocationCode: origin.trim().toUpperCase(),
        destinationLocationCode: destination.trim().toUpperCase(),
        departureDate: date,
        adults: String(adults),
        currencyCode: "BRL",
        max: "10",
      });
      const resp = await fetch(`/api/search?${params.toString()}`);
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Falha na busca");

      // Normalizar ofertas (itinerário principal)
      const offers = (data.data || []).map((o) => {
        const price = o.price?.grandTotal;
        const currency = o.price?.currency || "BRL";
        const it = o.itineraries?.[0];
        const first = it?.segments?.[0];
        const last = it?.segments?.[it.segments.length - 1];
        const duration = it?.duration || "";
        return {
          id: o.id,
          price,
          currency,
          carrier: first?.carrierCode,
          flightNumber: first?.number,
          departure: first?.departure?.at,
          arrival: last?.arrival?.at,
          from: first?.departure?.iataCode,
          to: last?.arrival?.iataCode,
          stops: (it?.segments?.length || 1) - 1,
          duration,
        };
      });

      setResults(offers);
    } catch (err) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Radar de Passagens ✈️</title>
        <meta
          name="description"
          content="Encontre passagens aéreas baratas com o Radar de Passagens"
        />
      </Head>

      <main style={styles.main}>
        <h1 style={styles.title}>Radar de Passagens ✈️</h1>
        <p style={styles.subtitle}>Busque os melhores preços de voos em tempo real.</p>

        <form onSubmit={onSearch} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Origem (IATA)</label>
              <input
                style={styles.input}
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="GRU"
                maxLength={3}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Destino (IATA)</label>
              <input
                style={styles.input}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="GIG"
                maxLength={3}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Data</label>
              <input
                style={styles.input}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Adultos</label>
              <input
                style={styles.input}
                type="number"
                min={1}
                max={9}
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value || 1))}
              />
            </div>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Buscando..." : "Procurar passagens"}
          </button>
        </form>

        {error && <div style={styles.error}>⚠️ {error}</div>}

        {!!results.length && (
          <div style={styles.list}>
            {results.map((r) => (
              <div key={r.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <strong>{r.from} → {r.to}</strong>
                  <span>
                    <strong>R$ {Number(r.price).toFixed(2)}</strong>
                  </span>
                </div>
                <div style={styles.cardBody}>
                  <div>Saída: {new Date(r.departure).toLocaleString()}</div>
                  <div>Chegada: {new Date(r.arrival).toLocaleString()}</div>
                  <div>Paradas: {r.stops}</div>
                  <div>Duração: {r.duration?.replace("PT","").toLowerCase()}</div>
                  <div>Voo: {r.carrier}{r.flightNumber ? " " + r.flightNumber : ""}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer style={{ marginTop: "3rem", fontSize: "0.9rem", color: "#666" }}>
          © {new Date().getFullYear()} Radar de Passagens — Desenvolvido por Don Luca 👑
        </footer>
      </main>
    </>
  );
}

const styles = {
  main: { minHeight: "100vh", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", background: "linear-gradient(135deg,#0a2540,#1a73e8)" },
  title: { color: "white", fontSize: "28px", marginBottom: "8px", textAlign: "center" },
  subtitle: { color: "rgba(255,255,255,0.9)", marginBottom: "20px", textAlign: "center" },
  form: { width: "100%", maxWidth: 720, background: "white", borderRadius: 16, padding: 16, boxShadow: "0 8px 30px rgba(0,0,0,0.15)" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column" },
  label: { fontSize: 12, color: "#333", marginBottom: 6 },
  input: { border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px", fontSize: 16, outline: "none" },
  button: { marginTop: 14, width: "100%", padding: "14px 16px", fontSize: 16, borderRadius: 12, border: "none", cursor: "pointer", color: "white", background: "#0070f3" },
  error: { marginTop: 16, color: "#b00020", background: "#fde7ea", padding: 12, borderRadius: 10, width: "100%", maxWidth: 720, textAlign: "center" },
  list: { marginTop: 16, width: "100%", maxWidth: 720, display: "grid", gap: 12 },
  card: { background: "white", borderRadius: 14, padding: 14, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" },
  cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: 6 },
  cardBody: { color: "#222", display: "grid", gap: 4 },
};
