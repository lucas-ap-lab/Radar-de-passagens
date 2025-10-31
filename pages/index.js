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

      <main style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <h1>✈️ Radar de Passagens</h1>
        <p>Busque os melhores preços de voos em tempo real.</p>

        <button
          onClick={() => alert("Em breve: sistema de busca ativo!")}
          style={{
            marginTop: "2rem",
            padding: "1rem 2rem",
            fontSize: "1rem",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#0070f3",
            color: "white",
            cursor: "pointer",
          }}
        >
          Procurar passagens
        </button>

        <footer
          style={{
            marginTop: "3rem",
            fontSize: "0.9rem",
            color: "#666",
          }}
        >
          © {new Date().getFullYear()} Radar de Passagens — Desenvolvido por Don Luca 👑
        </footer>
      </main>
    </>
  );
}
