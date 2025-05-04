import React, { useState, useEffect } from 'react';
import styles from './FormularioPage.module.css';
import api from "../../api";
import Navbar from '../Navbar/Navbar';

const servico1Options = ['Vetor Simples', 'Vetor Mediano', 'Vetor Complexo', 'Layout'];
const servico2Options = ['Layout', 'Separação de cor'];

export default function FormularioPage() {
  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState('');
  const [servico1, setServico1] = useState('');
  const [servico2, setServico2] = useState('');
  const [quantidadeCor, setQuantidadeCor] = useState(0);
  const [quantidadePeca, setQuantidadePeca] = useState(0);
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [valoresConfig, setValoresConfig] = useState({});

  useEffect(() => {
    async function fetchClientes() {
      try {
        const res = await api.get('/clientes');
        setClientes(res.data);
      } catch (err) {
        console.error('Erro ao buscar clientes:', err);
      }
    }

    fetchClientes();
  }, []);

  useEffect(() => {
    async function fetchValores() {
      try {
        const res = await api.get('/servicos/valores');
        setValoresConfig(res.data || {});
      } catch (err) {
        console.error('Erro ao buscar valores:', err);
      }
    }

    fetchValores();
  }, []);

  const getValorServico = (nome) => {
    switch (nome) {
      case 'Vetor Simples': return valoresConfig.vetorSimples || 0;
      case 'Vetor Mediano': return valoresConfig.vetorMediano || 0;
      case 'Vetor Complexo': return valoresConfig.vetorComplexo || 0;
      case 'Layout': return valoresConfig.layout || 0;
      case 'Separação de cor':
      case 'Separacao de cor': return valoresConfig.separacaoCor || 0;
      default: return 0;
    }
  };

  const calcularValorTotal = () => {
    const valorServico1 = getValorServico(servico1);
    const valorServico2 = getValorServico(servico2);
    const valorSilk = (valoresConfig.valorCor || 0) * quantidadeCor * quantidadePeca;
    return valorServico1 + valorServico2 + valorSilk;
  };

  const handleSalvar = async () => {
    const valor = calcularValorTotal();

    try {
      const response = await api.post('/servicos', {
        cliente,
        servico1,
        servico2,
        quantidadeCor: Number(quantidadeCor),
        quantidadePeca: Number(quantidadePeca),
        data,
        valor
      });

      alert(`Serviço salvo com sucesso!\nValor final: R$ ${valor.toFixed(2)}`);
      console.log(response.data);
    } catch (err) {
      console.error('Erro ao salvar serviço:', err);
      alert('Erro ao salvar o serviço!,\nVerifique se o cliente já existe ou se os campos estão preenchidos corretamente!');
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h2>SilkOS - Formulário</h2>

      <select value={cliente} onChange={(e) => setCliente(e.target.value)}>
        <option value="">Selecionar Cliente</option>
        {clientes.map((c) => (
          <option key={c.id || c._id} value={c.nome}>{c.nome}</option>
        ))}
      </select>

      <h3>Artes</h3>
      <div className={styles.artesContainer}>
        <select
          value={servico1}
          onChange={(e) => setServico1(e.target.value)}
          className={styles.selectMetade}
        >
          <option value="">Selecionar Serviço 1</option>
          {servico1Options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <select
          value={servico2}
          onChange={(e) => setServico2(e.target.value)}
          className={styles.selectMetade}
        >
          <option value="">Selecionar Serviço 2</option>
          {servico2Options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <h3>Serviços de Silk</h3>
      <input
        type="number"
        placeholder="Quantidade de cor"
        value={quantidadeCor}
        onChange={(e) => setQuantidadeCor(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantidade de peças"
        value={quantidadePeca}
        onChange={(e) => setQuantidadePeca(e.target.value)}
      />
      <input
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <p><strong>Valor final estimado:</strong> R$ {calcularValorTotal().toFixed(2)}</p>
      <button onClick={handleSalvar}>Salvar</button>
    </div>
  );
}
