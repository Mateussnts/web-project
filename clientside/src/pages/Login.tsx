import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; 
import styles from '../styles/Login.module.css';
import moneyIllustration from '../assets/money.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', { email, password });

      const { token } = response.data;

      localStorage.setItem('token', token);
      navigate('/', { replace: true });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao tentar fazer login. Tente novamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.illustrationSection}>
        {/* Aqui você colocaria a imagem do saco de dinheiro e moedas */}
        <img 
          src={moneyIllustration}
          alt="" 
          className={styles.illustrationImage} 
        />
      </div>

      <div className={styles.loginFormSection}>
        <div className={styles.loginContent}>
          <h2>Olá! Bem vindo de volta.</h2>
          <p>Faça login com seus dados inseridos durante o seu registro.</p>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            {/* Campo Email */}
            <div className={styles.inputGroup}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="Exemplo@email.com"
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputField}
              />
              <a href="#" className={styles.forgotPassword}>Esqueceu a senha?</a>
            </div>

            {/* Mensagem de Erro */}
            {error && <p className={styles.errorMessage}>{error}</p>}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className={styles.loginButton}
            >
              {loading ? 'Carregando...' : 'Login'}
            </button>
          </form>

          {/* Ícones de Mídia Social */}
          <div className={styles.socialLogin}>
            {/* Simulação dos Ícones (Substitua por SVGs ou componentes de ícones reais) */}
            <div className={styles.socialIcons}>
              <span>f</span>
              <span>t</span>
              <span>i</span>
              <span>in</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;