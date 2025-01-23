import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
// import bodyParser from 'body-parser';
import authRoutes from './src/routes/authRoutes.js'; 
import userRoutes from './src/routes/userRoutes.js'; 
import serviceRoutes from './src/routes/serviceRoutes.js'; 

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET

app.use(cookieParser());


app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
  }));
  

app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)

app.use('/api/service',  serviceRoutes)
// app.use('/api/appointment', appointmentRoutes);
// app.use('/api/service', serviceRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`JWT Secret carregado: ${jwtSecret}`);
});
