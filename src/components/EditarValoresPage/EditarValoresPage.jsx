// src/components/EditarValoresPage/EditarValoresPage.jsx
import React, { useState, useEffect } from 'react';
import styles from './EditarValoresPage.module.css';
import api from '../../api'; // ✅ uso do arquivo central de API
import Navbar from '../Navbar/Navbar';

export default function EditarValoresPage() {
  const [valores, setValores] = useState({
    vetorSimples: 10,
    vetorMediano: 15,
    vetorComplexo: 20,
    layout: 8,
    separacaoCor: 6,
    valorCor: 7
  });

  useEffect(() => {
    async function carregarValores() {
      try {
        const response = await api.get('/servicos/valores');
        if (response.data) {
          setValores(response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar valores salvos:', error);
      }
    }

    carregarValores();
  }, []);

  const handleChange = (e) => {
    setValores({
      ...valores,
      [e.target.name]: parseFloat(e.target.value)
    });
  };

  const handleSalvar = async () => {
    try {
      await api.post('/servicos/valores', valores);
      alert('Valores salvos com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar valores:', err);
      alert('Erro ao salvar valores!');
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h2>Editar Valores</h2>
      <div className={styles.formContainer}>
        <label>Vetor Simples</label>
        <input type="number" name="vetorSimples" value={valores.vetorSimples} onChange={handleChange} />

        <label>Vetor Mediano</label>
        <input type="number" name="vetorMediano" value={valores.vetorMediano} onChange={handleChange} />

        <label>Vetor Complexo</label>
        <input type="number" name="vetorComplexo" value={valores.vetorComplexo} onChange={handleChange} />

        <label>Layout</label>
        <input type="number" name="layout" value={valores.layout} onChange={handleChange} />

        <label>Separação de Cor</label>
        <input type="number" name="separacaoCor" value={valores.separacaoCor} onChange={handleChange} />

        <label>Valor por Cor</label>
        <input type="number" name="valorCor" value={valores.valorCor} onChange={handleChange} />
      </div>

      <button className={styles.button} onClick={handleSalvar}>Salvar</button>
    </div>
  );
}
