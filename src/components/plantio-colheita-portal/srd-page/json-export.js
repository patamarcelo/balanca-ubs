function getFormattedDateNow() {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}_${hours}:${minutes}`;
}
export const exportAsJson = (array, filename = `${getFormattedDateNow()}.json`) => {
    // Convert the array to a JSON string
    const jsonString = JSON.stringify(array, null, 2); // Format with indentation for readability

    // Create a Blob object with the JSON data
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a temporary <a> element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename; // Set the download filename

    // Append the link, trigger the download, and remove the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


export const handleJsonData = (originalArray) => {
    // Define a mapping object to transform keys
    const keyMapping = {
        OPERACAO: "Operacao",
        EMPRESA: "Empresa",
        FILIAL: "Filial",
        DT_EMISSAO: "Data de emissao",
        DT_PESAGEM_BRUTO: "Data de Pesagem Bruto",
        DT_PESAGEM_TARA: "Data de Pesagem Tara",
        CULTURA: "Cultura",
        VARIEDADE: "Variedade",
        TICKET: "Ticket",
        NUMNF: "Num NF",
        PLACA: "Placa do veiculo",
        MOTORISTA: "Motorista",
        FORNECEDOR: "Fornecedor",
        PROJETO: "Projeto",
        PARCELA: "Parcela",
        BRUTO: "Peso Bruto",
        TARA: "Peso Tara",
        LIQUIDO: "Peso Liquido",
        SACOS_LIQUIDOS: "Sacos Liquidos",
        UMIDADE_ENTRADA: "Umidade Entrada %",
        DESC_UMIDADE: "Desconto Umidade",
        IMPUREZA_ENTRADA: "Impureza Entrada %",
        DESC_IMPUREZA: "Desconto Impureza",
        TOTAL_SECO_KG: "Total Seco KG",
        SACOS_SECOS: "Sacos Secos",
        VALOR_POR_TN: "Valor Por TN",
        VALOR_FRETE: "Valor Frete",
        COD_PROJETO: "Cod Projeto",
        ROMANEIO: "Num Romaneio",
        SAFRA: "Safra",
        DESTINO: "Destino",
        CICLO: "Ciclo",
        ID_INTEGRACAO: "ID_Integracao",
        PERCENTUAL_PARCELA: "Percentual_Parcela",
        FECHAMENTO_FRETE: "Fechamento_frete",
    };

    // Transform each object in the array
    return originalArray.map((obj) => {
        const transformedObj = {};

        // Map each key to its new key, applying transformations where necessary
        for (const key in obj) {
            if (keyMapping[key]) {
                transformedObj[keyMapping[key]] = typeof obj[key] === "string" ? obj[key].trim() : obj[key];
            }
        }

        // Add "Fechamento_frete" if not already present
        if (!("Fechamento_frete" in transformedObj)) {
            transformedObj["Fechamento_frete"] = "";
        }

        return transformedObj;
    });
}

// Example usage:
// const myArray = [
//     { name: "Alice", age: 25 },
//     { name: "Bob", age: 30 }
// ];

// exportArrayAsJSON(myArray, "myArrayData.json");