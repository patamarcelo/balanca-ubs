import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";

const DateRange = ({ setParamsQuery, initialDate, setInitialDate, finalDate, setFinalDate, ticketApi  }) => {

    useEffect(() => {
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        setInitialDate(yesterday.toISOString().slice(0, 10))
        setFinalDate(yesterday.toISOString().slice(0, 10))
    }, []);

    useEffect(() => {
        const max = 9
        console.log(ticketApi.length)
        const totalzeros = (max - ticketApi.length)
        const zeroS = "0"
        const formatTicket = ticketApi.length > 0 ? zeroS.repeat(totalzeros) + ticketApi : ''

        const newObj = {
            dtIni: initialDate,
            dtFim: finalDate,
            ticket: formatTicket
        }
        setParamsQuery(newObj)
    }, [finalDate, initialDate, setParamsQuery, ticketApi]);
    return (
        <Box display={"flex"} flexDirection={"row"} gap={2} ml={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Data"
                    renderInput={params => <TextField size="small" {...params} />}
                    onChange={newValue =>
                        setInitialDate(new Date(newValue).toISOString().slice(0, 10))}
                    value={initialDate}
                />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Data"
                    renderInput={params => <TextField size="small" {...params} />}
                    onChange={newValue =>
                        setFinalDate(new Date(newValue).toISOString().slice(0, 10))}
                    value={finalDate}
                />
            </LocalizationProvider>
        </Box>
    );
};

export default DateRange;
