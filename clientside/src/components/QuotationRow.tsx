import React from 'react';
import { QuoteData } from '../types/data';
import styles from '../styles/QuotationRow.module.css'

interface QuotationRowProps {
    quote: QuoteData;
}

const QuotationRow: React.FC<QuotationRowProps> = ({ quote }) => {
    const isPositive = parseFloat(quote.pctChange.replace('%', '')) > 0;
    const variationColor = isPositive ? '#28a745' : '#dc3545'; // Verde para alta, Vermelho para baixa
    const symbol = isPositive ? '+' : '';

    return (
        <div className="quotation-row">
            <div className="col-moeda">
                <span className="symbol-circle">$</span>
                <div className="info">
                    <strong>{quote.name.split('/')[0]}</strong> {/* Ex: Dólar Americano */}
                    <span className="date">{quote.updateDate.split(' ')[0]}</span> {/* Ex: 08/01/2021 */}
                </div>
            </div>
            <div className="col">{quote.dailyLow}</div> {/* Mínimo */}
            <div className="col">{quote.dailyHigh}</div> {/* Máximo */}
            <div className="col variation" style={{ backgroundColor: variationColor, color: '#fff' }}>
                {symbol}{quote.pctChange}
            </div>
        </div>
    );
};

export default QuotationRow;