export const generalDataArr = (data) => {
    const newArr = data.map((datas) => datas.date)
    const conslidateArr = [...new Set(newArr)]
    return conslidateArr.sort((a,b) => b.localeCompare(a))
}

export const generalProjecs = (data) => {
    const newArr = data.map((datas) => datas.plantations[0].plantation.farm_name)
    const conslidateArr = [...new Set(newArr.sort((a,b) => a.localeCompare(b)))]
    return conslidateArr
}

export const generalTypesProds = (data) => {
    const newArr = data.map((datas) => {
        const onlyTypes = datas.inputs.map((input) => {
            return input.input.input_type_name
        })
        return onlyTypes
    })
    const flatTypes = newArr.flat()
    const conslidateArr = [...new Set(flatTypes.sort((a,b) => a.localeCompare(b)))]
    return conslidateArr
}

export const generalProds = (data) => {
    const newArr = data.map((datas) => {
        const onlyProds = datas.inputs.map((input) => {
            return input.input.name
        })
        return onlyProds
    })
    const flatProds = newArr.flat()
    const conslidateArr = [...new Set(flatProds.sort((a,b) => a.localeCompare(b)))]
    return conslidateArr
}



export const generalAppsGeneral = (data) => {
    const getApps = data.filter((sta) => sta.status === "sought").map((apps) => {
        const number = apps.code
        const farmName = apps.plantations[0].plantation.farm_name
        const appDate = apps.date
        const finalName = `${farmName?.replace('Fazenda ', '')} - ${number} | ${appDate}`
        return finalName
    })
    const flatTypes = getApps.flat()
    const conslidateArr = [...new Set(flatTypes.sort((a,b) => a.localeCompare(b)))]
    return conslidateArr
    
}


export const getInsumosList = (data) => {
    const newArrData = data.map((apps) => {
        const date = apps.date
        const number = apps.code
        const farmName = apps.plantations[0].plantation.farm_name
        const finalCode = `${farmName?.replace('Fazenda ', '')} - ${number}`
        const inputsArr = apps.inputs.map((input) => {
            const inputType = input.input.input_type_name
            const inputName = input.input.name
            const quantity = input.sought_quantity
            const inputId = input.input.id
            const inputLastUpdated = input.updated_at
            return ({
                date, 
                code: number,
                finalCode,
                farmName,
                inputType,
                inputName,
                quantity,
                inputId,
                inputLastUpdated
            })
        })
        return inputsArr.flat()

    })
    const finalArr =  newArrData.flat()
    console.log('newArrData', finalArr)
    return finalArr
}


export const farmDictCOde = [
    {projeto: 'Fazenda Benção de Deus', code: "0206"},
    {projeto: 'Fazenda Cacique', code: "0208"},
    {projeto: 'Fazenda Campo Guapo', code: "0208"},
    {projeto: 'Fazenda Capivara', code: "0202"},
    {projeto: "Fazenda Cervo", code: "0202"},
    {projeto: "Fazenda Eldorado", code: "0207"},
    {projeto: "Fazenda Jacaré", code: "0202"},
    {projeto: "Fazenda Lago Verde", code: "0207"},
    {projeto: "Fazenda Safira", code: "0208"},
    {projeto: "Fazenda Santa Maria", code: "0207"},
    {projeto: "Fazenda Tucano", code: "0202"},
    {projeto: "Fazenda Tuiuiu", code: "0202"},
    {projeto: "Fazenda Fazendinha", code: "0207"},
]

export const armazemDictCode = [
    {projeto: 'Fazenda Benção de Deus', code: "01"},
    {projeto: 'Fazenda Cacique', code: "01"},
    {projeto: 'Fazenda Campo Guapo', code: "01"},
    {projeto: 'Fazenda Capivara', code: "01"},
    {projeto: "Fazenda Cervo", code: "01"},
    {projeto: "Fazenda Eldorado", code: "17"},
    {projeto: "Fazenda Jacaré", code: "01"},
    {projeto: "Fazenda Lago Verde", code: "14"},
    {projeto: "Fazenda Safira", code: "01"},
    {projeto: "Fazenda Santa Maria", code: "19"},
    {projeto: "Fazenda Tucano", code: "01"},
    {projeto: "Fazenda Tuiuiu", code: "01"},
    {projeto: "Fazenda Fazendinha", code: "01"},
]

