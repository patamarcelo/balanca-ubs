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
                    const filtApps = inputsArr.filter((filtApss) => farmNameArr.includes(filtApss.split("-")[0].trim()))
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
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
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



  
    
    return (
        <Box>
            <FormControl sx={{ m: 1, width: 250 }}>
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
                    disabled={disabledForm}
                >
                    {arrToMap && arrToMap.map((name) => {
                        const labelValue = label === 'Data' ? name.split('-').reverse().join('/') : name
                        return (
                            <MenuItem
                                key={name}
                                value={name}
                            // style={getStyles(name, personName, theme)}
                            >
                                {labelValue?.replace('Fazenda ', '')}
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