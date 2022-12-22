import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Logo from "../../utils/assets/img/logo.jpg";
import { useSelector } from "react-redux";
import {
	selectCurrentUser,
} from "../../store/user/user.selector";
import  PageDataClass  from './page-data-class'

const PageData = ({ data }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const user = useSelector(selectCurrentUser);


	console.log("obs: ", data.observacoes);
	const formatPlate = (placa) => {
		return (
			placa?.toUpperCase().slice(0, 3) +
			"-" +
			placa?.toUpperCase().slice(-4)
		);
	};

	const dictData = [
		{ label: "Data", value: data.entrada },
		{ label: "Cultura", value: data.cultura },
		{ label: "Placa", value: formatPlate(data.placa) }
	];
	const dictDataR = [
		{ label: "Peso Bruto", value: data.pesoBruto },
		{ label: "Tara Veículo", value: data.tara },
		{ label: "Peso Líquido", value: data.liquido }
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
									padding: "3px 0",
									marginBottom: i === 1 ? '15px' : ''
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
								sx={{
									borderBottom:
										i === 2 ? "" : "1px dotted black"
								}}
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
								<Box
									width="50%"
									display="flex"
									justifyContent="center"
									sx={{
										// backgroundColor: "red",
										marginRight: "30%"
									}}
								>
									<Typography
										variant="h6"
										color={colors.primary[700]}
										// fontWeight="bold"
										style={{
											textTransform: data.label === 'Cultura' ? 'capitalize' : '',
											whiteSpace: 'nowrap'
										}}
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
								sx={{
									borderBottom:
										i === 2 ? "" : "1px dotted black"
								}}
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
										style={{whiteSpace: 'nowrap'}}
									>
										{data.label}:
									</Typography>
								</Box>
								<Box
									width="50%"
									display="flex"
									justifyContent="end"
									sx={{
										// backgroundColor: "red",
										marginRight: "30%"
									}}
								>
									<Typography
										variant="h6"
										color={colors.primary[700]}
										// fontWeight="bold"
										style={{ textAlign: "right" }}
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
				mt="50px"
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
							{user?.displayName}
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
							{data.motorista ? data.motorista : "Motorista"}
						</Typography>
					</Box>
				</Box>
			</Box>
			<Box display="flex" flexDirection="column" width="100%" mt="20px">
				<Typography
					variant="h6"
					color={colors.grey[800]}
					fontWeight="bold"
					style={{ textDecoration: "underline" , marginBottom: '10px'}}
				>
					Observações:
				</Typography>
				<PageDataClass data={data} />
				<Box
					display="flex"
					justifyContent="start"
					alignItems="start"
					sx={{
						border: "1px dotted black",
						minHeight: "70px",
						padding: "10px",
						marginBottom: "20px",
						marginTop: "20px",
						whiteSpace: "normal",
						overflow: "hidden",
						wordBreak: 'break-word'
					}}
				>
					<Typography variant="h6" color={colors.grey[800]}>
						{data.observacoes}
					</Typography>
				</Box>
			</Box>
			
		</Box>
	);
};

export default PageData;