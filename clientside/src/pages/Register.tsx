
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import styles from '../styles/Login.module.css'; // Reutilizando
import moneyIllustration from '../assets/money.png';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      
      const response = await api.post('/auth/register', { name, email, password });

      setSuccess(true);
      setError(null);
      
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro no registro. Verifique os dados.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.illustrationSection}>
        <img 
          src={moneyIllustration}
          alt="Crescimento financeiro" 
          className={styles.illustrationImage} 
        />
      </div>

      
      <div className={styles.loginFormSection}>
        <div className={styles.loginContent}>
          <h2>Crie sua conta aqui!</h2>
          <p className={styles.formSubtitle}>
            É rápido e fácil. Insira suas informações abaixo para começar a gerenciar suas cotações.
          </p>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            
            {/* Campo Nome */}
            <div className={styles.inputGroup}>
              <label htmlFor="name">Nome Completo</label>
              <input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>

            {/* Campo E-mail */}
            <div className={styles.inputGroup}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>

            {/* Campo Senha */}
            <div className={styles.inputGroup}>
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                placeholder="Crie uma senha forte"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>

            {/* Mensagens de Status */}
            {error && <p className={styles.errorMessage}>{error}</p>}
            {success && <p className={styles.successMessage}>Cadastro realizado com sucesso! Redirecionando...</p>}


            {/* Botão de Registro */}
            <button
              type="submit"
              disabled={loading}
              className={`${styles.loginButton} ${styles.registerButton}`}
            >
              {loading ? 'Registrando...' : 'Cadastrar'}
            </button>
          </form>

          {/* Link para Login */}
          <div className={styles.footerLink}>
            Já tem uma conta? <a href="/login">**Faça Login**</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;