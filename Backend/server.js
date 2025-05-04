import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routerUsersAPI from "./routes/Users.js";
import routerServicos from "./routes/Servicos.js";
import routerClientes from "./routes/Clientes.js";

// Carrega variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares principais
app.use(express.json());
app.use(cors({
  origin: ['https://silk-os.vercel.app', 'http://localhost:5173'], // adicione aqui os domínios autorizados
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));


// Rotas
app.use("/Users", routerUsersAPI);
app.use("/Servicos", routerServicos);
app.use("/Clientes", routerClientes);

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo deu errado!");
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).send("Rota não encontrada!");
});

// Define porta dinamicamente para funcionar no Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
