import React from "react";
import styles from "../Cadastro/Register.module.css"
import MoneyImg from "../../assets/money.png"; // mesma ilustração do login

const Register: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Lado esquerdo - Ilustração */}
      <div className={styles.left}>
        <img
          src={MoneyImg}
          alt="Finance Illustration"
          className={styles.image}
        />
      </div>

      {/* Lado direito - Formulário */}
      <div className={styles.right}>
        <h2>Crie sua conta</h2>
        <p>Preencha os dados abaixo para se cadastrar na plataforma.</p>

        <form className={styles.form}>
          <label>Nome</label>
          <input type="text" placeholder="Digite seu nome completo" />

          <label>Email</label>
          <input type="email" placeholder="Digite seu email" />

          <label>Senha</label>
          <input type="password" placeholder="Digite sua senha" />

          <button type="submit">Cadastrar</button>
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

export default Register;
