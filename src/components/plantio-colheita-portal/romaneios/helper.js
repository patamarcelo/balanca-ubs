function fromTimestamp(ts) {
    if (!ts || typeof ts.seconds !== "number") return null;
    return new Date(ts.seconds * 1000 + (ts.nanoseconds || 0) / 1e6);
}

function formatDate(date, sep = "/") {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return sep === "/"
        ? `${y}/${m}/${d}`
        : `${y}-${m}-${d}`;
}

function normalizaProjeto(fazendaOrigem) {
    if (!fazendaOrigem) return "";
    const trimmed = fazendaOrigem.trim();
    const prefix = "Projeto ";
    let nome = trimmed.startsWith(prefix) ? trimmed.slice(prefix.length) : trimmed;
    return nome.toUpperCase();
}

function calculaPercentualParcelas(parcelasObjFiltered = [], parcelasNovas = []) {
    if (!parcelasObjFiltered.length || !parcelasNovas.length) return "";

    const caixasPorParcela = new Map();

    parcelasObjFiltered.forEach(p => {
        const parcela = String(p.parcela).trim();
        const caixas = Number(p.caixas || 0);
        if (!parcela || !caixas) return;
        caixasPorParcela.set(parcela, (caixasPorParcela.get(parcela) || 0) + caixas);
    });

    const totalCaixas = Array.from(caixasPorParcela.values())
        .reduce((acc, v) => acc + v, 0);

    if (!totalCaixas) return "";

    const partes = parcelasNovas.map(parcela => {
        const caixas = caixasPorParcela.get(String(parcela).trim()) || 0;
        const pct = Math.round((caixas / totalCaixas) * 100);
        return pct;
    });

    return partes.join(";") + ";";
}

function montaCampoParcela(parcelasNovas = []) {
    if (!parcelasNovas.length) return "";
    return "'" + parcelasNovas.map(p => String(p).trim()).join(";") + ";";
}

export function transformaDocEmImportRegistro(doc, {
    empresa = "02",
    filial = "0209",
} = {}) {
    const {
        destino,
        unidadeOp,
        idApp,
        placa,
        entrada,
        parcelasObjFiltered = [],
        projeto,
        cultura,
        mercadoria,
        liquido,
        fazendaOrigemProtheusId,
        umidade,
        data,
        ticket,
        relatorioColheita,
        fazendaOrigem,
        parcelasNovas = [],
        valorFrete,
        id,
        impureza,
        pesoBruto,
        tara,
        op,
        fazendaDestino,
        saida,
        nfEntrada,
        motorista,
        nf,
    } = doc;

    const dataEmissaoDate = fromTimestamp(data) || fromTimestamp(doc.appDate);
    const dataPesagemDate = fromTimestamp(saida) || fromTimestamp(entrada) || dataEmissaoDate;

    const primeiraParcela = parcelasObjFiltered[0] || {};
    const safra = primeiraParcela.safra || doc.safra || "";
    const ciclo = primeiraParcela.ciclo != null ? String(primeiraParcela.ciclo) : "";

    const culturaUpper = ((cultura || "") + " " + (mercadoria || "")).trim().toUpperCase();
    const variedadeUpper = culturaUpper;

    const destinoFinal = (fazendaDestino || destino || "").toLowerCase() === "ubs"
        ? "UBS"
        : (fazendaDestino || destino || "").toUpperCase();

    const ticketFinal =
        (doc.codTicketPro && String(doc.codTicketPro)) ||
        (ticket && String(ticket)) ||
        (relatorioColheita && String(relatorioColheita)) ||
        (idApp && String(idApp)) ||
        "";

    const numRomaneio = relatorioColheita != null ? String(relatorioColheita) : "";

    const fornecedor = fazendaOrigem || "";

    const percentualParcela = calculaPercentualParcelas(parcelasObjFiltered, parcelasNovas);
    const parcelaCampo = montaCampoParcela(parcelasNovas);

    const valorFreteNum = Number(valorFrete || 0) || 0;
    const pesoBrutoNum = Number(pesoBruto || 0) || 0;
    const taraNum = Number(tara || 0) || 0;
    const pesoLiquidoNum = liquido != null ? Number(liquido) : Math.max(pesoBrutoNum - taraNum, 0);

    return {
        "Operacao": op || "ENTRADA",
        "Empresa": empresa,
        "Filial": filial,
        "Data de emissao": formatDate(dataEmissaoDate, "/"),
        "Data de Pesagem Bruto": formatDate(dataPesagemDate, "-"),
        "Data de Pesagem Tara": formatDate(dataPesagemDate, "-"),
        "Cultura": culturaUpper || "",
        "Variedade": variedadeUpper || "",
        "Ticket": ticketFinal,
        "Num NF": nfEntrada || nf || "N/A",
        "Placa do veiculo": placa || "",
        "Motorista": (motorista || "").trim(),
        "Fornecedor": fornecedor,
        "Projeto": normalizaProjeto(fazendaOrigem || projeto || ""),
        "Parcela": parcelaCampo,
        "Peso Bruto": pesoBrutoNum,
        "Peso Tara": taraNum,
        "Peso Liquido": pesoLiquidoNum,
        "Sacos Liquidos": 0,
        "Umidade Entrada %": Number(umidade || 0),
        "Desconto Umidade": 0,
        "Impureza Entrada %": Number(impureza || 0),
        "Desconto Impureza": 0,
        "Total Seco KG": pesoLiquidoNum,
        "Sacos Secos": 0,
        "Valor Por TN": 0,
        "Valor Frete": valorFreteNum,
        "Cod Projeto": fazendaOrigemProtheusId != null ? String(fazendaOrigemProtheusId) : "",
        "Num Romaneio": numRomaneio,
        "Safra": safra,
        "Destino": destinoFinal,
        "Ciclo": ciclo,
        "ID_Integracao": id || "",
        "Percentual_Parcela": percentualParcela,
        "Fechamento_frete": ""
    };
}
