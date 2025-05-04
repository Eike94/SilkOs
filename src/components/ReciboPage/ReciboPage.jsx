import { useState, useEffect, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import styles from './ReciboPage.module.css';
import Navbar from '../Navbar/Navbar';
import api from "../../api"; // ✅ Corrigido: usar a API configurada

const ReciboPage = () => {
  const [services, setServices] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filtroNome, setFiltroNome] = useState("");

  useEffect(() => {
    async function fetchServicos() {
      try {
        const res = await api.get('/servicos');
        setServices(res.data);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      }
    }

    fetchServicos();
  }, []);

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('pt-BR');
  };

  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        const serviceDate = new Date(service.data);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        const dentroDoPeriodo = (!start || serviceDate >= start) && (!end || serviceDate <= end);

        const nomeInclui = service.cliente?.toLowerCase().includes(filtroNome.toLowerCase());

        return dentroDoPeriodo && nomeInclui;
      })
      .sort((a, b) => new Date(a.data) - new Date(b.data));
  }, [services, startDate, endDate, filtroNome]);

  const total = filteredServices.reduce((acc, item) => acc + item.valor, 0);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Recibo", 105, 10, { align: "center" });

    doc.setFontSize(12);
    doc.text(`${formatDate(startDate)} à ${formatDate(endDate)}`, 105, 20, { align: "center" });

    if (filtroNome.trim()) {
      doc.text(`Filtro Cliente: ${filtroNome}`, 105, 28, { align: "center" });
    }

    const tableData = filteredServices.map(service => [
      service.cliente,
      `${service.servico1}${service.servico2 ? ` + ${service.servico2}` : ""}`,
      `R$ ${service.valor.toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [["Cliente", "Serviços", "Valor"]],
      body: tableData,
      startY: filtroNome.trim() ? 35 : 30,
      theme: "striped",
      styles: { halign: "center" }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total a Receber: R$ ${total.toFixed(2)}`, 105, finalY, { align: "center" });

    doc.save("recibo.pdf");
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h2>Recibo</h2>

      <div className={styles.filtros}>
        <label>
          Data de Início:
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </label>
        <label>
          Data de Fim:
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </label>
      </div>

      <div className={styles.filtroNome}>
        <input
          type="text"
          placeholder="Buscar por nome do cliente..."
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
        />
      </div>

      <div className={styles.lista}>
        {filteredServices.map((service, index) => (
          <div className={styles.item} key={index}>
            <span>{service.cliente}</span>
            <span>{`${service.servico1}${service.servico2 ? ` + ${service.servico2}` : ""}`}</span>
            <span>R$ {service.valor.toFixed(2)}</span>
            <span>{formatDate(service.data)}</span>
          </div>
        ))}
      </div>

      <h3>Total: R$ {total.toFixed(2)}</h3>
      <button className={styles.botao} onClick={generatePDF}>Gerar PDF</button>
    </div>
  );
};

export default ReciboPage;
