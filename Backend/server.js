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
app.use(cors());

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
