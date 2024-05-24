const formatProds = (data) => {
    // console.log('prods Here, : ', data)

    const adjustArrByFarm = data.map((farms) => {
        const cod_grupo = farms.cod_grupo
        const cod_produto = farms.cod_produto
        const descriao_grupo = farms.descriao_grupo
        const descricao_produto = farms.descricao_produto
        const id_farm_box = farms.id_farm_box ? farms.id_farm_box : cod_produto
        const unidade_medida = farms.unidade_medida


        //agrupar por filial
        const filiaisArr = farms.filiais.map((filial) => {
            const total = filial.locais.reduce((acc, curr) => acc + curr.quantidade, 0)
            return {
                cod_grupo,
                cod_produto,
                quantidade: total,
                descriao_grupo,
                descricao_produto,
                id_farm_box,
                unidade_medida,
                cod_filial: filial.cod_filial,
                desc_filial: filial.desc_filial,
                locais: filial.locais
            }
        })
        return filiaisArr
    })



    //agrupar por produto e filial
    const productsArray = adjustArrByFarm.flat().reduce((acc, curr) => {
        if (acc.filter((f) => f.cod_filial === curr.cod_filial && f.id_farm_box === curr.id_farm_box).length === 0) {
            acc.push(curr)
        } else {
            const findIndexOf = f => f.cod_filial === curr.cod_filial && f.id_farm_box === curr.id_farm_box;
            const getIndex = acc.findIndex(findIndexOf);
            acc[getIndex]["quantidade"] += curr.quantidade
            acc[getIndex]["locais"] = [...acc[getIndex]['locais'], ...curr.locais]
        }
        return acc
    }, [])


    //agrupar por produto geral
    const consProds = productsArray.reduce((acc, curr) => {
        if (acc.filter((data) => data.id_farm_box === curr.id_farm_box).length === 0) {
            const objToAdd = {
                ...curr,
            }
            objToAdd[`${curr.cod_filial}-${curr.id_farm_box}`] = curr.quantidade
            acc.push(objToAdd)
        } else {
            const findIndexOf = f => f.id_farm_box === curr.id_farm_box;
            const getIndex = acc.findIndex(findIndexOf);
            acc[getIndex]["quantidade"] += curr.quantidade
            const getValue = acc[getIndex][`${curr.cod_filial}-${curr.id_farm_box}`] === undefined ? curr.quantidade : acc[getIndex][`${curr.cod_filial}-${curr.id_farm_box}`]
            if (acc[getIndex][`${curr.cod_filial}-${curr.id_farm_box}`]) {
                acc[getIndex][`${curr.cod_filial}-${curr.id_farm_box}`] += getValue
            } else {
                acc[getIndex][`${curr.cod_filial}-${curr.id_farm_box}`] = getValue
            }
        }
        return acc
    }, [])
    return consProds
}



export const dataFromFarm = (data) => {
    if (data.length > 0) {
        const getData = data.map((farms) => {
            console.log('code', farms.code)
            const sought_area = farms.plantations.reduce((acc, curr) => {
               return acc += curr.sought_area
            },0)
            const applied_area = farms.plantations.reduce((acc, curr) => {
                return acc += curr.applied_area
            },0)
            console.log('solicitado: ', sought_area, 'Aplicado: ', applied_area)

        })

    }
    return data
}

export default formatProds