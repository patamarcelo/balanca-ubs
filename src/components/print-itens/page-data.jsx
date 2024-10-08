import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Logo from "../../utils/assets/img/logo2.jpg";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import PageDataClassFlex from "./page-data-class-flex";
import { useEffect } from "react";

const PageData = ({ data }) => {
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

	const handleExistData = (data) => {
		if (data) {
			return data;
		}
		return " - ";
	};

	const dictData = [
		{ label: "Placa", value: formatPlate(data?.placa) },
		{
			label: "Motorista",
			value: handleExistData(data?.motorista)
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
				justifyContent="space-between"
				mt={3}
				mb={5}
				ml={-1}
				sx={{
					width: "40px",
					height: "40px"
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
				{/* <Typography
					color={colors.redAccent[900]}
					sx={{ fontSize: "10px", alignSelf: "end" }}
				>
					{data.id}
				</Typography> */}
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
							{handleExistData(data?.motorista) !== " - "
								? data.motorista
								: "Motorista"}
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
					<Typography
						color={colors.grey[800]}
						sx={{ fontSize: "11px" }}
						display="flex"
						flexDirection="column"
						justifyContent="space-between"
						gap="1px"
					>
						<div>
							{data?.relatorioColheita && (
								<b>Relatório Colheita: </b>
							)}
							{data?.relatorioColheita && data?.relatorioColheita}
							{data?.relatorioColheita && <br />}
						</div>
						<div>
							{data?.parcela && <b>Parcela: </b>}
							{data?.parcela && data?.parcela}
							{data?.parcela && <br />}
						</div>
						<div>
							{data?.parcelasNovas &&
								data.parcelasNovas.length > 1 && (
									<b>Parcelas: </b>
								)}
							{data?.parcelasNovas &&
								data.parcelasNovas.length === 1 && (
									<b>Parcela: </b>
								)}
							{data?.parcelasNovas &&
								data?.parcelasNovas
									.toString()
									.replaceAll(",", " , ")}
							{data?.parcelasNovas && <br />}
						</div>
						<div>
							{data?.valorFrete && <b>Valor do Frete: </b>}
							{data?.valorFrete &&
								"R$ " +
									parseFloat(data.valorFrete)
										.toFixed(2)
										.replace(".", ",")
										.toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL"
										})}
							{data?.valorFrete && <br />}
						</div>
						<div>
							{data?.observacoes && <b>Observações: </b>}
							{data?.observacoes && data.observacoes}
						</div>
					</Typography>
				</Box>
				<Typography
					color={colors.grey[500]}
					sx={{ fontSize: "0.7rem", alignSelf: "flex-end" }}
				>
					{data.id}
				</Typography>
			</Box>
		</Box>
	);
};

export default PageData;
