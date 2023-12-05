import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DateIntervalPage = ({ setInitialDate, initialDateForm, label }) => {
	const isDateValid = (dateStr) => {
		return !isNaN(new Date(dateStr));
	};
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DatePicker
				label={label}
				value={initialDateForm}
				onChange={(newValue) => {
					isDateValid(newValue) &&
						setInitialDate(
							new Date(newValue).toISOString().slice(0, 10)
						);
				}}
				renderInput={(params) => <TextField size="small" {...params} />}
			/>
		</LocalizationProvider>
	);
};

export default DateIntervalPage;
