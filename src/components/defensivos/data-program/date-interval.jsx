import { useState, useEffect } from "react";

import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DateIntervalPage = ({ setInitialDate, initialDateForm, label }) => {
	useEffect(() => {
		if (initialDateForm) {
			console.log(new Date(initialDateForm).toISOString().slice(0, 10));
		}
	}, [initialDateForm]);
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DatePicker
				label={label}
				value={initialDateForm}
				onChange={(newValue) => {
					setInitialDate(
						new Date(newValue).toISOString().slice(0, 10)
					);
				}}
				renderInput={(params) => <TextField {...params} />}
			/>
		</LocalizationProvider>
	);
};

export default DateIntervalPage;
