import React from 'react';
import styles from '../styles/CurrencyCard.module.css'

interface CurrencyCardProps {
    pair: string;
    value: string; // Ex: 5.30
    currencySymbol: string; // Ex: R$
}

const CurrencyCard: React.FC<CurrencyCardProps> = ({ pair, value, currencySymbol }) => {
  return (
    <div className="card">
      <div className="card-header">
        <span className="pair-name">{pair}</span>
        <span className="symbol-circle">{currencySymbol}</span>
      </div>
      <div className="card-value">
        <span className="main-value">{value}</span>
      </div>
    </div>
  );
};

export default CurrencyCard;