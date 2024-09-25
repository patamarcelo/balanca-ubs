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

            const code = farms.code
            const charged =  farms.responsible.name
            // const sought_area = farms.plantations.reduce((acc, curr) => {
            //     return acc += curr.sought_area
            // }, 0)
            const applied_area = farms.plantations.reduce((acc, curr) => {
                return acc += curr.applied_area
            }, 0)
            
            const inputs_data = farms.inputs.map((input) => {
                const type = input.input.input_type_name
                const name = input.input.name
                const input_id = input.input.id
                const input_dose = input.sought_dosage_value
                const input_sought_quantity = input.sought_quantity
                const input_applied_quantity = input_dose * applied_area
                const input_remain_quantity = input_sought_quantity - input_applied_quantity
                return ({
                    code, 
                    charged,
                    type, 
                    name,
                    input_id,
                    input_dose,
                    input_sought_quantity,
                    input_applied_quantity,
                    input_remain_quantity
                })
            })
            const onlyBio = inputs_data.filter((inputs) => inputs.type === 'Biológico')


            return onlyBio
        })

        const consolidateProds = getData.flat().reduce((acc, curr) => {
            if(acc.filter((data) => data.input_id === curr.input_id).length === 0){
                const objToAdd = {
                    input_id: curr.input_id,
                    quantity: curr.input_remain_quantity,
                    name: curr.name
                }
                acc.push(objToAdd)
            } else {
            const findIndexOf = f => f.input_id === curr.input_id;
            const getIndex = acc.findIndex(findIndexOf);
            acc[getIndex]["quantity"] += curr.input_remain_quantity
            }
            return acc
        },[])
        return consolidateProds

    }
    return data
}


export const dataFromDjangoArr = (data) => {
    const consolidate = data.reduce((acc, curr) => {
        if(acc.filter((data) => data.id_farm_box === curr.id_farmbox).length === 0){
            const objToAdd = {
                id_farm_box: curr.id_farmbox,
                orig: 'django_planted',
                quantity_planted_django: curr['quantidade aplicar'],
                descricao_produto: curr.produto
            }
            acc.push(objToAdd)
        } else {
            const findIndexOf = f => f.id_farm_box === curr.id_farmbox
            const getIndex = acc.findIndex(findIndexOf)
            acc[getIndex]['quantity_planted_django'] += curr['quantidade aplicar']
        }
        return acc
    },[])
    return consolidate

}

export const dataFromDjangoProjetadoArr = (data, filterDate) => {
    const filterBio = data.app_date.map((prods) => {
        const dateApp = prods.data
        const onlyBio = prods.produtos.filter((pro) => pro.tipo === 'biologico').map((app) => {
            return ({
                ...app, 
                data: dateApp
            })
        })
        return onlyBio
    } )
    const filteredDate = filterBio.flat().filter((date) => date.data <= filterDate)

    //consolidate prods
    const consolidateBio = filteredDate.reduce((acc, cur) =>{
        if(acc.filter((data) => data.id_farmbox === cur.id_farmbox).length === 0){
            acc.push(cur);
        } else {
            const findIndexOf = f => f.id_farmbox === cur.id_farmbox
            const getIndex = acc.findIndex(findIndexOf);
            acc[getIndex]['quantidade'] +=  cur.quantidade;
        }
        return acc
    },[])

    // const totalProd = consolidateBio.reduce((acc, cur) => acc += cur.quantidade,0)
    // console.log('totalProd',totalProd)

    return consolidateBio
}
export const dataFromDjangoProjetadoArrAll = (data, filterDate) => {
    const filterBio = data.app_date.map((prods) => {
        const dateApp = prods.data
        const onlyBio = prods.produtos.filter((pro) => pro.tipo === 'biologico').map((app) => {
            return ({
                ...app, 
                data: dateApp
            })
        })
        return onlyBio
    } )
    const filteredDate = filterBio.flat()

    //consolidate prods
    const consolidateBio = filteredDate.reduce((acc, cur) =>{
        if(acc.filter((data) => data.id_farmbox === cur.id_farmbox).length === 0){
            acc.push(cur);
        } else {
            const findIndexOf = f => f.id_farmbox === cur.id_farmbox
            const getIndex = acc.findIndex(findIndexOf);
            acc[getIndex]['quantidade'] +=  cur.quantidade;
        }
        return acc
    },[])

    // const totalProd = consolidateBio.reduce((acc, cur) => acc += cur.quantidade,0)
    // console.log('totalProd',totalProd)

    return consolidateBio
}


export const formatPreSt = (data) => {
    const typesBio = ["BIO DEFENSIVO", "INSUMOS BIOLOGICOS", "Biológico"]

    const onlyProds =  data.map((produtos) => {
        const prods = produtos.produtos.filter((prod) => typesBio.includes(prod.tipo_produto)).filter((quant) => Number(quant.quantidade_saldo) > 0).map((prods) => {
            return (
                {cod_produto: prods.id_produto, quantity_sts: prods.quantidade_saldo, descricao_produto: prods.produto}
            )
        })
        return prods.flat()
    })
    return onlyProds.flat()
}

export default formatProds