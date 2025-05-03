import express from "express";
import { PrismaClient } from "../prisma/generated/client1/index.js";

const prisma = new PrismaClient();
const routerClientes = express.Router();

// GET - listar todos os clientes
routerClientes.get("/", async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
});

// POST - cadastrar novo cliente
routerClientes.post("/", async (req, res) => {
  try {
    const novo = await prisma.cliente.create({ data: req.body });
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: "Erro ao cadastrar cliente" });
  }
});

// PUT - atualizar cliente
routerClientes.put("/:id", async (req, res) => {
  try {
    const dadosAtualizados = { ...req.body };
    delete dadosAtualizados.id;
    delete dadosAtualizados._id;

    const clienteAtualizado = await prisma.cliente.update({
      where: { id: req.params.id }, // ❌ remover ObjectId
      data: dadosAtualizados
    });

    res.json(clienteAtualizado);
  } catch (err) {
    console.error("Erro ao atualizar cliente:", err);
    res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
});

// DELETE - excluir cliente
routerClientes.delete("/:id", async (req, res) => {
  try {
    await prisma.cliente.delete({
      where: { id: req.params.id } // ❌ remover ObjectId
    });
    res.status(204).send();
  } catch (err) {
    console.error("Erro ao excluir cliente:", err);
    res.status(500).json({ error: "Erro ao excluir cliente" });
  }
});

export default routerClientes;
