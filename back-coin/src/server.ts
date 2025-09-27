import express from 'express';
import sequelize from './config/database';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import converterRoutes from './routes/converterRoutes';
import User from './models/User';
import * as dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*', // Permite qualquer origem.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json());


app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/convert', converterRoutes); 

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o PostgreSQL estabelecida com sucesso.');
    
    await User.sync({ alter: true }); 
    console.log('✅ Modelos sincronizados com o banco de dados.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
  }
};

startServer();