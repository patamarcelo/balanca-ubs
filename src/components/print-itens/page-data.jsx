import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Logo from "../../utils/assets/img/logo.jpg";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import PageDataClassFlex from "./page-data-class-flex";

const PageData = ({ printValue }) => {
	const data = printValue[0];
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const user = useSelector(selectCurrentUser);

	const formatPlate = (placa) => {
		return (
			placa?.toUpperCase().slice(0, 3) +
			"-" +
			placa?.toUpperCase().slice(-4)
		);
	};

	console.log(data.parcelasNovas)
	console.log(typeof data.parcelasNovas)

	const dictData = [
		{ label: "Placa", value: formatPlate(data?.placa) },
		{
			label: "Motorista",
			value: data?.motorista ? data.motorista : " - "
		},
		{ label: "Cultura", value: data?.cultura }
	];
	const dictDataR = [
		{ label: "Peso Bruto", value: data?.pesoBruto },
		{ label: "Tara Veículo", value: data?.tara },
		{ label: "Peso Líquido", value: data?.liquido }
	];

	const DataDict = [
		{ label: "Entrada", value: data?.entrada },
		{ label: "Saída", value: data?.saida ? data.saida : " - " }
	];

	return (
		<Box
			height="100%"
			sx={{
				padding: "20px 50px",
				width: "100% !important"
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
			<Box
				display="flex"
				justifyContent="space-between"
				sx={{ width: "100%" }}
			>
				<Box>
					{[
						"TICKET DE REQUISIÇÃO",
						`LAGOA DA CONFUSÃO-TO / ${
							data?.unidadeOp ? data.unidadeOp.toUpperCase() : ""
						}`
					].map((data, i) => {
						return (
							<Box key={i}>
								<Typography
									variant="h6"
									color={colors.primary[700]}
									fontWeight="bold"
									sx={{
										padding: "3px 0",
										marginBottom: i === 1 ? "15px" : ""
									}}
								>
									{data}
								</Typography>
							</Box>
						);
					})}
				</Box>
				<Box
					display="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
				>
					{DataDict.map((data, i) => {
						return (
							<Box key={i} display="flex">
								<Typography
									color={colors.primary[700]}
									fontWeight="bold"
									sx={{
										padding:
											i === 1
												? "0px 0px 0px 0px"
												: "7px 0px 0px 0px",
										fontSize: "12px",
										marginBottom: i === 1 ? "15px" : "",
										width: "60px",
										textAlign: "end",
										marginRight: "5px"
									}}
								>
									{data.label}:
								</Typography>
								<Typography
									color={colors.primary[700]}
									sx={{
										padding:
											i === 1
												? "0px 0px 0px 0px"
												: "7px 0px 0px 0px",
										fontSize: "12px",
										marginBottom: i === 1 ? "15px" : "",
										marginLeft: "5px"
									}}
								>
									{data.value}
								</Typography>
							</Box>
						);
					})}
				</Box>
			</Box>
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
											textTransform:
												data.label === "Cultura"
													? "capitalize"
													: "",
											whiteSpace: "nowrap"
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
										style={{ whiteSpace: "nowrap" }}
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
						display="flex"
						justifyContent="center"
						sx={{
							width: "100%",
							borderTop: "1px solid black"
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
						display="flex"
						justifyContent="center"
						sx={{
							width: "100%",
							borderTop: "1px solid black"
						}}
					>
						<Typography
							variant="h6"
							color={colors.grey[800]}
							fontWeight="bold"
							sx={{
								textTransform: "capitalize"
							}}
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
					style={{
						textDecoration: "underline",
						marginBottom: "10px"
					}}
				>
					Observações:
				</Typography>
				<PageDataClassFlex data={data} />
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
						wordBreak: "break-word"
					}}
				>
					<Typography variant="h6" color={colors.grey[800]}>
						{data?.relatorioColheita && <b>Relatório Colheita: </b>}
						{data?.relatorioColheita && data?.relatorioColheita}
						{data?.relatorioColheita && <br />}

						{data?.parcela && <b>Parcela: </b>}
						{data?.parcela && data?.parcela}
						{data?.parcela && <br />}
						
						{data?.parcelasNovas && data.parcelasNovas.length > 1 && <b>Parcelas: </b>}
						{data?.parcelasNovas && data.parcelasNovas.length === 1 && <b>Parcela: </b>}
						{data?.parcelasNovas && data?.parcelasNovas.toString().replaceAll(",", " , ")}
						{data?.parcelasNovas && <br />}

						{data?.observacoes}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default PageData;
