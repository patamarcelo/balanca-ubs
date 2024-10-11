const handlerDataColheita = (data) => {
    // data.forEach((element) => {
    //     console.log(element);
    // });

    const newArr = data.map((details) => {
        const cultureName = details?.plantations[0]?.plantation?.culture_name
        const varietyName = details?.plantations[0]?.plantation?.variety_name
        const codeAp = details.code;
        const farmName = details.plantations[0].plantation.farm_name;
        const talhoesArr = details.plantations.map((talhao) => {
            const areaAplicada = talhao.applied_area;
            const areaSolicitada = talhao.sought_area;
            const areaTalhao = talhao.plantation.area;
            const parcela = talhao.plantation.name;
            const parcelaId = talhao.plantation.id;
            const lastUpdate = talhao.updated_at;
            return {
                areaAplicada,
                areaSolicitada,
                areaTalhao,
                parcela,
                codeAp,
                farmName,
                lastUpdate,
                parcelaId,
                varietyName,
                cultureName
            };
        });
        return talhoesArr.flat();
    });

    const newExtratoArr = data.map((details) => {
        const codeAp = details.code;
        const farmName = details.plantations[0].plantation.farm_name;
        const updatedAt = details.updated_at
        const talhoesArr = details.plantations.map((talhao) => {
            console.log('talhao: ', talhao.plantation)
            const areaAplicada = talhao.applied_area;
            const areaSolicitada = talhao.sought_area;
            const areaTalhao = talhao.plantation.area;
            const parcela = talhao.plantation.name;
            const parcelaId = talhao.plantation.id;
            const lastUpdate = talhao.updated_at;
            const cultura = talhao.plantation.culture_name;
            const variedade = talhao.plantation.variety_name;
            return {
                areaAplicada,
                areaSolicitada,
                areaTalhao,
                parcela,
                codeAp,
                farmName,
                lastUpdate,
                parcelaId,
                updatedAt,
                cultura, 
                variedade
            };
        });
        const progressos = details.progresses.map((progress) => {
            const dataApplied = progress.date;
            const updatedAt = progress.updated_at.split('T')[0];
            const eachProgress = progress.plantations.map((plantProgr) => {
                const plantioId = plantProgr.plantation_id;
                return {
                    codeAp,
                    dataApplied,
                    areaAplied: plantProgr.area,
                    plantationId: plantioId,
                    farmName: farmName,
                    parcela: talhoesArr.find((talhao) => talhao.parcelaId === plantioId)
                        ?.parcela,
                    totalApplied: talhoesArr.find((talhao) => talhao.parcelaId === plantioId)
                        ?.areaAplicada,
                    cultura: talhoesArr.find((talhao) => talhao.parcelaId === plantioId)
                        ?.cultura,
                    variedade: talhoesArr.find((talhao) => talhao.parcelaId === plantioId)
                        ?.variedade,
                    updatedAt,
                };
            });
            return eachProgress;
        });
        return progressos.flat();
    });

    const formatExtratoColheitaCsv = newExtratoArr.flat();
    const formatExtratoColheita = [
        ["Projeto", "AP", "Parcela", "Area Aplicada", "Data Aplicacao","Hora Aplicacao","Total Aplicado", "plantioId", 'editado', 'cultura', 'variedade']
    ];
    formatExtratoColheitaCsv.forEach((element) => {
        const dateApp = element.dataApplied.split('T')[0]
        const horaAp = element.dataApplied.split('T')[1].substring(0,5)
        // let adjustDateAp = dateApp
        // if(Number(horaAp.substring(0,2)) < 16){
        //     const newDate = new Date(element.dataApplied)
        //     console.log('newDateeee: ', newDate, element.codeAp)
        //     newDate.setDate(newDate.getDate() - 1)
        //     adjustDateAp = newDate.toLocaleString().split(',')[0]
        // }
        const arrToAdd = [
            element.farmName,
            element.codeAp,
            element.parcela,
            element.areaAplied.toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }),
            dateApp,
            horaAp,
            element.totalApplied.toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }),
            element.plantationId,
            element.updatedAt,
            element.cultura,
            element.variedade
        ];
        formatExtratoColheita.push(arrToAdd);
    });

    // ARRAY COM OS TOTAIS DE PARCELAS E FAZENDAS
    const sortedArr = newArr
        .flat()
        .sort((a, b) => a.farmName.localeCompare(b.farmName));

    // ARRAY COM O TOTAL CAREGADO POR FAZENDA
    const totalByFarm = sortedArr.reduce((acc, curr) => {
        if (acc.filter((data) => data.farmName === curr.farmName).length === 0) {
            const objToAdd = {
                farmName: curr.farmName,
                areaAplicada: curr.areaAplicada,
                areaFazenda: curr.areaTalhao
            };
            acc.push(objToAdd);
        } else {
            const findIndexOf = (e) => e.farmName === curr.farmName;
            const getIndex = acc.findIndex(findIndexOf);
            acc[getIndex]["areaAplicada"] += curr.areaAplicada;
            acc[getIndex]["areaFazenda"] += curr.areaTalhao;
        }

        return acc;
    }, []);

    // Numero total geral colhido
    const totalGeral = totalByFarm.reduce(
        (acc, curr) => (acc += curr.areaAplicada),
        0
    );
    const totalAbertoFAzendas = totalByFarm.reduce(
        (acc, curr) => (acc += curr.areaTalhao),
        0
    );
    const onlyAps = sortedArr.map((data) => {
        const apName = `${data.codeAp};${data.farmName};${data.cultureName};${data.varietyName}`;
        return apName;
    });
    const filtAps = [...new Set(onlyAps)];
    const onlyFormatAps = filtAps.map((data) => {
        const codeAp = data.split(";")[0];
        const farmName = data.split(";")[1];
        const cultureName = data.split(";")[2];
        const varietyName = data.split(";")[3];
        return { codeAp: codeAp, farmName: farmName, cultureName, varietyName };
    });

    return {
        sortedArr,
        totalByFarm,
        totalGeral,
        onlyFormatAps,
        totalAbertoFAzendas,
        formatExtratoColheita
    };
};

export default handlerDataColheita;
