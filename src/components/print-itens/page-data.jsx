import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
// import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../../utils/assets/img/logo.jpg";

import { Divider } from "@mui/material";

const PageData = ({ data }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const dictData = [
		{ label: "Data", value: data.entrada },
		{ label: "Cultura", value: data.cultura },
		{ label: "Placa", value: data.placa }
	];
	const dictDataR = [
		{ label: "Bruto", value: data.pesoBruto },
		{ label: "Tara", value: data.tara },
		{ label: "Líquido", value: data.liquido }
	];

	return (
		<Box
			width="100%"
			height="100%"
			id="printablediv"
			sx={{
				padding: "20px 50px"
			}}
		>
			<Box
				display="flex"
				justifyContent="start"
				sx={{
					width: "100%",
					height: "100px"
				}}
			>
				<img src={Logo} alt="logo" />
			</Box>

			{["TICKET DE REQUISIÇÃO", " LAGOA DA CONFUSÃO-TO/UBS SEMENTE "].map(
				(data, i) => {
					return (
						<Box key={i}>
							<Typography
								variant="h6"
								color={colors.primary[700]}
								fontWeight="bold"
								sx={{
									padding: "10px 0"
								}}
							>
								{data}
							</Typography>
						</Box>
					);
				}
			)}
			<Box
				width="100%"
				display="flex"
				justifyContent="space-around"
				alignItems="center"
				sx={{
					border: "1px solid black",
					padding: "4px"
					// backgroundColor: "red"
				}}
			>
				<Box width="50%">
					{dictData.map((data, i) => {
						return (
							<Box
								display="flex"
								width="100%"
								key={i}
								sx={{ borderBottom: "1px dotted black" }}
							>
								<Box width="30%">
									<Typography
										variant="h6"
										color={colors.primary[700]}
										fontWeight="bold"
									>
										{data.label}:
									</Typography>
								</Box>
								<Box width="50%">
									<Typography
										variant="h6"
										color={colors.primary[700]}
										fontWeight="bold"
									>
										{data.value}
									</Typography>
								</Box>
							</Box>
						);
					})}
				</Box>
				<Box width="50%">
					{dictDataR.map((data, i) => {
						return (
							<Box
								display="flex"
								width="100%"
								key={i}
								sx={{ borderBottom: "1px dotted black" }}
							>
								<Box
									width="50%"
									sx={{ borderLeft: "1px dotted black" }}
								>
									<Typography
										variant="h6"
										color={colors.primary[700]}
										fontWeight="bold"
										ml="10px"
									>
										{data.label}:
									</Typography>
								</Box>
								<Box
									width="50%"
									sx={
										{
											// backgroundColor: "red"
										}
									}
								>
									<Typography
										variant="h6"
										color={colors.primary[700]}
										fontWeight="bold"
									>
										{Number(data?.value)?.toLocaleString(
											"pt-BR"
										) + " Kg"}
									</Typography>
								</Box>
							</Box>
						);
					})}
				</Box>
			</Box>
			<Box
				mt="80px"
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				sx={{
					width: "100%"
				}}
			>
				<Box
					display="flex"
					justifyContent="center"
					flexDirection="column"
					sx={{
						width: "40%",
						alignItems: "center"
					}}
				>
					<Box
						sx={{
							backgroundColor: colors.primary[900],
							width: "100%",
							height: "1px"
						}}
					/>
					<Box
						display="flex"
						justifyContent="center"
						sx={{
							width: "100%"
						}}
					>
						<Typography
							variant="h6"
							color={colors.grey[800]}
							fontWeight="bold"
						>
							{data.user}
						</Typography>
					</Box>
				</Box>
				<Box
					display="flex"
					justifyContent="center"
					flexDirection="column"
					sx={{
						width: "40%",
						alignItems: "center"
					}}
				>
					<Box
						sx={{
							backgroundColor: colors.primary[900],
							width: "100%",
							height: "1px"
						}}
					/>
					<Box
						display="flex"
						justifyContent="center"
						sx={{
							width: "100%"
						}}
					>
						<Typography
							variant="h6"
							color={colors.grey[800]}
							fontWeight="bold"
						>
							{data.motorista}
						</Typography>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default PageData;
