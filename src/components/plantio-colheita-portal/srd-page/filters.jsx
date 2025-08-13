import React, { useState } from 'react';
import {
    OutlinedInput,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Chip
} from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;


const MultiSelectFilter = ({ data, label, selectedItems, onSelectionChange, width = 200, height }) => {

    const MenuProps = {
        PaperProps: {
            style: {
                // maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
                height
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

    function removeLeadingZeros(numberString) {
        return numberString.replace(/^0+/, '');
    }

    return (
        <FormControl sx={{ m: 1, width }}>
            <InputLabel id={`multiple-chip-label-${label}`}>{label}</InputLabel>
            <Select
                size='small'
                labelId={`multiple-chip-label-${label}`}
                id={`multiple-chip-${label}`}
                multiple
                value={selectedItems}
                onChange={handleChange}
                input={<OutlinedInput id={`select-multiple-chip-${label}`} label={label} />}
                renderValue={(selected) => (
                    <div style={{ display: 'flex', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} />
                        ))}
                    </div>
                )}
                MenuProps={MenuProps}
            >
                {data.map((item) => (
                    <MenuItem
                        key={item}
                        value={item}
                    >
                        {removeLeadingZeros(item)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default MultiSelectFilter;