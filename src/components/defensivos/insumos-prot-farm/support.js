export const dictFarm = [{
    id: 11936,
    name: "Fazenda Safira",
    fazenda: 'Campo Guapo',
    protId: "0208"
},
{
    id: 11937,
    name: "Fazenda Tucano",
    fazenda: 'Diamante',
    protId: "0202"
},
{
    id: 11938,
    name: "Fazenda Jacaré",
    fazenda: 'Diamante',
    protId: "0202"
},
{
    id: 11939,
    name: "Fazenda Capivara",
    fazenda: 'Diamante',
    protId: "0202"
},
{
    id: 11940,
    name: "Fazenda Tuiuiu",
    fazenda: 'Diamante',
    protId: "0202"
},
{
    id: 11941,
    name: "Fazenda Cervo",
    fazenda: 'Diamante',
    protId: "0202"
},
{
    id: 11942,
    name: "Fazenda Lago Verde",
    fazenda: 'Lago Verde',
    protId: ""
},
{
    id: 11943,
    name: "Fazenda Praia Alta",
    fazenda: 'Diamante',
    protId: "0202"
},
{
    id: 11944,
    name: "Fazenda Campo Guapo",
    fazenda: 'Campo Guapo',
    protId: "0208"
},
{
    id: 11945,
    name: "Fazenda Cacique",
    fazenda: 'Campo Guapo',
    protId: "0208"
},
{
    id: 11946,
    name: "Fazenda Benção de Deus",
    fazenda: 'Bencao de Deus',
    protId: "0206"
},
{
    id: 11947,
    name: "Fazenda Santa Maria",
    fazenda: '',
    protId: ""
},
{
    id: 11948,
    name: "Fazenda Eldorado",
    fazenda: '',
    protId: ""
},
{
    id: 11949,
    name: "Fazenda Fazendinha",
    fazenda: '',
    protId: "0207"
},
{
    id: 11950,
    name: "Fazenda Novo Acordo",
    fazenda: '',
    protId: ""
},
{
    id: 11951,
    name: "Fazenda Ouro Verde",
    fazenda: '',
    protId: "0204"
},
{
    id: 12103,
    name: "Fazenda 5 Estrelas ",
    fazenda: '',
    protId: ""
},
{
    id: 12104,
    name: "Fazenda Pau Brasil",
    fazenda: '',
    protId: ""
},
{
    id: 12105,
    name: "Fazenda Biguá",
    fazenda: '',
    protId: ""
}
];

const formatArrayData = (data, isByPorject = true) => {
    console.log("formar Data: ", data);

    const adjustTable = data.map(aps => {
        const appNumber = aps.code;
        const farmName = aps.plantations[0].plantation.farm.name;
        const farmId = aps.plantations[0].plantation.farm.id;
        // console.log('farmname: ', farmId);

        const protId = dictFarm.find(farm => farm.id === farmId).protId;
        const farmOrigName = dictFarm.find(farm => farm.id === farmId).fazenda;
        const progressos = aps.progresses.map(progress => {
            const areaAplicada = progress.area;
            return {
                areaAplicada
            };
        });
        const totalAplicado = progressos.reduce(
            (acc, curr) => acc + curr.areaAplicada,
            0
        );
        const inputsArr = aps.inputs.map(input => {
            const quantiSolicitada = Number(input.sought_quantity);
            const doseSolicitada = Number(input.sought_dosage_value);
            const quantidadeAplicada = Number(totalAplicado * doseSolicitada) > 0 ? Number(totalAplicado * doseSolicitada) : 0
            const insumoNome = input.input.name;
            const insumoId = input.input.id;
            const insumoTipo = input.input.input_type_name;
            const quantidadeSaldoAplicar = Number(quantiSolicitada -
                quantidadeAplicada); //
            return {
                protId,
                farmOrigName,
                farmName,
                quantiSolicitada,
                doseSolicitada,
                quantidadeAplicada,
                insumoNome,
                insumoId,
                insumoTipo,
                quantidadeSaldoAplicar
            };
        });
        // console.log('ap: ', appNumber, 'farm: ', farmName, 'totalAplicado: ', totalAplicado, 'farmId: ', farmId)
        // console.log(inputsArr)
        // console.log(progressos)
        return {
            appNumber,
            farmName,
            farmId,
            protId,
            farmOrigName,
            inputsArr
        };
    });

    // console.log(adjustTable);

    const unionProdctsFarm = adjustTable.reduce((acc, curr) => {
        
        // isByPorject DEFINE IF IT"S GONNA GROUP BY FARM OR PROJECT
        if(isByPorject){
            if (acc.filter(f => f.farmId === curr.farmId).length === 0) {
                acc.push(curr);
            } else {
                // console.log("farmId", curr.farmId, 'protId', curr.protId, 'farmName', curr.farmName);
                const findIndexOfFarmId = e => e.farmId === curr.farmId;
                const getIndex = acc.findIndex(findIndexOfFarmId);
                acc[getIndex].inputsArr = [...acc[getIndex].inputsArr, ...curr.inputsArr];
            }
        } else {
            if (acc.filter(f => f.protId === curr.protId).length === 0) {
                acc.push(curr);
            } else {
                // console.log("farmId", curr.farmId, 'protId', curr.protId, 'farmName', curr.farmName);
                // const findIndexOfFarmId = e => e.farmId === curr.farmId;
                const findIndexOfProtId = e => e.protId === curr.protId;
                // const getIndex = isByPorject ? acc.findIndex(findIndexOfFarmId) : acc.findIndex(findIndexOfProtId) ;
                const getIndex = acc.findIndex(findIndexOfProtId) ;
                acc[getIndex].inputsArr = [...acc[getIndex].inputsArr, ...curr.inputsArr];
            }
        }
        return acc;
    }, []);


    const unionQuantProds = unionProdctsFarm.map((data) => {
        console.log('data', data);
        const inputsArrForm = data.inputsArr.reduce((acc, curr) =>{
            if(acc.filter(f => f.insumoId === curr.insumoId).length === 0){
                const objToAdd = {
                    ...curr,
                    quantiSolicitada: Number(curr.quantiSolicitada),
                    quantidadeAplicada: Number(curr.quantidadeAplicada),
                    quantidadeSaldoAplicar: Number(curr.quantidadeSaldoAplicar),
                    farmName: data.farmName,
                    farmId: data.farmId
                }
                acc.push(objToAdd);
                
            } else {
                const findIndexOf = e => e.insumoId === curr.insumoId;
                console.log('acc', acc)
                const getIndex = acc.findIndex(findIndexOf);
                acc[getIndex]["quantiSolicitada"] = Number(acc[getIndex]["quantiSolicitada"]) + Number(curr.quantiSolicitada);
                acc[getIndex]["quantidadeAplicada"] = Number(acc[getIndex]["quantidadeAplicada"]) + Number(curr.quantidadeAplicada)
                acc[getIndex]["quantidadeSaldoAplicar"] = Number(acc[getIndex]["quantidadeSaldoAplicar"]) + Number(curr.quantidadeSaldoAplicar)
            }
            // console.log('accAfter: ', acc)
            return acc
        },[])

        return inputsArrForm
    })
    if(unionQuantProds.length > 0) {
        console.log("resumo produtos consolidados: ", unionQuantProds.flat())
    }
    return unionQuantProds.flat()
};
export default formatArrayData;