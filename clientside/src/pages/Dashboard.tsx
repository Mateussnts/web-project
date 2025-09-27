// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { DashboardResponse, QuoteData, CardQuote } from '../types/data';
import CurrencyCard from '../components/currencycard';
import QuotationRow from '../components/QuotationRow';
import styles from '../styles/Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get<DashboardResponse>('/dashboard/data');
        setData(response.data);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError("Não foi possível carregar os dados. Verifique a API ou seu Token.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading-state">Carregando Dashboard...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!data) return null;

  const quotesArray = Object.values(data.quotes);
  const cardData: CardQuote[] = [
    { 
        pair: "BRL/USD", 
        value: (1 / parseFloat(data.quotes["USDBRL"]?.bid || '1')).toFixed(4),
        currencySymbol: "R$"
    },
    { 
        pair: "BTC/EUR", 
        value: parseFloat(data.quotes["EURBRL"]?.bid || '0').toFixed(2), // Usando EURBRL por simplicidade
        currencySymbol: "B"
    },
    { 
        pair: "BTC/USD", 
        value: parseFloat(data.quotes["BTCBRL"]?.bid || '0').toFixed(2), // Usando BTCBRL por simplicidade
        currencySymbol: "B"
    },
  ];

 
  const tableData: QuoteData[] = [
    { ...data.quotes["USDBRL"], updateDate: '08/01/2021', pctChange: '+1%' },
    { ...data.quotes["USDBRL"], updateDate: '07/01/2022', pctChange: '-2%' },
    { ...data.quotes["USDBRL"], updateDate: '06/01/2023', pctChange: '-0.2%' },
    { ...data.quotes["USDBRL"], updateDate: '05/01/2024', pctChange: '+0.4%' },
  ];

  const goToConverter = () => {
        navigate('/converter');
  };

  return (
        <div className={styles.dashboardContainer}>
            
            <div className={styles.headerControls}>
                <h1 className={styles.mainTitle}>Moedas</h1>
                <button 
                    onClick={goToConverter} 
                    className={styles.converterLinkButton}
                >
                    Acessar Calculadora 💱
                </button>
            </div>

            <div className={styles.cardGrid}>
                {cardData.map((card, index) => (
                    <CurrencyCard key={index} {...card} />
                ))}
            </div>

            {/* Seção Cotações */}
            <div className={styles.quotationHeader}>
                <h2 className={styles.sectionTitle}>Cotações</h2>
                <select className={styles.currencyDropdown}>
                    <option>Dólar Americano</option>
                    <option>Euro</option>
                    <option>Bitcoin</option>
                </select>
            </div>


            <div className={styles.quotationTable}>
                <div className={`${styles.tableHeader} ${styles.quotationRow}`}>
                    <div className={styles.colMoeda}>Moeda</div>
                    <div className={styles.col}>Mínimo</div>
                    <div className={styles.col}>Máximo</div>
                    <div className={styles.col}>Variação</div>
                </div>

                <div className={styles.tableBody}>
                    {tableData.map((quote, index) => (
                        <QuotationRow key={index} quote={quote} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;