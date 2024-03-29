import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";

const PageDataClass = ({ data }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const isNonMobile = useMediaQuery("(min-width: 1090px)");

	const dictData = [
		{ label: "Umidade", value: data.umidade },
		{ label: "Mercadoria", value: data.mercadoria },
		{ label: "Origem", value: data.origem },
		{ label: "Impureza", value: data.impureza },
		{ label: "Projeto", value: data.projeto },
		{ label: "Destino", value: data.destino }
	];

	return (
		<Box
			sx={{
				flexGrow: 1,
				border: "solid 1px black",
				padding: "4px"
			}}
		>
			<Grid container>
				{dictData.map((data, i) => {
					return (
						<Grid item xs={i === 0 || i === 3 ? 2 : 5} key={i}>
							<Box
								display="flex"
								justifyContent="start"
								itemsAlign="center"
								flex="0"
								sx={{
									borderBottom:
										i > 2 ? "" : "1px dotted black",
									borderRight:
										i === 2 || i === 5
											? ""
											: "1px dotted black",
									paddingLeft:
										i === 0 || i === 3 ? "4px" : "7px"
								}}
							>
								<Typography
									variant="h6"
									fontWeight="bold"
									color={colors.primary[700]}
								>
									{data.label}:
								</Typography>
								<Box
									width="50%"
									display="flex"
									justifyContent="end"
									flex="1"
									sx={{
										// backgroundColor: "red",
										marginRight: isNonMobile
											? "10%"
											: "7px",
										marginLeft: isNonMobile ? "7px" : "",
										whiteSpace: "nowrap"
									}}
								>
									<Typography
										variant="h6"
										color={colors.primary[700]}
									>
										{data.value}
									</Typography>
								</Box>
							</Box>
						</Grid>
					);
				})}
			</Grid>
		</Box>
	);
};

export default PageDataClass;
