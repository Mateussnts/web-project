import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/CurrencyConverter.module.css';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

interface ConversionResult {
  sourceCurrency: string;
  targetCurrency: string;
  amount: number;
  rate: number;
  convertedAmount: number;
  timestamp: string;
}

const availableCurrencies = [
  { code: 'BRL', name: 'Real Brasileiro', flag: '🇧🇷' },
  { code: 'USD', name: 'Dólar Americano', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'JPY', name: 'Iene Japonês', flag: '🇯🇵' },
  { code: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧' },
];


const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('BRL');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleConvert = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    if (fromCurrency === toCurrency) {
        setError("As moedas de origem e destino devem ser diferentes.");
        setLoading(false);
        return;
    }
    if (amount <= 0 || isNaN(amount)) {
        setError("Insira um valor válido.");
        setLoading(false);
        return;
    }

    try {
      const response = await api.get('/currency/convert', {
        params: {
          from: fromCurrency,
          to: toCurrency,
          amount: amount,
        },
      });

      setResult(response.data);
      setCurrentRate(response.data.rate); 
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 
                           'Erro ao converter moeda. Verifique o backend.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  // Função para buscar a taxa comercial (para exibir no topo do card)
  const fetchCurrentRate = useCallback(async () => {
    try {
        const response = await api.get('/currency/rate', {
            params: {
                from: fromCurrency,
                to: toCurrency,
            },
        });
        setCurrentRate(response.data.rate);
    } catch (err) {
        setCurrentRate(null); 
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    fetchCurrentRate();
  }, [fetchCurrentRate]);
  
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getFlag = (currencyCode: string) => {
    return availableCurrencies.find(c => c.code === currencyCode)?.flag || '❓';
  };

  return (
    <div className={styles.converterCard}>
      <div className={styles.header}>
        <h3>Calculadora de Conversão</h3>
        {currentRate !== null && (
          <p className={styles.rateInfo}>
            Taxa de câmbio comercial: 1 {fromCurrency} = {currentRate.toFixed(4)} {toCurrency}
          </p>
        )}
      </div>

      <form onSubmit={handleConvert} className={styles.form}>
        {/* Campo Quantia (De) */}
        <label className={styles.label}>Quantia</label>
        <div className={styles.inputGroup}>
          <input
            type="number"
            placeholder="Digite o valor"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            required
            min="0.01"
            step="0.01"
            className={styles.inputField}
          />
          <div className={styles.currencySelector}>
            <span className={styles.flag}>{getFlag(fromCurrency)}</span>
            <select 
                value={fromCurrency} 
                onChange={(e) => setFromCurrency(e.target.value)}
                className={styles.selectCurrency}
            >
              {availableCurrencies.map(c => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Botão de Troca (Swap) */}
        <div className={styles.swapButtonContainer}>
             <button type="button" onClick={handleSwap} className={styles.swapButton}>
                ⇆
            </button>
        </div>


        {/* Campo Converter para (Para) */}
        <label className={styles.label}>Converter para</label>
        <div className={styles.inputGroup}>
            <input
                type="text"
                readOnly
                placeholder="Resultado"
                value={result ? result.convertedAmount.toFixed(2) : ''}
                className={styles.inputField}
            />
          <div className={styles.currencySelector}>
             <span className={styles.flag}>{getFlag(toCurrency)}</span>
             <select 
                value={toCurrency} 
                onChange={(e) => setToCurrency(e.target.value)}
                className={styles.selectCurrency}
             >
                {availableCurrencies.map(c => (
                    <option key={c.code} value={c.code}>
                    {c.code}
                    </option>
                ))}
             </select>
          </div>
        </div>
        
        {/* Mensagem de Erro */}
        {error && <p className={styles.errorMessage}>{error}</p>}

        {/* Botão de Ação */}
        <button
          type="submit"
          disabled={loading}
          className={styles.convertButton}
        >
          {loading ? 'Calculando...' : 'Converter Dinheiro'}
        </button>
        
        {/* Botão de Acompanhamento (Ação Secundária, apenas visual) */}
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => navigate('/')} // Exemplo: volta para o dashboard
        >
          Acompanhar a Taxa de Câmbio
        </button>
      </form>
    </div>
  );
};

export default CurrencyConverter;