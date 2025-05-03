// routes/Servicos.js
import express from "express";
import { PrismaClient } from "../prisma/generated/client1/index.js";

const prisma = new PrismaClient();
const routerServicos = express.Router();

// Criar novo serviço com valor calculado no backend
routerServicos.post("/", async (req, res) => {
  const {
    cliente,
    servico1,
    servico2,
    quantidadeCor,
    quantidadePeca,
    data
  } = req.body;

  if (!cliente || !servico1 || !quantidadeCor || !quantidadePeca || !data) {
    return res.status(400).json({ error: "Campos obrigatórios estão faltando" });
  }

  try {
    const valor = quantidadeCor * 2 * quantidadePeca;

    const novoServico = await prisma.servico.create({
      data: {
        cliente,
        servico1,
        servico2: servico2 || null,
        quantidadeCor,
        quantidadePeca,
        valor,
        data: new Date(data)
      }
    });

    res.status(201).json(novoServico);
  } catch (error) {
    console.error("Erro ao criar o serviço:", error);
    res.status(500).json({ error: "Erro ao criar o serviço" });
  }
});

// Salvar ou atualizar valores configurados da tela EditarValoresPage
routerServicos.post("/valores", async (req, res) => {
  const valores = { ...req.body };

  try {
    const existente = await prisma.valoresConfig.findFirst();

    let resultado;
    if (existente) {
      delete valores.id; // <--- necessário para evitar erro do Prisma

      resultado = await prisma.valoresConfig.update({
        where: { id: existente.id },
        data: valores
      });
    } else {
      resultado = await prisma.valoresConfig.create({ data: valores });
    }

    res.status(200).json({ message: "Valores salvos com sucesso!", data: resultado });
  } catch (error) {
    console.error("Erro ao salvar valores:", error);
    res.status(500).json({ error: "Erro ao salvar valores" });
  }
});


// (Opcional) Buscar os valores configurados
routerServicos.get("/valores", async (req, res) => {
  try {
    const valores = await prisma.valoresConfig.findFirst();
    res.status(200).json(valores);
  } catch (error) {
    console.error("Erro ao buscar valores:", error);
    res.status(500).json({ error: "Erro ao buscar valores" });
  }
});

// Listar todos os serviços
routerServicos.get("/", async (req, res) => {
  try {
    const servicos = await prisma.servico.findMany({
      orderBy: { data: "desc" }
    });
    res.json(servicos);
  } catch (error) {
    console.error("Erro ao buscar os serviços:", error);
    res.status(500).json({ error: "Erro ao buscar os serviços" });
  }
});

// Atualizar serviço existente
routerServicos.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    cliente,
    servico1,
    servico2,
    quantidadeCor,
    quantidadePeca,
    data
  } = req.body;

  try {
    const valor = quantidadeCor * 2 * quantidadePeca;

    const servicoAtualizado = await prisma.servico.update({
      where: { id },
      data: {
        cliente,
        servico1,
        servico2: servico2 || null,
        quantidadeCor,
        quantidadePeca,
        valor,
        data: new Date(data)
      }
    });

    res.json(servicoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar o serviço:", error);
    res.status(500).json({ error: "Erro ao atualizar o serviço" });
  }
});

// Deletar um serviço
routerServicos.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.servico.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar o serviço:", error);
    res.status(500).json({ error: "Erro ao deletar o serviço" });
  }
});

// Atualização parcial (PATCH)
routerServicos.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    servico1,
    servico2,
    quantidadeCor,
    quantidadePeca,
    valor,
    data
  } = req.body;

  try {
    const servicoAtualizado = await prisma.servico.update({
      where: { id },
      data: {
        servico1,
        servico2,
        quantidadeCor,
        quantidadePeca,
        valor,
        data: data ? new Date(data) : undefined
      }
    });

    res.json(servicoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar parcialmente o serviço:", error);
    res.status(500).json({ error: "Erro ao atualizar parcialmente o serviço" });
  }
});

export default routerServicos;
