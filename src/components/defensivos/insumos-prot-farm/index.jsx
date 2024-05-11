import { Box, Typography, Divider, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { tokens } from "../../../theme";

import styles from "./insumos-farmp.module.css";

import data from "./dados_defens.json";
import { useEffect, useState } from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Table from "react-bootstrap/Table";

import { nodeServer } from "../../../utils/axios/axios.utils";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useSelector } from "react-redux";

const onlyIns = ["DEFENSIVO", "FERTILIZANTES"];

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

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [onlyInsumos, setOnlyInsumos] = useState([]);
    const [onlyFarms, setOnlyFarms] = useState([]);
    const [onlyFarmsArr, setOnlyFarmsArr] = useState([]);
    const [filteredProdcuts, setFilteredProdcuts] = useState([]);

    const [loadingData, setLoadinData] = useState(false);
    const user = useSelector(selectCurrentUser);

    const [farm, setFarm] = useState("");

    const handleChange = (event) => {
        setFarm(event.target.value);
    };

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
                        console.log('resp openAPP: ',res.data);
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
        const filiais = [];
        data.itens.forEach((data) => {
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
        const filiaisArr = filiais.map((data) => data.desc_filial);
        setOnlyFarmsArr(filiaisArr);
    }, []);

    useEffect(() => {
        console.log(onlyFarms);
    }, [onlyFarms]);

    useEffect(() => {
        console.log(onlyFarmsArr);
    }, [onlyFarmsArr]);

    useEffect(() => {
        const newArr = data.itens.filter((type) =>
            onlyIns.includes(type.descriao_grupo)
        );
        const prods = newArr.map((prods) => prods.descricao_produto);
        const formProds = [...new Set(prods)];
        setOnlyInsumos(formProds);
    }, []);

    useEffect(() => {
        console.log(onlyInsumos);
    }, [onlyInsumos]);

    useEffect(() => {
        if (farm) {
            const newArr = data.itens.map((item) => {
                const newArr = item.filiais;
                let hasHere = false;
                newArr.forEach((filial) => {
                    if (filial.cod_filial === farm) {
                        hasHere = true;
                    }
                });
                return { ...item, hasHere };
            });
            const filtArr = newArr.filter((data) => data.hasHere === true);
            setFilteredProdcuts(filtArr);
        }
    }, [farm]);

    if (loadingData) {
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
        <Box>
            <Box mb={2}>
                <Typography>{data.descricao}</Typography>
                <Typography>{data.data_consulta.replace("-", " ")}</Typography>
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
                                <th>Grupo</th>
                                <th>Insumo</th>
                                <th>Un. Medida</th>
                                <th>Quantidade Estoque</th>
                                <th>ID Farm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProdcuts
                                .filter((type) => onlyIns.includes(type.descriao_grupo))
                                .sort((a, b) =>
                                    a.descricao_produto.localeCompare(b.descricao_produto)
                                )
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
                                            <td>{data.descriao_grupo}</td>
                                            <td>{data.descricao_produto.replace("DEFENSIVO", "")}</td>
                                            <td>{data.unidade_medida}</td>
                                            <td style={{ textAlign: "right" }}>
                                                <b style={{ marginRight: "40%" }}>
                                                    {totalprods.toLocaleString("pt-br", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
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
                                        </tr>
                                        // {/* <Typography>Depósitos:</Typography>
                                        // {data.filiais
                                        //     .filter((filial) => filial.cod_filial === farm)
                                        //     .map((filiais) => {
                                        //         return (
                                        //             <Box>
                                        //                 {filiais.locais.map((local) => {
                                        //                     return (
                                        //                         <Box>
                                        //                             <Typography>{local.armazem}</Typography>
                                        //                             <Typography>{local.quantidade}</Typography>
                                        //                         </Box>
                                        //                     );
                                        //                 })}
                                        //             </Box>
                                        //         );
                                        //     })} */}
                                        // {/* <Typography>{"-".repeat(100)}</Typography> */}
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
