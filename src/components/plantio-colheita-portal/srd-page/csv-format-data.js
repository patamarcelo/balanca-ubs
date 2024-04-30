

const formatNumbers = (number) => {
    return number.toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

const formatData = (data) => {
    const csvFile = [
        [
            "Operacao",
            "Empresa",
            "Filial",
            "Emissao",
            "Pesagem Bruto",
            "Pesagem Tara",
            "Cultura",
            "Ticket",
            "NumNF",
            "Placa",
            "Motorista",
            "Fornecedor",
            "Projeto",
            "Parcela",
            "Peso Bruto",
            "Peso Tara",
            "Peso Liquido",
            "Peso Scs Liquido",
            "Umidade",
            "Desconto Umidade",
            "Impureza",
            "Desconto Impureza",
            "Peso Liquido Seco Kg",
            "Peso Scs Seco",
            "Codigo Projeto",
            "Romaneio",
            "Safra",
            "Destino",
            "Ciclo",
            "ID Integracao",
            'Percentual parcela'
        ]
    ]

    data?.forEach(ele => {
        const newLine = [
            ele.OPERACAO,
            ele.EMPRESA,
            ele.FILIAL,
            ele.DT_EMISSAO,
            ele.DT_PESAGEM_BRUTO,
            ele.DT_PESAGEM_TARA,
            ele.CULTURA,
            ele.TICKET,
            ele.NUMNF,
            ele.PLACA,
            ele.MOTORISTA,
            ele.FORNECEDOR,
            ele.PROJETO,
            ele.PARCELA,
            formatNumbers(ele.BRUTO),
            formatNumbers(ele.TARA),
            formatNumbers(ele.LIQUIDO),
            formatNumbers(ele.SACOS_LIQUIDOS),
            formatNumbers(ele.UMIDADE_ENTRADA),
            formatNumbers(ele.DESC_UMIDADE),
            formatNumbers(ele.IMPUREZA_ENTRADA),
            formatNumbers(ele.DESC_IMPUREZA),
            formatNumbers(ele.TOTAL_SECO_KG),
            formatNumbers(ele.SACOS_SECOS),
            ele.COD_PROJETO,
            ele.ROMANEIO,
            ele.SAFRA,
            ele.DESTINO,
            ele.CICLO,
            ele.ID_INTEGRACAO,
            ele.PERCENTUAL_PARCELA
        ]
        csvFile.push(newLine)
    });

    return csvFile
}

export default formatData