import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { Box, useTheme } from "@mui/material";
import { useState, useEffect } from "react";

import { tokens } from '../../../theme'


const DateRange = ({ setParamsQuery, initialDate, setInitialDate, finalDate, setFinalDate, ticketApi }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        setInitialDate(yesterday.toISOString().slice(0, 10))
        setFinalDate(today.toISOString().slice(0, 10))
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
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                    label="Data"
                    renderInput={params => <TextField size="small" {...params} sx={{ width: '155px' }} />}
                    onChange={newValue =>
                        setInitialDate(new Date(newValue).toISOString().slice(0, 10))}
                    value={initialDate}
                    componentsProps={{
                        actionBar: {
                            actions: ["clear", "cancel", "accept", "today"],
                            sx: {
                                backgroundColor: colors.blueAccent[100],  // Change action bar background
                                '& .MuiButton-root': {
                                    color: colors.textColor[200],           // Change button text color
                                },
                                '& .MuiButton-root:hover': {
                                    backgroundColor: "#e0e0e0", // Hover color effect
                                }
                            }
                        }
                    }}
                />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                    label="Data"
                    renderInput={params => <TextField size="small" {...params} sx={{ width: '155px' }} />}
                    onChange={newValue =>
                        setFinalDate(new Date(newValue).toISOString().slice(0, 10))}
                    value={finalDate}
                    componentsProps={{
                        actionBar: {
                            actions: ["clear", "cancel", "accept", "today"],
                            sx: {
                                backgroundColor: colors.blueAccent[100],  // Change action bar background
                                '& .MuiButton-root': {
                                    color: colors.textColor[200],           // Change button text color
                                },
                                '& .MuiButton-root:hover': {
                                    backgroundColor: "#e0e0e0", // Hover color effect
                                }
                            }
                        }
                    }}
                />
            </LocalizationProvider>
        </Box>
    );
};

export default DateRange;
