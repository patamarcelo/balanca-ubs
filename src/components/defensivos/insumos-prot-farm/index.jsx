import { Box, Typography, Divider, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { tokens } from "../../../theme";

import styles from "./insumos-farmp.module.css";

import { useEffect, useState } from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Table from "react-bootstrap/Table";

import { nodeServer } from "../../../utils/axios/axios.utils";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useSelector } from "react-redux";

import formatArrayData, { dictFarm } from "./support";

import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

import Switch from '@mui/material/Switch';

import { nodeServerSrd } from "../../../utils/axios/axios.utils";


const onlyIns = ["DEFENSIVO", "FERTILIZANTES", "SEM CADASTRO"];

const InsumosProtFarm = () => {
    // const [onlyGrupo, setOnlyGrupo] = useState([]);

    // useEffect(() => {
    //     const newData = data.itens.map((type) =>  (type.descriao_grupo))
    //     const formData = [...new Set(newData)]
    //     setOnlyGrupo(formData)
    // }, []);

    // useEffect(() => {
    //     console.log(onlyGrupo)
    // }, [onlyGrupo]);

    const csvFileName = new Date()
        .toLocaleString()
        .replaceAll("/", "-")
        .split(",")[0];

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const useThemeHere = theme.palette.mode

    const [onlyInsumos, setOnlyInsumos] = useState([]);
    const [onlyFarms, setOnlyFarms] = useState([]);
    const [onlyFarmsArr, setOnlyFarmsArr] = useState([]);
    const [filteredProdcuts, setFilteredProdcuts] = useState([]);

    const [dataFromFam, setDataFromFam] = useState([]);
    const [dataFromProtheus, setdataFromProtheus] = useState([]);

    const [formatedProdcuts, setFormatedProdcuts] = useState([]);
    const [isByPorject, setIsByPorject] = useState(true);

    const [dataToCsv, setDataToCsv] = useState([]);
    const [dataToCsvScreen, setDataToCsvScreen] = useState([]);

    const [loadingData, setLoadinData] = useState(true);
    const [loadingDataProtheus, setloadingDataProtheus] = useState(true);



    const user = useSelector(selectCurrentUser);

    const [farm, setFarm] = useState("");

    const handleChange = (event) => {
        setFarm(event.target.value);
    };

    const handleChangeProjectTo = () => {
        setIsByPorject(!isByPorject);
    }

    useEffect(() => {
        const handleSearch = async () => {
            setloadingDataProtheus(true);
            try {
                nodeServerSrd
                    .get("/get-defensivos-from-srd", {
                        headers: {
                            Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
                        },
                    })
                    .then(res => {
                        console.log(res.data)
                        setdataFromProtheus(res.data);
                        setloadingDataProtheus(false);
                    }).catch((err) => {
                        setloadingDataProtheus(false)
                        window.alert('erro ao pegar os dados: ', err)
                    })
            } catch (error) {
                console.log("erro ao pegar os dados: ", error);
                setloadingDataProtheus(false);
            } finally {
                // setIsLoading(false);
            }
        };

        handleSearch()
    }, [user]);


    useEffect(() => {
        const getTrueApi = async () => {
            try {
                setLoadinData(true);
                await nodeServer
                    .get("/data-open-apps", {
                        headers: {
                            Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
                            "X-Firebase-AppCheck": user.accessToken
                        }
                        // params: {
                        // 	safraCiclo
                        // }
                    })
                    .then((res) => {
                        setDataFromFam(res.data);
                    })
                    .catch((err) => console.log(err));
            } catch (err) {
                console.log("Erro ao consumir a API", err);
            } finally {
                setLoadinData(false);
            }
        };
        getTrueApi();
    }, [user]);

    useEffect(() => {
        if (dataFromFam) {
            const formData = formatArrayData(dataFromFam, !isByPorject);
            setFormatedProdcuts(formData);
        }
    }, [dataFromFam, isByPorject]);

    const formatNumber = (number) => {
        if (number) {
            return number?.toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        return "-"
    }


    useEffect(() => {
        if (formatedProdcuts) {
            const headerCsv = [
                [
                    "Id Fazenda Prodtheus",
                    "Projeto",
                    "ID Projeto Protheus",
                    "Inusmo",
                    "Inusmo TIpo",
                    "Insumo ID",
                    "dose",
                    "Quantidade Solicitada",
                    "Quantidade Aplicada",
                    "Quantidade Saldo Aplicar"
                ]
            ];

            formatedProdcuts.forEach((prod) => {
                const newLine = [
                    prod.protId,
                    prod.farmName,
                    prod.farmId,
                    prod.insumoNome,
                    prod.insumoTipo,
                    prod.insumoId,
                    formatNumber(prod.doseSolicitada),
                    formatNumber(prod.quantiSolicitada),
                    formatNumber(prod.quantidadeAplicada),
                    formatNumber(prod.quantidadeSaldoAplicar)
                ];
                headerCsv.push(newLine);
            });
            setDataToCsv(headerCsv);
        }
    }, [formatedProdcuts]);

    useEffect(() => {
        if (filteredProdcuts) {
            const headerCsvHere = [
                [
                    "Fazenda",
                    "Grupo",
                    "Insumo",
                    'Unidade Medida',
                    "Quantidade Estoque",
                    "Necessidade Farm",
                    "Saldo Produtos",
                    "ID Farm",
                    "ID Protheus"
                ]
            ]
            const farmFilt = filteredProdcuts.filter((data) => data.quantidadeSaldoAplicar !== undefined)
            const protFilt = filteredProdcuts.filter((data) => data.quantidadeSaldoAplicar === undefined)
            console.log(farmFilt)
            console.log(protFilt)
            const newArrSorted = farmFilt
            newArrSorted.push(...protFilt)

            newArrSorted
                .filter((type) => onlyIns.includes(type.descriao_grupo))
                .forEach((row) => {
                    const totalprods = row.filiais
                        .filter((filial) => filial.cod_filial === farm)
                        .map((filiais) =>
                            filiais.locais.reduce(
                                (acc, curr) => acc + curr.quantidade,
                                0
                            )
                        );
                    const saldoProd = formatNumber(handleQUantProd(totalprods[0], row?.quantidadeSaldoAplicar))
                    const newLine = [
                        row.farmOrigName,
                        row.descriao_grupo,
                        row.descricao_produto,
                        row.unidade_medida,
                        formatNumber(totalprods),
                        formatNumber(row.quantidadeSaldoAplicar),
                        saldoProd,
                        row.id_farm_box,
                        row.cod_produto
                    ]
                    headerCsvHere.push(newLine)
                })

            setDataToCsvScreen(headerCsvHere)
        }

    }, [filteredProdcuts, farm]);

    useEffect(() => {
        if (dataFromProtheus?.itens?.length > 0) {
            console.log('gerando as filiais')
            const filiais = [];
            dataFromProtheus?.itens.forEach((data) => {
                data.filiais.forEach((filial) => {
                    const hasFilial = filiais.filter(
                        (data) => data.cod_filial === filial.cod_filial
                    );
                    if (hasFilial.length === 0) {
                        filiais.push({
                            cod_filial: filial.cod_filial,
                            desc_filial: filial.desc_filial
                        });
                    }
                });
            });
            setOnlyFarms(filiais);
            console.log('filiais', filiais);
            const filiaisArr = filiais.map((data) => data.desc_filial);
            setOnlyFarmsArr(filiaisArr);
        }
    }, [dataFromProtheus]);

    useEffect(() => {
        if (dataFromProtheus?.itens?.length > 0) {
            const newArr = dataFromProtheus.itens.filter((type) =>
                onlyIns.includes(type.descriao_grupo)
            );
            const prods = newArr.map((prods) => prods.descricao_produto);
            const formProds = [...new Set(prods)];
            setOnlyInsumos(formProds);
        }
    }, [dataFromProtheus]);

    useEffect(() => {
        if(dataFromProtheus) {
            if (farm) {
                const newArr = dataFromProtheus.itens.map((item) => {
                    const newArr = item.filiais;
                    let hasHere = false;
                    let farmProd = {};
                    let farmOrigName;
                    newArr.forEach((filial) => {
                        if (filial.cod_filial === farm) {
                            hasHere = true;
                            const farmProdFilt = formatedProdcuts.filter(
                                (filt) => filt.protId === filial.cod_filial
                            );
                            farmOrigName = dictFarm.find((f) => f.protId === filial.cod_filial)?.fazenda;
                            const prodToAdd = farmProdFilt.find(
                                (prod) => prod.insumoId === Number(item.id_farm_box)
                            );
                            if (prodToAdd) {
                                farmProd = prodToAdd;
                            }
                        }
                    });
                    return { ...item, hasHere, ...farmProd, farmOrigName };
                });
                console.table('newARR: ', newArr);
                const filtArr = newArr.filter((data) => data.hasHere === true).sort((a, b) => a.descricao_produto.localeCompare(b.descricao_produto));
                const idIn = filtArr.map((data) => Number(data.id_farm_box));
                console.log('farm', farm)
                const prodToAddNoCodeFinded = formatedProdcuts
                    .filter((filt) => filt.protId === farm)
                    .filter((type) => type.insumoTipo !== "Operação")
                prodToAddNoCodeFinded.forEach((prodToAdd) => {
                    if (idIn.includes(prodToAdd.insumoId)) {
                        // console.log('ja consta')
                        // console.log('adicionar: ', prodToAdd)
                        // const findProd = filtArr.find((data) => data.id_farm_box === prodToAdd.insumoId);
                        // console.log('incrementar: ', filtArr[0])
                        const findIndexOfFarmId = e => Number(e.id_farm_box) === prodToAdd.insumoId && e.protId === prodToAdd.protId && e?.quantiSolicitada === prodToAdd?.quantiSolicitada;
                        const getIndex = filtArr.findIndex(findIndexOfFarmId)
                        if (getIndex !== -1) {
                            // console.log('não faça o incremento', prodToAdd)
                        } else {
                            const findIndexOfFarmId = e => Number(e.id_farm_box) === prodToAdd.insumoId && e.protId === prodToAdd.protId && e?.quantiSolicitada !== prodToAdd?.quantiSolicitada;
                            const getIndexNew = filtArr.findIndex(findIndexOfFarmId)
                            // console.log('incrementar', filtArr[getIndexNew])
                            filtArr[getIndexNew].quantiSolicitada += prodToAdd.quantiSolicitada
                            filtArr[getIndexNew].quantidadeAplicada += prodToAdd.quantidadeAplicada
                            filtArr[getIndexNew].quantidadeSaldoAplicar += prodToAdd.quantidadeSaldoAplicar
                        }
                    } else {
                        const obToAdd = {
                            descriao_grupo: "SEM CADASTRO",
                            descricao_produto: prodToAdd.insumoNome,
                            quantidadeSaldoAplicar: prodToAdd.quantidadeSaldoAplicar,
                            unidade_medida: " - ",
                            id_farm_box: prodToAdd.insumoId,
                            cod_filial: farm,
                            filiais: [],
                            farmName: prodToAdd.farmName.replace('Fazenda', ''),
                            farmOrigName: prodToAdd.farmOrigName
                        };
                        filtArr.push(obToAdd);
                    }
                });
                const farmFilt = filtArr.filter((data) => data.quantidadeSaldoAplicar !== undefined)
                const protFilt = filtArr.filter((data) => data.quantidadeSaldoAplicar === undefined)
                console.log(farmFilt)
                console.log(protFilt)
                const newArrSorted = farmFilt
                newArrSorted.push(...protFilt)
                setFilteredProdcuts(newArrSorted);
            }
        }
    }, [farm, formatedProdcuts, dataFromProtheus]);

    const handleQUantProd = (protheus, farm) => {
        if (isNaN(protheus) || isNaN(farm)) {
            return " - ";
        }
        if (Number(protheus) > 0 && Number(farm)) {
            const result = Number(protheus) - Number(farm);
            return result;
        }
        return " - "
    };

    if (loadingData || loadingDataProtheus ) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <CircularProgress
                    size={30}
                    sx={{
                        margin: "0px 10px",
                        color: (theme) =>
                            colors.greenAccent[theme.palette.mode === "dark" ? 200 : 800]
                    }}
                />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                margin: "20px -10px",
                padding: '20px 20px 40px 20px',
                backgroundColor: useThemeHere !== 'dark' && "whitesmoke"
            }}
        >
            <Box
                mb={1}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px"
                }}
            >
                <Box>
                    <Typography>{dataFromProtheus.descricao}</Typography>
                    <Typography>{dataFromProtheus.data_consulta.replace("-", " ")}</Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px"
                    }}
                >
                    <CSVLink
                        data={dataToCsv}
                        separator={";"}
                        filename={`${csvFileName}_insumos.csv`}
                    >
                        <FontAwesomeIcon
                            icon={faFileExcel}
                            color={colors.greenAccent[500]}
                            size="xl"
                            style={{ paddingLeft: "5px" }}
                        />
                    </CSVLink>
                    <CSVLink
                        data={dataToCsvScreen}
                        separator={";"}
                        filename={`${csvFileName}_insumos.csv`}
                    >
                        <FontAwesomeIcon
                            icon={faFileExcel}
                            color={colors.greenAccent[500]}
                            size="xl"
                            style={{ paddingLeft: "5px" }}
                        />
                    </CSVLink>
                    <Switch
                        checked={isByPorject}
                        onChange={handleChangeProjectTo}
                        inputProps={{ 'aria-label': 'controlled' }}
                        color="secondary"
                    />
                </Box>
            </Box>
            <Divider />
            <Box mt={2} mb={2}>
                <FormControl sx={{ minWidth: "200px" }}>
                    <InputLabel id="fazenda-group">Selecione uma Fazenda</InputLabel>
                    <Select
                        labelId="fazenda-group"
                        id="fazenda-group-id"
                        value={farm}
                        label="Projeto"
                        onChange={handleChange}
                    >
                        {onlyFarms.map((farm, i) => {
                            return (
                                <MenuItem key={i} value={farm.cod_filial}>
                                    {farm.desc_filial.split("-")[1].trim()}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Box>
            {farm && (
                <Box mt={2}>
                    <Table
                        striped
                        bordered
                        hover
                        style={{ width: "100%", color: colors.textColor[100] }}
                        size="sm"
                    >
                        <thead
                            style={{
                                backgroundColor: colors.blueOrigin[300],
                                color: "white"
                            }}
                        >
                            <tr>
                                {/* <th>Projeto</th> */}
                                <th>Fazenda</th>
                                <th>Grupo</th>
                                <th>Insumo</th>
                                <th>Un. Medida</th>
                                <th>Quantidade Estoque</th>
                                <th>Necessidade Farm</th>
                                <th>Saldo Produtos</th>
                                <th>ID Farm</th>
                                <th>id Protheus</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProdcuts
                                .filter((type) => onlyIns.includes(type.descriao_grupo))
                                // .sort((a, b) => a.descricao_produto.localeCompare(b.descricao_produto))
                                // .sort((a, b) => a.descricao_produto.localeCompare(b.descricao_produto) && a.descriao_grupo.localeCompare(b.descriao_grupo))
                                .map((data, i) => {
                                    const totalprods = data.filiais
                                        .filter((filial) => filial.cod_filial === farm)
                                        .map((filiais) =>
                                            filiais.locais.reduce(
                                                (acc, curr) => acc + curr.quantidade,
                                                0
                                            )
                                        );

                                    return (
                                        <tr
                                            key={i}
                                            className={`${i % 2 !== 0 ? styles.oddRow : styles.evenRow
                                                }`}
                                        >
                                            <td>{data?.farmOrigName ? data.farmOrigName : '-'}</td>
                                            {/* <td>{data?.farmName ? data.farmName : '-'}</td> */}
                                            <td>{data.descriao_grupo}</td>
                                            <td>{data.descricao_produto.replace("DEFENSIVO", "")}</td>
                                            <td>{data.unidade_medida}</td>
                                            <td style={{ textAlign: "right" }}>
                                                <b style={{ marginRight: "40%" }}>
                                                    {totalprods > 0 ? totalprods.toLocaleString("pt-br", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }) : ' - '}
                                                </b>
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                <b style={{ marginRight: "40%" }}>
                                                    {data?.quantidadeSaldoAplicar
                                                        ? formatNumber(data?.quantidadeSaldoAplicar)
                                                        : " - "}
                                                </b>
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                <b
                                                    style={{
                                                        marginRight: "40%",
                                                        color:
                                                            handleQUantProd(
                                                                totalprods,
                                                                data?.quantidadeSaldoAplicar
                                                            ) < 0 && "red"
                                                    }}
                                                >
                                                    {formatNumber(
                                                        handleQUantProd(
                                                            totalprods,
                                                            data?.quantidadeSaldoAplicar
                                                        )
                                                    )}
                                                </b>
                                            </td>

                                            <td
                                                style={{
                                                    color: !data.id_farm_box && "red",
                                                    fontWeight: !data.id_farm_box && "bold"
                                                }}
                                            >
                                                {data.id_farm_box ? data.id_farm_box : "Sem ID"}
                                            </td>
                                            <td>
                                                {data?.cod_produto ? data.cod_produto : " - "}
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </Table>
                </Box>
            )}
        </Box>
    );
};

export default InsumosProtFarm;
