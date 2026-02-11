import React, { useMemo } from "react";
import { Box, Divider, Typography, Chip } from "@mui/material";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";
import question from "../../../utils/assets/icons/question.png";

const rgbaFromRgb = (rgb, alpha = 0.28) => {
	const s = String(rgb || "").trim();
	const m = s.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
	if (!m) return `rgba(255,255,255,${alpha})`;
	return `rgba(${m[1]},${m[2]},${m[3]},${alpha})`;
};

const normTxt = (v) =>
	(v ?? "")
		.toString()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.trim();

const fmtInt = (n) =>
	Number(n || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const MiniMetric = ({ label, value, themeRgb }) => {
	const border = rgbaFromRgb(themeRgb, 0.28);
	const bg = "rgba(255,255,255,0.06)";

	return (
		<Box
			sx={{
				flex: 1,
				minWidth: 0,
				px: 1,
				py: 0.65,
				borderRadius: 1.6,
				border: `1px solid ${border}`,
				background: bg,
				display: "flex",
				alignItems: "baseline",
				justifyContent: "space-between",
				gap: 1,
			}}
		>
			<Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 900, color: "rgba(245,245,245,0.85)" }}>
				{label}
			</Typography>
			<Typography variant="body2" sx={{ fontWeight: 950, color: "whitesmoke", whiteSpace: "nowrap" }}>
				{fmtInt(value)}
			</Typography>
		</Box>
	);
};

const ResumoFazendasPage = (props) => {
	const {
		fazenda,
		colors,
		divider,
		dataGeral,
		// mantidos por compatibilidade
		filterPreaproSolo,
		operationFilter,
		showFutureApps,
		daysFilter,
	} = props;

	const fazPlan = dataGeral?.fazendas?.[fazenda];

	const iconDict = useMemo(
		() => [
			{ cultura: "Soja", icon: soy, alt: "soja", color: "rgb(69,133,255)" },
			{ cultura: "Feijão", icon: beans, alt: "feijao", color: "rgb(238,165,56)" },
			{ cultura: "Arroz", icon: rice, alt: "arroz", color: "rgb(76,180,211)" },
			{ cultura: "SemCultura", icon: question, alt: "?", color: "rgb(166,166,166)" },
		],
		[]
	);

	const fazendaLabel = useMemo(() => {
		const s = String(fazenda || "");
		if (!s) return "—";
		if (s.toLowerCase().includes("fazenda")) return s.split("Fazenda")[1]?.trim() || s;
		return s;
	}, [fazenda]);

	const culturas = useMemo(() => {
		if (!fazPlan) return [];
		return iconDict
			.filter((c) => fazPlan?.[c.cultura] !== undefined)
			.map((c) => ({
				...c,
				ha: fazPlan?.[c.cultura] ?? 0,
			}))
			.sort((a, b) => normTxt(a.cultura).localeCompare(normTxt(b.cultura), "pt-BR"));
	}, [fazPlan, iconDict]);

	const themeRgb = culturas[0]?.color || "rgb(166,166,166)";
	const borderColor = rgbaFromRgb(themeRgb, 0.55);
	const shadowColor = rgbaFromRgb(themeRgb, 0.06);

	const saldoTotal = fazPlan?.saldo ?? 0;

	return (
		<Box sx={{ width: "100%" }}>
			<Box
				sx={{
					borderRadius: 2,
					overflow: "hidden",
					background: colors?.blueOrigin?.[700] || "rgba(255,255,255,0.06)",
					border: `1px solid ${borderColor}`,
					boxShadow: `0 0 0 1px ${shadowColor}`,
				}}
			>
				{/* HEADER CONSOLIDADO */}
				<Box
					sx={{
						px: 1.2,
						py: 0.9,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 1.2,
						background: "rgba(255,255,255,0.06)",
					}}
				>
					<Box sx={{ minWidth: 0, overflow: "hidden" }}>
						<Typography
							variant="body2"
							sx={{
								fontWeight: 950,
								color: "whitesmoke",
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis",
							}}
							title={fazenda}
						>
							<a
								href={"#" + fazenda}
								style={{
									textDecoration: "none",
									cursor: "pointer",
									color: "inherit",
								}}
							>
								{fazendaLabel}
							</a>
						</Typography>
						<Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 900, color: "rgba(245,245,245,0.78)" }}>
							Resumo por cultura
						</Typography>
					</Box>

					<Box sx={{ textAlign: "right", whiteSpace: "nowrap" }}>
						<Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 900, color: "rgba(245,245,245,0.78)" }}>
							Saldo
						</Typography>
						<Typography variant="body2" sx={{ fontWeight: 950, color: "whitesmoke", fontSize: "0.95rem" }}>
							{fmtInt(saldoTotal)} ha
						</Typography>
					</Box>
				</Box>

				{/* CORPO CONSOLIDADO */}
				{!fazPlan ? (
					<Box sx={{ px: 1.2, py: 1.1 }}>
						<Typography variant="body2" sx={{ opacity: 0.85, color: "whitesmoke" }}>
							Sem dados para esta fazenda nos filtros atuais.
						</Typography>
					</Box>
				) : (
					<Box sx={{ px: 1.1, py: 1.0, display: "flex", flexDirection: "column", gap: 0.9 }}>
						{/* LINHA DE CULTURAS: CHIPS COM ÍCONE + HA */}
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.7,
								overflowX: "auto",
								overflowY: "hidden",
								whiteSpace: "nowrap",
								WebkitOverflowScrolling: "touch",
								scrollbarWidth: "thin",
								"&::-webkit-scrollbar": { height: 6 },
								pr: 0.4,
							}}
						>
							{culturas.length === 0 ? (
								<Typography variant="body2" sx={{ opacity: 0.85, color: "whitesmoke" }}>
									Sem culturas nos filtros atuais.
								</Typography>
							) : (
								culturas.map((c) => (
									<Chip
										key={c.cultura}
										label={
											<span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
												<img
													src={c.icon}
													alt={c.alt}
													style={{
														width: 16,
														height: 16,
														objectFit: "contain",
														filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
													}}
												/>
												<span style={{ fontWeight: 950 }}>{c.cultura}</span>
												<span style={{ opacity: 0.95, fontWeight: 950 }}>{fmtInt(c.ha)} ha</span>
											</span>
										}
										size="small"
										sx={{
											height: 26,
											px: 0.4,
											borderRadius: 2,
											background: "rgba(255,255,255,0.10)",
											color: "whitesmoke",
											border: `1px solid ${rgbaFromRgb(c.color, 0.35)}`,
											boxShadow: `0 0 0 1px ${rgbaFromRgb(c.color, 0.06)}`,
											"& .MuiChip-label": { px: 0.8, fontSize: "0.76rem" },
										}}
									/>
								))
							)}
						</Box>

						{/* LINHA DE MÉTRICAS: COMPACTA */}
						<Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
							<MiniMetric label="Sólido" value={fazPlan?.saldoSolido} themeRgb={themeRgb} />
							<MiniMetric label="Líquido" value={fazPlan?.saldoLiquido} themeRgb={themeRgb} />
							<MiniMetric label="Operações" value={fazPlan?.saldoOperacao} themeRgb={themeRgb} />
						</Box>
					</Box>
				)}
			</Box>

			{divider && (
				<Box width="100%" sx={{ mt: 1.1 }}>
					<Divider />
				</Box>
			)}
		</Box>
	);
};

export default ResumoFazendasPage;
