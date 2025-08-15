import React, { useState } from 'react';
import {
    OutlinedInput,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Chip
} from '@mui/material';


const MultiSelectFilter = ({ data, label, selectedItems, onSelectionChange, width = 200, height, selectedProject = [] }) => {

    const MenuProps = {
        PaperProps: {
            style: {
                // maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                maxWidth: 250,
                maxHeight: height
            },
        },
    };
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        onSelectionChange(
            // Em valores múltiplos, o evento value é sempre um array.
            typeof value === 'string' ? value.split(',') : value,
        );
    };


    return (
        <FormControl sx={{ m: 1, maxWidth: width, minWidth: 200 }}>
            <InputLabel id={`multiple-chip-label-${label}`}>{label}</InputLabel>
            <Select
                size="small"
                labelId={`multiple-chip-label-${label}`}
                id={`multiple-chip-${label}`}
                multiple
                value={selectedItems}
                onChange={handleChange}
                input={<OutlinedInput id={`select-multiple-chip-${label}`} label={label} />}
                renderValue={(selected) => (
                    <div style={{ display: 'flex', gap: 0.5, flexDirection: 'row' }}>
                        {selected.map((value, index) => {
                            // Para Projetos, mostra o valor diretamente
                            if (label === 'Projetos') return <Chip key={value} label={value} />;
                            // Para parcelas, procura o item correspondente no data e mostra "Fazenda - Talhão"
                            const item = data.find((d) => d.id_farmbox === value);
                            const chipLabel = item
                                ? `${item.talhao__fazenda__nome.replace('Projeto', '')} - ${item.talhao__id_talhao}`
                                : value;
                            return <Chip key={value} label={chipLabel} />;
                        })}
                    </div>
                )}
                MenuProps={MenuProps}
            >
                {label === 'Projetos'
                    ? // Lista de projetos
                    data.map((item) => (
                        <MenuItem key={item} value={item}>
                            {item}
                        </MenuItem>
                    ))
                    : // Lista de parcelas ordenadas por fazenda e depois por talhão
                    data
                        .slice()
                        .sort((a, b) => {
                            // Ordena por fazenda
                            if (a.talhao__fazenda__nome < b.talhao__fazenda__nome) return -1;
                            if (a.talhao__fazenda__nome > b.talhao__fazenda__nome) return 1;
                            // Se fazenda igual, ordena talhão alfabeticamente
                            if (a.talhao__id_talhao < b.talhao__id_talhao) return -1;
                            if (a.talhao__id_talhao > b.talhao__id_talhao) return 1;
                            return 0;
                        })
                        .map((item) => (
                            <MenuItem key={item.id_farmbox} value={item.id_farmbox}>
                                {item.talhao__fazenda__nome.replace('Projeto', '')} - {item.talhao__id_talhao}
                            </MenuItem>
                        ))}
            </Select>
        </FormControl>

    );
};

export default MultiSelectFilter;