// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css"; // CSS Modules

interface Card {
  pair: string;
  symbol: string;
  value: number;
}

interface Quote {
  name: string;
  date: string;
  min: number;
  max: number;
  variation: number;
}

export default function Dashboard() {
  const [cards, setCards] = useState<Card[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Consome dados do backend
        const [cardsRes, quotesRes] = await Promise.all([
          fetch("http://localhost:3000/api/cards"), // ajuste para sua rota real
          fetch("http://localhost:3000/api/quotes"),
        ]);

        const cardsData = await cardsRes.json();
        const quotesData = await quotesRes.json();

        setCards(cardsData);
        setQuotes(quotesData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      {/* Título */}
      <h2 className={styles.title}>Moedas</h2>

      {/* Cards */}
      <div className={styles.cards}>
        {cards.map((card, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.cardHeader}>
              <span>{card.pair}</span>
              <div className={styles.icon}>{card.symbol}</div>
            </div>
            <p className={styles.value}>R$ {card.value.toFixed(2)}</p>
            <span className={styles.subtitle}>Cotação atual</span>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <h2 className={styles.title}>Cotações</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Moeda</th>
              <th>Mínima</th>
              <th>Máxima</th>
              <th>Variação</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q, idx) => (
              <tr key={idx}>
                <td>
                  <div className={styles.coin}>
                    <div className={styles.icon}>$</div>
                    <div>
                      <p>{q.name}</p>
                      <small>{q.date}</small>
                    </div>
                  </div>
                </td>
                <td>{q.min}</td>
                <td>{q.max}</td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      q.variation > 0
                        ? styles.positive
                        : q.variation < 0
                        ? styles.negative
                        : styles.neutral
                    }`}
                  >
                    {q.variation > 0 ? "+" : ""}
                    {q.variation}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
