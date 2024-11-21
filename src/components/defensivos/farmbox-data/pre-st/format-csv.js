
function formatDate(dateString) {
    // Check if the input is a valid date string
    if (!/^\d{8}$/.test(dateString)) {
        throw new Error('Invalid date format. Please use YYYYMMDD format.');
    }

    // Extract year, month, and day
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    // Format the date as DD/MM/YYYY
    return `${day}/${month}/${year}`;
}

function transformString(input) {
    // Split the input string by line breaks and semicolons
    const entries = input.split(/[\r\n;]+/).map(entry => entry.trim()).filter(entry => entry !== '');
    
    // Extract only the part before the date
    const transformedEntries = entries.map(entry => entry.split('|')[0].trim());

    // Join the entries with ' | ' separator
    return transformedEntries.join(' | ');
}


export const formatToCsv = (data) => {
    const csvFile = [
        [
            "Número",
            "Projeto",
            'Status',
            'Data',
            'Filial Destino',
            'Armazem Destino',
            "Aps",
            'Id Produto',
            'Produto',
            'Quantidade Saldo',
            'filtro',
            'Tipo'
        ]
    ]


    data.forEach(ele => {
        const newLine = [
            ele.cod_pre_st,
            ele.projetos,
            ele.status,
            formatDate(ele?.dt_integracao),
            ele.filial_destino,
            ele.armazem_destino,
            transformString(ele?.aps),
        ]
        ele.produtos.forEach(prod => {
            const statusToAdd = prod.quantidade_saldo === 0 ? 'Finalizado' : 'Pendente'
            const addToNewLine = [
                prod.id_produto,
                prod.produto,
                prod.quantidade_saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                statusToAdd,
                prod.tipo_produto
            ]
            const arrayToSend = [...newLine, ...addToNewLine]
            csvFile.push(arrayToSend)
        })
    })
    console.log('data', csvFile)
    return csvFile
}