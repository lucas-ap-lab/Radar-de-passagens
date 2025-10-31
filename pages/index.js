import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Radar de Passagens ✈️</title>
        <meta
          name="description"
          content="Encontre passagens aéreas baratas com o Radar de Passagens"
        />
      </Head>

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0a0f2c 0%, #1a2b6d 50%, #0070f3 100%)",
          color: "white",
          textAlign: "center",
          padding: "2rem",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          Radar de Passagens ✈️
        </h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
          Busque os melhores preços de voos em tempo real.
        </p>
        <button
          onClick={() => alert("Em breve: sistema de busca ativo!")}
          style={{
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            padding: "1rem 2rem",
            borderRadius: "10px",
            fontSize: "1.1rem",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#005ad6")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0070f3")}
        >
          Procurar passagens
        </button>
        <footer style={{ marginTop: "3rem", fontSize: "0.9rem", color: "#ccc" }}>
          © {new Date().getFullYear()} Radar de Passagens — Desenvolvido por Don Luca 👑
        </footer>
      </main>
    </>
  );
}
