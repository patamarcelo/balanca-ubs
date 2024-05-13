const dictFarm = [
{id: 11936, name: 'Fazenda Safira', protId: '0208'},
{id: 11937, name: 'Fazenda Tucano', protId: '0202'},
{id: 11938, name: 'Fazenda Jacaré', protId: '0202'},
{id: 11939, name: 'Fazenda Capivara', protId: '0202'},
{id: 11940, name: 'Fazenda Tuiuiu', protId: '0202'},
{id: 11941, name: 'Fazenda Cervo', protId: '0202'},
{id: 11942, name: 'Fazenda Lago Verde', protId: ''},
{id: 11943, name: 'Fazenda Praia Alta', protId: '0202'},
{id: 11944, name: 'Fazenda Campo Guapo', protId: '0208'},
{id: 11945, name: 'Fazenda Cacique', protId: '0208'},
{id: 11946, name: 'Fazenda Benção de Deus', protId: '0206'},
{id: 11947, name: 'Fazenda Santa Maria', protId: ''},
{id: 11948, name: 'Fazenda Eldorado', protId: ''},
{id: 11949, name: 'Fazenda Fazendinha', protId: '0207'},
{id: 11950, name: 'Fazenda Novo Acordo', protId: ''},
{id: 11951, name: 'Fazenda Ouro Verde', protId: '0204'}, 
{id: 12103, name: 'Fazenda 5 Estrelas ', protId: ''}, 
{id: 12104, name: 'Fazenda Pau Brasil', protId: ''}, 
{id: 12105, name: 'Fazenda Biguá', protId: ''}
]


const formatArrayData = (data) => {
    console.log('formar Data: ', data)

    const adjustTable = data.map((aps) => {
        const appNumber = aps.code
        const farmName = aps.plantations[0].plantation.farm.name
        const farmId = aps.plantations[0].plantation.farm.id
        const protId = dictFarm.find((farm) => farm.id === farmId).protId
        const progressos = aps.progresses.map((progress) => {
            const areaAplicada = progress.area
            return ({areaAplicada})
        })
        const totalAplicado = progressos.reduce((acc, curr) => acc + curr.areaAplicada, 0)
        const inputsArr = aps.inputs.map((input) => {
            const quantiSolicitada = input.sought_quantity
            const doseSolicitada = input.sought_dosage_value
            const quantidadeAplicada = (totalAplicado * doseSolicitada).toFixed(2)
            const insumoNome = input.input.name
            const insumoId = input.input.id
            const insumoTipo = input.input.input_type_name
            const quantidadeSaldoAplicar = (quantiSolicitada - quantidadeAplicada).toFixed(2)  //
            return ({
                quantiSolicitada,
                doseSolicitada,
                quantidadeAplicada,
                insumoNome,
                insumoId,
                insumoTipo,
                quantidadeSaldoAplicar
            })
        })
        // console.log('ap: ', appNumber, 'farm: ', farmName, 'totalAplicado: ', totalAplicado)
        // console.log(inputsArr)
        // console.log(progressos)
        return ({
            appNumber,
            farmName,
            farmId,
            protId,
            inputsArr,
        })
    })

    console.log(adjustTable)
}
export default formatArrayData

