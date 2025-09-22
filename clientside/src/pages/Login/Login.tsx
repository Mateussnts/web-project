import React from "react";
import styles from "../Login/Login.module.css"
import MyImg from '../../assets/money.png'


const Login: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img
          src={MyImg}
          className={styles.image}
        />
      </div>


      <div className={styles.right}>
        <h2>Olá! Bem vindo de volta.</h2>
        <p>Faça login com seus dados inseridos durante o seu registro.</p>

        <form className={styles.form}>
          <label>Email</label>
          <input type="email" placeholder="Exemplo@email.com" />

          <div className={styles.passwordRow}>
            <label>Senha</label>
            <a href="#" className={styles.forgot}>
              Esqueceu a senha
            </a>
          </div>
          <input type="password" placeholder="Enter password" />

          <button type="submit">Login</button>
        </form>

        <div className={styles.socials}>
          <i className="fab fa-facebook"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-linkedin"></i>
        </div>
      </div>
    </div>
  );
};

export default Login;
