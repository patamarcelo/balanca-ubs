import { Typography, useTheme, Box, Divider, Button } from "@mui/material";
import { tokens } from "../../../../theme";


import { useState, useEffect } from "react";

import { getInsumosListOpenApps, farmDictProject } from "./helper";

import * as XLSX from "xlsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';


const OpenApsAllprodsPage = ({ data, selectedData, setFilteredData, filteredData }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [dataHandled, setDataHandleed] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);


    const [filteredDataTotalValue, setFilteredDataTotalValue] = useState(0);


    const exportToExcel = () => {
        if (!filteredData || filteredData.length === 0) {
            return;
        }

        // Prepare data for Excel
        const dataForExcel = filteredData
            .sort((a, b) => a.inputName.localeCompare(b.inputName))
            .map((data) => ({
                "Produto": data.inputName,
                "Quantidade em Aberto": data.totalQuantityOpen,
            }));

        // Add the Total row
        dataForExcel.push({
            "Produto": "Total",
            "Quantidade em Aberto": filteredDataTotalValue,
        });

        // Create a new workbook and add data
        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Insumos");

        // Set locale for Excel (this ensures proper parsing of numbers)
        const workbookMetadata = {
            Workbook: {
                Views: [
                    {
                        RTL: false,
                        SheetNames: ["Sheet1"],
                    },
                ],
                Locale: "pt-BR", // Use Brazilian Portuguese for comma decimal
            },
        };
        // Export to file
        XLSX.writeFile(workbook, "InsumosConsolidados.xlsx", workbookMetadata);
    };


    const formatNumber = (data) => {
        return data.toLocaleString(
            "pt-br",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    }

    useEffect(() => {
        if (Array.isArray(data) && data.length > 0) {
            const newData = getInsumosListOpenApps(data);
            setDataHandleed(newData);
        } else {
            setDataHandleed([]);
        }
    }, [data]);

    useEffect(() => {
        const projectsSelected = Array.isArray(selectedData?.Projeto)
            ? selectedData.Projeto
            : [];

        const mainFarmsSelected = projectsSelected
            .map((projectSelected) => {
                const projectConfig = farmDictProject.find(
                    (item) => item.projeto === projectSelected
                );

                return projectConfig?.mainFarm;
            })
            .filter(Boolean);

        setSelectedProjects([...new Set(mainFarmsSelected)]);
    }, [selectedData?.Projeto]);

    const normalizeText = (value) =>
        String(value ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase();

    useEffect(() => {
        const normalizedProjects = new Set(
            selectedProjects.map(normalizeText)
        );

        const filteredDataHandled = dataHandled.filter((item) => {
            const belongsToSelectedProject =
                normalizedProjects.size === 0 ||
                normalizedProjects.has(
                    normalizeText(item?.mainFarm)
                );

            const isNotOperation =
                normalizeText(item?.inputType) !== "operacao";

            return belongsToSelectedProject && isNotOperation;
        });

        const grouped = Object.values(
            filteredDataHandled.reduce((acc, item) => {
                const inputId = Number(item?.inputId);
                const quantityOpen = Number(item?.quantityOpen);

                if (!Number.isFinite(inputId)) {
                    console.warn(
                        "Produto sem inputId válido:",
                        item
                    );
                    return acc;
                }

                if (!Number.isFinite(quantityOpen)) {
                    console.warn(
                        "Produto com quantityOpen inválido:",
                        item
                    );
                    return acc;
                }

                if (!acc[inputId]) {
                    acc[inputId] = {
                        inputId,
                        inputName: item?.inputName || "",
                        inputType: item?.inputType || "",
                        totalQuantityOpen: 0,
                    };
                }

                acc[inputId].totalQuantityOpen += quantityOpen;

                return acc;
            }, {})
        );

        setFilteredData(grouped);

        const totalValue = grouped.reduce(
            (total, item) =>
                total + Number(item.totalQuantityOpen || 0),
            0
        );

        setFilteredDataTotalValue(totalValue);

        console.log("Projetos selecionados:", selectedProjects);
        console.log(
            "Produtos consolidados dos projetos selecionados:",
            grouped
        );
    }, [
        selectedProjects,
        dataHandled,
        setFilteredData,
    ]);

    if (!filteredData && !filteredData?.length > 0) {
        return <Typography>sem produtos relacionados</Typography>
    }


    return (

        <Box>
            {
                filteredData && filteredData?.length > 0 &&
                <>
                    {/* Export Button */}
                    <Box mt={2} mb={1}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={exportToExcel}
                            size="small"
                            sx={{
                                minWidth: '40px !important',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '8px',
                                backgroundColor: '#28a745', // Excel-like green color
                                '&:hover': {
                                    backgroundColor: '#218838',
                                },
                            }}
                        >
                            <FontAwesomeIcon icon={faFileExcel} size="lg" style={{ fontSize: '18px', color: '#fff' }} />
                        </Button>
                    </Box>
                    <Typography variant='h5' fontWeight={"bold"} color={colors.grey[400]}>
                        Insumos Consolidados de todas as Aplicações em Aberto
                    </Typography>
                    <Box
                        sx={{
                            width: '400px',
                            marginTop: '30px'
                        }}
                    >
                        {
                            filteredData && filteredData?.length > 0 &&
                            filteredData?.sort((a, b) => a.inputName.localeCompare(b.inputName)).map((data, i) => {
                                return (
                                    <Box pl="2px" pr="2px"
                                        key={i}
                                        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: i % 2 === 0 && colors.grey[900] }}>
                                        <Typography variant="h5" color={colors.grey[300]}>{data.inputName}</Typography>
                                        <Typography variant="h5" color={colors.grey[400]}>{formatNumber(data.totalQuantityOpen)}</Typography>
                                    </Box>
                                )
                            })
                        }
                        <Divider sx={{ marginTop: '10px' }} />
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Typography variant="h5" color={colors.grey[300]}>Total</Typography>
                            <Typography variant="h5" color={colors.grey[400]}>{formatNumber(filteredDataTotalValue)}</Typography>
                        </Box>
                    </Box>
                </>
            }

        </Box>
    );
}

export default OpenApsAllprodsPage;