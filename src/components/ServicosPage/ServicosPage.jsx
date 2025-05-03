import React, { useEffect, useState } from 'react';
import styles from './ServicosPage.module.css';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';

export default function ServicosPage() {
  const [servicos, setServicos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({
    servico1: '',
    servico2: '',
    quantidadeCor: '',
    quantidadePeca: '',
    valor: '',
    data: ''
  });

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/servicos');
      setServicos(res.data);
    } catch (err) {
      console.error('Erro ao buscar serviços:', err);
    }
  };

  const handleEditar = (servico) => {
    setEditandoId(servico.id);
    setFormData({
      servico1: servico.servico1 || '',
      servico2: servico.servico2 || '',
      quantidadeCor: servico.quantidadeCor || '',
      quantidadePeca: servico.quantidadePeca || '',
      valor: servico.valor || '',
      data: servico.data.split('T')[0] || ''
    });
  };

  const handleSalvar = async (id) => {
    try {
      const payload = {
        servico1: formData.servico1 || null,
        servico2: formData.servico2 || null,
        quantidadeCor: formData.quantidadeCor ? Number(formData.quantidadeCor) : 0,
        quantidadePeca: formData.quantidadePeca ? Number(formData.quantidadePeca) : 0,
        valor: formData.valor ? Number(formData.valor) : 0,
        data: formData.data || null
      };
  
      await axios.patch(`http://localhost:3000/servicos/${id}`, payload);
      setEditandoId(null);
      fetchServicos();
    } catch (err) {
      console.error('Erro ao salvar serviço:', err);
    }
  };
  const handleExcluir = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/servicos/${id}`);
      fetchServicos();
    } catch (err) {
      console.error('Erro ao excluir serviço:', err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h2>Serviços</h2>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>DATA</th>
            <th>Cliente</th>
            <th>Serviços</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {servicos.map((servico) => (
            <React.Fragment key={servico.id}>
              <tr>
                <td>{new Date(servico.data).toLocaleDateString()}</td>
                <td>{servico.cliente}</td>
                <td>{servico.servico1}{servico.servico2 ? ` + ${servico.servico2}` : ''}</td>
                <td>R${servico.valor.toFixed(2)}</td>
                <td>
                  <button className={styles.edit} onClick={() => handleEditar(servico)}>Editar</button>
                  <button className={styles.delete} onClick={() => handleExcluir(servico.id)}>Excluir</button>
                </td>
              </tr>
              {editandoId === servico.id && (
                <tr className={styles.edicaoRow}>
                  <td colSpan={5}>
                    <div className={styles.formEdicao}>
                      <input type="text" name="servico1" value={formData.servico1} onChange={handleChange} placeholder="Serviço 1" />
                      <input type="text" name="servico2" value={formData.servico2} onChange={handleChange} placeholder="Serviço 2" />
                      <input type="number" name="quantidadeCor" value={formData.quantidadeCor} onChange={handleChange} placeholder="Qtd Cor" />
                      <input type="number" name="quantidadePeca" value={formData.quantidadePeca} onChange={handleChange} placeholder="Qtd Peça" />
                      <input type="number" name="valor" value={formData.valor} onChange={handleChange} placeholder="Valor" />
                      <input type="date" name="data" value={formData.data} onChange={handleChange} />
                      <button className={styles.salvar} onClick={() => handleSalvar(servico.id)}>Salvar</button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
