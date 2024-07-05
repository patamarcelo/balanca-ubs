import { Box, Typography, IconButton, useTheme } from '@mui/material'
import SelectInputs from './select-inputs';
import DateTimeSelector from './date-time-select';

import { tokens } from '../../../../theme';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectApp } from '../../../../store/plantio/plantio.selector';

import { generalDataArr, generalProjecs, generalTypesProds, generalAppsGeneral, getInsumosList } from './helper';

import ListProducts from './list-products';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
const ProdutosConsolidados = () => {
    const theme = useTheme();
	const colors = tokens(theme.palette.mode);

    const openApp = useSelector(selectApp);


    const [onlyDates, setOnlyDates] = useState([]);
    const [onlyProjetos, setOnlyProjetos] = useState([]);
    const [onlyTypes, setOnlyTypes] = useState([]);
    const [onlyApps, setOnlyApps] = useState([]);

    const [selectedData, setSelectedData] = useState({});

    const [productsArr, setProductsArr] = useState([]);

    // useEffect(() => {
    //     console.log('selectedData', selectedData);
    // }, [selectedData]);


    const handleClear = () => {
        console.log('clear')
        setSelectedData({})
    }

    useEffect(() => {
        if (openApp.length > 0) {
            console.log('open app: ', openApp);

            const getDates = generalDataArr(openApp)
            const getProjetos = generalProjecs(openApp)
            const getTypes = generalTypesProds(openApp)
            const getApps = generalAppsGeneral(openApp)
            const getProducts = getInsumosList(openApp)


            if (getDates.length > 0) {
                setOnlyDates(getDates);
                setOnlyProjetos(getProjetos);
                setOnlyTypes(getTypes)
                setOnlyApps(getApps)
                setProductsArr([])
                setProductsArr(getProducts)
            }
        }
    }, [openApp]);

    return (
        <Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 200px) 10px',
                    columnGap: '20px',
                    alignItems: 'center',
                }}
            >
                <SelectInputs label="Projeto" inputsArr={onlyProjetos} setSelectedData={setSelectedData} selectedData={selectedData} />
                <SelectInputs label="Data" inputsArr={onlyDates} setSelectedData={setSelectedData} selectedData={selectedData} />
                <SelectInputs label="Ap" inputsArr={onlyApps} setSelectedData={setSelectedData} selectedData={selectedData} />
                <SelectInputs label="Tipo" inputsArr={onlyTypes} setSelectedData={setSelectedData} selectedData={selectedData} />
                <DateTimeSelector label="DateTime" setSelectedData={setSelectedData} selectedData={selectedData}/>
                {
                    Object.keys(selectedData).length > 0 &&
                    <Box>
                        <IconButton aria-label="delete" onClick={handleClear} color="error">
                            <CancelPresentationIcon />
                        </IconButton>
                    </Box>
                }
            </Box>
            {
                Object.keys(selectedData).length > 0 &&
                    <Box>
                        <ListProducts selectedData={selectedData} productsArr={productsArr} />
                    </Box>
            }

        </Box>
    );
}

export default ProdutosConsolidados;