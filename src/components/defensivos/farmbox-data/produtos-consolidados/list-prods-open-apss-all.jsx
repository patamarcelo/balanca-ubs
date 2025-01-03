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
    const [selectedProject, setSelectedProject] = useState(null);


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
        if (data?.length > 0) {
            const newData = getInsumosListOpenApps(data)
            setDataHandleed(newData)
        }
    }, []);
    useEffect(() => {
        if (selectedData?.Projeto) {
            const projectSelected = selectedData?.Projeto[0]
            const mainFarmSelected = farmDictProject.find((data) => data.projeto === projectSelected)
            if (mainFarmSelected) {
                const mainFarm = mainFarmSelected?.mainFarm
                setSelectedProject(mainFarm)
            } else {
                setSelectedProject(null)
            }
        }
    }, [selectedData]);

    useEffect(() => {
        console.log('selectedProject', selectedProject)
        const filteredDataHandled = dataHandled.filter((data) => data.mainFarm === selectedProject && data.inputType !== 'Operação')
        const grouped = Object.values(
            filteredDataHandled.reduce((acc, item) => {
                if (!acc[item.inputId]) {
                    acc[item.inputId] = {
                        inputId: item.inputId,
                        inputName: item.inputName,
                        inputType: item.inputType,
                        totalQuantityOpen: 0
                    };
                }
                acc[item.inputId].totalQuantityOpen += item.quantityOpen;
                return acc;
            }, {})
        );
        if (grouped.length > 0) {
            setFilteredData(grouped)
            const totalValue = grouped.reduce((acc, curr) => acc += curr.totalQuantityOpen, 0)
            setFilteredDataTotalValue(totalValue)
        } else {
            setFilteredData(null)
            setFilteredDataTotalValue(0)
        }

    }, [selectedProject, dataHandled]);

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