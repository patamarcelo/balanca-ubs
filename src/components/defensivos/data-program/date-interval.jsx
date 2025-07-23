import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { tokens } from "../../../theme";
import { useTheme } from "@emotion/react";

const DateIntervalPage = ({ setInitialDate, initialDateForm, label }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isDateValid = (dateStr) => {
		return !isNaN(new Date(dateStr));
	};
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
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
				componentsProps={{
					actionBar: {
						actions: ["clear", "cancel", "accept", "today"],
						sx: {
							backgroundColor: colors.brown[500],
							'& .MuiButton-root': {
								color: colors.textColor[100],           // Change button text color
							},
							'& .MuiButton-root:hover': {
								backgroundColor: colors.brown[550],
							}
						}
					}
				}}
			/>
		</LocalizationProvider>
	);
};

export default DateIntervalPage;
