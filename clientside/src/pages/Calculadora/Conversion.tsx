import React, { useState } from "react";
import styles from "./Conversion.module.css";

const Converter: React.FC = () => {
  const [amount, setAmount] = useState<number | "">("");
  const [converted, setConverted] = useState<number | null>(null);

  const exchangeRate = 0.1576; // exemplo fixo: 1 BRL = 0.1576 EUR

  const handleConvert = () => {
    if (amount !== "") {
      setConverted(Number(amount) * exchangeRate);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Calculadora de Conversão</h2>
        <p className={styles.subtitle}>
          Taxa de câmbio comercial <br /> R$1 BRL = {exchangeRate} EUR
        </p>

        {/* Input BRL */}
        <div className={styles.inputGroup}>
          <input
            type="number"
            placeholder="Quantidade"
            value={amount}
            onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
          />
          <span className={styles.flag}>
            <img src="https://flagcdn.com/w40/br.png" alt="BRL" />
          </span>
        </div>

        {/* Input EUR */}
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Convertido"
            value={converted !== null ? converted.toFixed(2) : ""}
            readOnly
          />
          <span className={styles.flag}>
            <img src="https://flagcdn.com/w40/eu.png" alt="EUR" />
          </span>
        </div>

        {/* Botão de conversão */}
        <button className={styles.button} onClick={handleConvert}>
          Enviar Dinheiro
        </button>

        {/* Simulação de botão desabilitado */}
        <button className={`${styles.button} ${styles.disabled}`} disabled>
          Aceitar a Taxa de Câmbio
        </button>
      </div>
    </div>
  );
};

export default Converter;
