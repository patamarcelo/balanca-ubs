import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import TextField from "@mui/material/TextField";

import { TRUCK_SHEETS } from "../../../store/trucks/reducer.initials";

const SheetFields = (props) => {
	const { truckValues, handleChangeTruck } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isNonMobile = useMediaQuery("(min-width: 900px)");

	return (
		<>
			<Typography
				variant="h4"
				color={colors.blueOrigin[400]}
				mt="20px"
				sx={{
					fontStyle: "italic"
				}}
			>
				Dados Descarga
			</Typography>
			<Box
				sx={{
					width: "100%",
					backgroundColor: colors.grey[800],
					borderRadius: "8px",
					height: "2px",
					margin: "0px 2px 20px 2px"
				}}
			/>
			<Box
				display="grid"
				gap="10px"
				mb={2}
				gridTemplateColumns={`repeat(${
					!isNonMobile ? "1" : "2"
				}, minmax(0, 1fr))`}
				sx={{
					width: "100%",
					"& .Mui-focused .MuiOutlinedInput-notchedOutline": {
						color: `${colors.blueOrigin[100]} !important`,
						borderColor: `${colors.blueOrigin[500]} !important`,
						fontWeight: "bold"
					},
					"& .MuiInputLabel-outlined": {
						color: `${colors.blueOrigin[100]} !important`
					},
					"& .MuiInputBase-formControl": {
						backgroundColor: `${colors.brown[600]} !important`
					},
					"& .MuiInputBase-formControl.Mui-focused": {
						backgroundColor: `${colors.brown[400]} !important`
					}
				}}
			>
				{TRUCK_SHEETS.map((input, index) => {
					return (
						<TextField
							key={index}
							variant="outlined"
							id={input.name}
							type={input.type}
							label={input.label}
							// onBlur={formik.handleBlur}
							onChange={handleChangeTruck}
							name={input.name}
							value={truckValues[input.name]}
							placeholder={input.placeholder}
							inputProps={{
								// maxLength: 13,
								step: "0.10"
							}}
							sx={{
								width: "100%"
							}}
							disabled={
								input.name === "relatorioColheita" &&
								truckValues["createdBy"] === "App" &&
								true
							}
						/>
					);
				})}
			</Box>
		</>
	);
};

export default SheetFields;
