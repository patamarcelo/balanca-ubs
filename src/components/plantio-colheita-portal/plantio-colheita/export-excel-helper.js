import * as XLSX from "xlsx";

export const exportPlantiosToExcel = (plantios = []) => {
    if (!plantios || plantios.length === 0) return;

    // Helpers
    const formatBRDate = (isoDateStr) => {
        if (!isoDateStr) return "";
        // Evita timezone shifting: trata como data local
        const [y, m, d] = isoDateStr.split("-").map(Number);
        const dd = String(d).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        return `${dd}/${mm}/${y}`;
    };

    const diffDaysFromToday = (isoDateStr) => {
        if (!isoDateStr) return "";
        const today = new Date();
        const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // 00:00 local
        const [y, m, d] = isoDateStr.split("-").map(Number);
        const plant = new Date(y, m - 1, d); // 00:00 local
        const ms = todayMid - plant;
        const days = Math.floor(ms / 86400000);
        return Math.max(0, days); // DAP não negativo
    };

    // Ordena (ajuste se preferir por outra chave)
    const ordenado = [...plantios].sort((a, b) => {
        const da = new Date(a.data_plantio);
        const db = new Date(b.data_plantio);
        return da - db; // crescente = mais antiga primeiro
    });

    // Totais
    let totalAreaColheita = 0;
    let totalAreaParcial = 0;
    let totalAreaDisponivel = 0;
    let totalRomaneios = 0;
    let totalPeso = 0;

    const dataForExcel = ordenado.map((p) => {
        const areaColheita = Number(p.area_colheita) || 0;
        const areaParcial = Number(p.area_parcial) || 0;
        const areaDisponivel = Number((areaColheita - areaParcial).toFixed(2));
        const dapCalc = diffDaysFromToday(p.data_plantio);

        totalAreaColheita += areaColheita;
        totalAreaParcial += areaParcial;
        totalAreaDisponivel += areaDisponivel;
        totalRomaneios += Number(p.romaneios) || 0;
        totalPeso += Number(p.peso) || 0;

        return {
            "ID": p.id,
            "Talhão": p.talhao__id_talhao,
            "ID Único": p.talhao__id_unico,
            // Fazenda vem antes de Projeto/Fazenda
            "Fazenda": p.talhao__fazenda__fazenda__nome,
            "Projeto": p.talhao__fazenda__nome,
            "Safra": p.safra__safra,
            "Ciclo": p.ciclo__ciclo,
            // Data BR
            "Data Plantio": formatBRDate(p.data_plantio),
            // DAP calculado (hoje - plantio)
            "DAP (dias)": dapCalc,
            "Variedade": p.variedade__nome_fantasia,
            "Cultura": p.variedade__cultura__cultura,

            // Bloco de áreas (ordem solicitada)
            "Área Colheita (ha)": Number(areaColheita.toFixed(2)),
            "Área Parcial (ha)": Number(areaParcial.toFixed(2)),
            "Área Disponível (ha)": areaDisponivel,

            "Plantio Finalizado": p.finalizado_plantio ? "Sim" : "Não",
            "Colheita Finalizada": p.finalizado_colheita ? "Sim" : "Não",
            "Romaneios": Number(p.romaneios) || 0,
            "Peso (kg)": Number((Number(p.peso) || 0).toFixed(2)),
        };
    });

    // Linha de total
    dataForExcel.push({
        "ID": "",
        "Talhão": "Total",
        "ID Único": "",
        "Fazenda": "",
        "Projeto": "",
        "Safra": "",
        "Ciclo": "",
        "Data Plantio": "",
        "DAP (dias)": "",
        "Variedade": "",
        "Cultura": "",
        "Área Colheita (ha)": Number(totalAreaColheita.toFixed(2)),
        "Área Parcial (ha)": Number(totalAreaParcial.toFixed(2)),
        "Área Disponível (ha)": Number(totalAreaDisponivel.toFixed(2)),
        "Plantio Finalizado": "",
        "Colheita Finalizada": "",
        "Romaneios": totalRomaneios,
        "Peso (kg)": Number(totalPeso.toFixed(2)),
    });

    // Monta workbook
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plantios");

    // Larguras de coluna (opcional)
    worksheet["!cols"] = [
        { wch: 6 },   // ID
        { wch: 8 },   // Talhão
        { wch: 10 },  // ID Único
        { wch: 24 },  // Fazenda
        { wch: 24 },  // Projeto/Fazenda
        { wch: 12 },  // Safra
        { wch: 6 },   // Ciclo
        { wch: 12 },  // Data Plantio (BR)
        { wch: 10 },  // DAP (dias)
        { wch: 18 },  // Variedade
        { wch: 12 },  // Cultura
        { wch: 18 },  // Área Colheita (ha)
        { wch: 18 },  // Área Parcial (ha)
        { wch: 20 },  // Área Disponível (ha)
        { wch: 16 },  // Plantio Finalizado
        { wch: 18 },  // Colheita Finalizada
        { wch: 10 },  // Romaneios
        { wch: 12 },  // Peso (kg)
    ];

    const workbookMetadata = {
        Workbook: {
            Views: [{ RTL: false, SheetNames: ["Plantios"] }],
            Locale: "pt-BR",
        },
    };

    XLSX.writeFile(workbook, "Plantio_Colheita.xlsx", workbookMetadata);
};