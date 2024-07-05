import { Box } from '@mui/material'


import { useState, useEffect } from 'react';


import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const formatDateToISO = (date) => {
    const pad = (num) => num.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // getMonth() is zero-based
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    // Get timezone offset in minutes
    const timezoneOffset = -date.getTimezoneOffset();
    const sign = timezoneOffset >= 0 ? '+' : '-';
    const offsetHours = pad(Math.floor(Math.abs(timezoneOffset) / 60));
    const offsetMinutes = pad(Math.abs(timezoneOffset) % 60);
    const response = {
        first: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${sign}${offsetHours}:${offsetMinutes}`,
        second:  `${year}-${month}-${day}T${hours}:${minutes}`
    }

    return response
}

const DateTimeSelector = (props) => {
    const { label, setSelectedData, selectedData } = props;
    
    const formDate = new Date()
    const { second } = formatDateToISO(formDate)
    // const [value, setValue] = useState(dayjs(second));
    const [value, setValue] = useState(null);


    const handleChangeValue = (data) => {
        const formDate = new Date(data)
        const {first } = formatDateToISO(formDate)
        // console.log(first);
        // const baseDate = "2024-07-02T08:53:06.000-03:00"
        // console.log('é maior que a data do banco de dados, dia 02/07 as 08:53: ', first > baseDate)
        
        setSelectedData((prev) => ({
            ...prev, [label]: first
        }))

        setValue(data)

    }

    useEffect(() => {
        if(Object.keys(selectedData).length === 0) {
            setValue(null)
        }
    }, [selectedData]);
    return (
        <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    renderInput={(props) => <TextField {...props} size='small'/>}
                    label="Atualização"
                    value={value}
                    onChange={handleChangeValue}
                />
            </LocalizationProvider>
        </Box>
    );
}

export default DateTimeSelector;