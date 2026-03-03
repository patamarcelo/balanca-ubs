import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Logo from "../../utils/assets/img/logo2.png";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import PageDataClassFlex from "./page-data-class-flex";

// Recebendo a prop 'via' para identificar de quem é a cópia
const PageData = ({ data, via }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const user = useSelector(selectCurrentUser);

	const capitalizeWords = (str) => {
		if (!str || str === " - ") return str;
		return String(str)
			.toLowerCase()
			.replace(/\b\w/g, (s) => s.toUpperCase());
	};

	const pad2 = (n) => String(n).padStart(2, "0");

	const isFirestoreTimestamp = (v) =>
		v && typeof v === "object" &&
		typeof v.seconds === "number" &&
		typeof v.nanoseconds === "number";

	const parseBrDateTimeStr = (s) => {
		const m = String(s).trim().match(
			/^(\d{2})\/(\d{2})\/(\d{4})\s*(?:-|–)?\s*(\d{2}):(\d{2})$/
		);
		if (!m) return null;
		const [, dd, MM, yyyy, HH, mm] = m.map(Number);
		return new Date(yyyy, MM - 1, dd, HH, mm, 0, 0);
	};

	const toDate = (v) => {
		if (!v && v !== 0) return null;
		if (v instanceof Date && !isNaN(v.getTime())) return v;
		if (isFirestoreTimestamp(v)) {
			return new Date(v.seconds * 1000 + Math.floor(v.nanoseconds / 1e6));
		}
		if (typeof v === "number" || (typeof v === "string" && /^\d+$/.test(v.trim()))) {
			const num = typeof v === "number" ? v : Number(v.trim());
			const ms = num < 1e12 ? num * 1000 : num;
			const d = new Date(ms);
			return isNaN(d.getTime()) ? null : d;
		}
		if (typeof v === "string") {
			const s = v.trim();
			if (!s || s === "-") return null;
			const br = parseBrDateTimeStr(s);
			if (br) return br;
			const d = new Date(s);
			return isNaN(d.getTime()) ? null : d;
		}
		return null;
	};

	const formatDateTime = (v) => {
		const d = toDate(v);
		if (!d) return " - ";
		const dia = pad2(d.getDate());
		const mes = pad2(d.getMonth() + 1);
		const ano = d.getFullYear();
		const hh = pad2(d.getHours());
		const mm = pad2(d.getMinutes());
		return `${dia}/${mes}/${ano} - ${hh}:${mm}`;
	};

	const fmtText = (v) => (v === null || v === undefined || v === "" ? " - " : String(v));

	const fmtKg = (v) => {
		const n = Number(v);
		if (!isFinite(n)) return " - ";
		return n.toLocaleString("pt-BR") + " Kg";
	};

	const formatPlate = (placa) => {
		return (
			placa?.toUpperCase().slice(0, 3) +
			"-" +
			placa?.toUpperCase().slice(-4)
		);
	};

	const handleExistData = (data) => {
		if (data) return data;
		return " - ";
	};

	const dictData = [
		{ label: "Placa", value: formatPlate(data?.placa) },
		{ label: "Motorista", value: fmtText(data?.motorista) },
		{ label: "Cultura", value: capitalizeWords(fmtText(data?.cultura)) },
	];

	const dictDataR = [
		{ label: "Peso Bruto", value: fmtKg(data?.pesoBruto) },
		{ label: "Tara Veículo", value: fmtKg(data?.tara) },
		{ label: "Peso Líquido", value: fmtKg(data?.liquido) },
	];

	const DataDict = [
		{ label: "Entrada", value: formatDateTime(data?.entrada) },
		{ label: "Saída", value: formatDateTime(data?.saida) },
	];

	return (
		<Box
			height="100%"
			sx={{
				padding: "20px 50px",
				width: "100% !important",
				alignItems: 'center',
				border: "1px solid #e0e0e0",
				borderRadius: '8px'
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
						`LAGOA DA CONFUSÃO-TO / ${data?.unidadeOp ? data.unidadeOp.toUpperCase() : ""}`
					].map((item, i) => {
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
									{item}
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
					{DataDict.map((item, i) => {
						return (
							<Box key={i} display="flex">
								<Typography
									color={colors.primary[700]}
									fontWeight="bold"
									sx={{
										padding: i === 1 ? "0px 0px 0px 0px" : "7px 0px 0px 0px",
										fontSize: "12px",
										marginBottom: i === 1 ? "15px" : "",
										width: "60px",
										textAlign: "end",
										marginRight: "5px"
									}}
								>
									{item.label}:
								</Typography>
								<Typography
									color={colors.primary[700]}
									sx={{
										padding: i === 1 ? "0px 0px 0px 0px" : "7px 0px 0px 0px",
										fontSize: "12px",
										marginBottom: i === 1 ? "15px" : "",
										marginLeft: "5px"
									}}
								>
									{item.value}
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
				}}
			>
				<Box width="50%">
					{dictData.map((item, i) => {
						return (
							<Box
								display="flex"
								width="100%"
								key={i}
								sx={{
									borderBottom: i === 2 ? "" : "1px dotted black"
								}}
							>
								<Box width="30%">
									<Typography
										variant="h6"
										color={colors.primary[700]}
										fontWeight="bold"
									>
										{item.label}:
									</Typography>
								</Box>
								<Box
									width="50%"
									display="flex"
									justifyContent="center"
									sx={{ marginRight: "30%" }}
								>
									<Typography
										variant="h6"
										color={colors.primary[700]}
										style={{ whiteSpace: "nowrap" }}
									>
										{item.value}
									</Typography>
								</Box>
							</Box>
						);
					})}
				</Box>
				<Box width="50%">
					{dictDataR.map((item, i) => {
						return (
							<Box
								display="flex"
								width="100%"
								key={i}
								sx={{
									borderBottom: i === 2 ? "" : "1px dotted black"
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
										{item.label}:
									</Typography>
								</Box>
								<Box
									width="50%"
									display="flex"
									justifyContent="end"
									sx={{ marginRight: "30%" }}
								>
									<Typography
										variant="h6"
										color={colors.primary[700]}
										style={{ textAlign: "right" }}
									>
										{item.value}
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
				sx={{ width: "100%" }}
			>
				<Box
					display="flex"
					justifyContent="center"
					flexDirection="column"
					sx={{ width: "40%", alignItems: "center" }}
				>
					<Box
						display="flex"
						justifyContent="center"
						sx={{ width: "100%", borderTop: "1px solid black" }}
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
					sx={{ width: "40%", alignItems: "center" }}
				>
					<Box
						display="flex"
						justifyContent="center"
						sx={{ width: "100%", borderTop: "1px solid black" }}
					>
						<Typography
							variant="h6"
							color={colors.grey[800]}
							fontWeight="bold"
						>
							{capitalizeWords(
								handleExistData(data?.motorista) !== " - "
									? data.motorista
									: "Motorista"
							)}
						</Typography>
					</Box>
				</Box>
			</Box>
			<Box display="flex" flexDirection="column" width="100%" mt="20px">
				<Typography
					variant="h6"
					color={colors.grey[800]}
					fontWeight="bold"
					style={{ textDecoration: "underline", marginBottom: "10px" }}
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
							{data?.relatorioColheita && <b>Relatório Colheita: </b>}
							{data?.relatorioColheita && data?.relatorioColheita}
							{data?.relatorioColheita && <br />}
						</div>
						<div>
							{data?.parcela && <b>Parcela: </b>}
							{data?.parcela && data?.parcela}
							{data?.parcela && <br />}
						</div>
						<div>
							{data?.parcelasNovas && data.parcelasNovas.length > 1 && <b>Parcelas: </b>}
							{data?.parcelasNovas && data.parcelasNovas.length === 1 && <b>Parcela: </b>}
							{data?.parcelasNovas && data?.parcelasNovas.toString().replaceAll(",", " , ")}
							{data?.parcelasNovas && <br />}
						</div>
						<div>
							{data?.valorFrete && <b>Valor do Frete: </b>}
							{data?.valorFrete &&
								"R$ " +
								parseFloat(data.valorFrete)
									.toFixed(2)
									.replace(".", ",")
									.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
							{data?.valorFrete && <br />}
						</div>
						<div>
							{data?.observacoes && <b>Observações: </b>}
							{data?.observacoes && data.observacoes}
						</div>
					</Typography>
				</Box>

				{/* Rodapé com a indicação da via e ID */}
				<Box display="flex" justifyContent="space-between" width="100%">
					<Typography
						color={colors.grey[600]}
						sx={{ fontSize: "0.75rem", fontWeight: "bold" }}
					>
						{via && via}
					</Typography>
					<Typography
						color={colors.grey[500]}
						sx={{ fontSize: "0.7rem" }}
					>
						{data.id}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default PageData;