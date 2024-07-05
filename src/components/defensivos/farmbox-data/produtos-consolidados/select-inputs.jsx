import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../../../theme'

import { useEffect } from 'react';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';




import { useState } from 'react';

const SelectInputs = (props) => {

    const { label, inputsArr, setSelectedData, selectedData } = props

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [personName, setPersonName] = useState([]);
    const [arrToMap, setarrToMap] = useState([]);
    const [disabledForm, setDisabledForm] = useState(true);

    
    
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    useEffect(() => {
        if(inputsArr.length > 0){
            const selectedProecj = selectedData?.Projeto
            if(label === "Ap"){
                if(selectedProecj && selectedProecj.length > 0){
                    const farmNameArr = selectedProecj.map((farm) => farm.replace('Fazenda ', ''))
                    const filterDatas = selectedData?.Data ? selectedData?.Data : []
                    const filtApps = inputsArr.filter((filtApss) => farmNameArr.includes(filtApss.split("-")[0].trim())).filter((apps) => filterDatas.includes((apps.split(' | ')[1])))
                    console.log('filtAppss: ', filtApps)
                    console.log('data Selected: ', selectedData?.Data)

                    setarrToMap(filtApps)    
                    setDisabledForm(false)
                } else {
                    setDisabledForm(true)
                }
            } else {
                setarrToMap(inputsArr)
                setDisabledForm(false)
            }
        }
    }, [inputsArr, selectedData]);

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 450,
                width: 200,
            },
        },
    };


    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        setSelectedData((prev) => ({
            ...prev, [label]: value
        }))
    };

    useEffect(() => {
        if(Object.keys(selectedData).length === 0) {
            setPersonName([])
        }
    }, [selectedData]);


    const formatApName = (ap) => {
        return ap.split(' | ')[0]
    }
  
    
    return (
        <Box>
            <FormControl sx={{ m: 1, width: 200 }}>
                <InputLabel 
                size='small' id="demo-multiple-name-label">{label}</InputLabel>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label={label} />}
                    MenuProps={MenuProps}
                    size='small'
                    disabled={disabledForm || arrToMap.length === 0}
                >
                    {arrToMap && arrToMap.map((name) => {
                        const labelValue = label === 'Data' ? name.split('-').reverse().join('/') : name
                        return (
                            <MenuItem
                                key={name}
                                value={name}
                            // style={getStyles(name, personName, theme)}
                            >
                                {formatApName(labelValue?.replace('Fazenda ', ''))}
                            </MenuItem>
                        )
                    }
                    )}
                </Select>
            </FormControl>
        </Box>
    );
}

export default SelectInputs;