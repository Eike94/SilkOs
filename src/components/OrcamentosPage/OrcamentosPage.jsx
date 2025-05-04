import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './OrcamentosPage.module.css';
import api from '../../api'; // ✅ usando API centralizada
import Navbar from '../Navbar/Navbar';

export default function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState([]);

  const carregarOrcamentos = async () => {
    try {
      const res = await api.get('/servicos');
      setOrcamentos(res.data);
    } catch (err) {
      console.error('Erro ao buscar orçamentos:', err);
    }
  };

  useEffect(() => {
    carregarOrcamentos();
  }, []);

  const gerarPDF = (orcamento) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Orçamento', 105, 10, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Cliente: ${orcamento.cliente}`, 105, 20, { align: 'center' });
    doc.text(`Data: ${new Date(orcamento.data).toLocaleDateString()}`, 105, 28, { align: 'center' });

    const body = [
      ['Serviço 1', orcamento.servico1 || '-'],
      ['Serviço 2', orcamento.servico2 || '-'],
      ['Qtd Cores', orcamento.quantidadeCor],
      ['Qtd Peças', orcamento.quantidadePeca]
    ];

    autoTable(doc, {
      startY: 35,
      head: [['Descrição', 'Valor']],
      body: body,
      theme: 'striped',
      styles: { halign: 'center' },
      headStyles: { fillColor: [41, 41, 41] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(13);
    doc.text(`Valor Total: R$ ${orcamento.valor.toFixed(2)}`, 105, finalY, { align: 'center' });

    doc.save(`orcamento-${orcamento.cliente}.pdf`);
  };

  const excluirOrcamento = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir este orçamento?');
    if (!confirmar) return;

    try {
      await api.delete(`/servicos/${id}`);
      await carregarOrcamentos();
    } catch (err) {
      console.error('Erro ao excluir orçamento:', err);
      alert('Erro ao excluir orçamento!');
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h2>Orçamentos</h2>
      <div className={styles.lista}>
        {orcamentos.map((orcamento) => (
          <div key={orcamento.id || orcamento._id} className={styles.item}>
            <div>
              <strong>{orcamento.cliente}</strong> - {orcamento.servico1}
              {orcamento.servico2 && ` + ${orcamento.servico2}`}
              <br />
              R$ {orcamento.valor.toFixed(2)} - {new Date(orcamento.data).toLocaleDateString()}
            </div>
            <div className={styles.botoes}>
              <button onClick={() => gerarPDF(orcamento)}>Gerar PDF</button>
              <button
                onClick={() => excluirOrcamento(orcamento.id || orcamento._id)}
                style={{ backgroundColor: '#d9534f', color: '#fff', marginLeft: '10px' }}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
