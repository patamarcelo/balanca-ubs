import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";

import classes from "./data.module.css";

const DataDefensivoPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { isLoadingHome, data } = props;

	useEffect(() => {
		// if (data) {
		// 	const sortData = data.sort((a, b) => {
		// 		var aa = a.data.replace("-", ""),
		// 			bb = b.data.replace("-", "");
		// 		return aa < bb ? -1 : aa > bb ? 1 : 0;
		// 	});
		// 	console.log("resumeby", sortData);
		// }
	}, [data]);

	return (
		<Box
			width="100%"
			height="96%"
			pb={2}
			mt={2}
			sx={
				{
					// backgroundColor: "red"
				}
			}
		>
			{isLoadingHome && data && (
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					width="100%"
					height="100%"
					mt={4}
					sx={{
						backgroundColor: colors.blueOrigin[700],
						borderRadius: "8px",
						boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
					}}
				>
					<Typography
						variant="h2"
						color={colors.yellow[700]}
						sx={{ fontWeight: "bold" }}
					>
						<CircularProgress sx={{ color: colors.primary[100] }} />
					</Typography>
				</Box>
			)}
			{!isLoadingHome && data && (
				<Box
					display="flex"
					flexDirection="column"
					justifyContent="start"
					alignItems="start"
					width="100%"
					height="100%"
					className={classes["data-table"]}
					sx={{
						padding: "10px 30px",
						backgroundColor: colors.blueOrigin[700],
						borderRadius: "8px",
						boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
					}}
				>
					{data.map((data, i) => {
						return (
							<Box key={i} display="flex">
								<Box display="flex" flexDirection="column">
									<Typography
										variant="h3"
										color={colors.primary[300]}
									>
										{data.fazenda} - {data.parcela} -{" "}
										{data.dados.area_colheita}
									</Typography>

									{data.dados.cronograma.map((data, j) => {
										return (
											<div key={j}>
												<Typography
													variant="h4"
													color={colors.primary[900]}
												>
													{data.estagio} <br />
													{data["data prevista"]}
												</Typography>
												{data.produtos.map(
													(data, i) => {
														return (
															<div key={i}>
																<Typography
																	variant="h6"
																	color={
																		colors
																			.blueAccent[400]
																	}
																>
																	{
																		data.produto
																	}
																	{
																		data[
																			"quantidade aplicar"
																		]
																	}
																</Typography>
															</div>
														);
													}
												)}
											</div>
										);
									})}
								</Box>
							</Box>
						);
					})}
				</Box>
			)}
		</Box>
	);
};

export default DataDefensivoPage;
