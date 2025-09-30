import { Box, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableFooter } from "@mui/material";
import styles from "./produtividade.module.css";
import { useEffect, useState } from "react";
import { useMemo } from "react";

import { IconButton, Menu, MenuItem } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check"; // ícone pronto do MUI
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import DoneAllIcon from '@mui/icons-material/DoneAll';



const colorOptions = [
	"#FFF",       // crucial (sem cor)
	"#8B5A2B",    // marrom feijão (terra/leguminosas)
	"#FFD700",    // amarelo soja (grão maduro)
	"#228B22",    // verde floresta (milho/folhagem)
	"#00FF00",
	"#BDB76B",    // cáqui (folha seca)
	"#0000FF",
	"#FFFF00",
];

const lightTableColors = {
	containerBg: "#FAFAFA",       // Fundo da tabela
	headerBg: "#333333",          // Fundo do cabeçalho
	headerText: "#F0F0F0",        // Texto do cabeçalho
	rowText: "#444444",           // Texto das linhas
	zebraRowBg: "#FFFFFF",        // Line background (even)
	zebraAltRowBg: "#F7F7F7"      // Line background (odd)
};

const margintR = 2
const ListPrintPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const {
		filteredArray,
		resumo,
		filtPlantioDone,
		parcelasSelected,
		setParcelasSeleced,
		useRealArray,
		setUseRealArray
	} = props;

	const [totalArea, setTotalArea] = useState(0);
	const [totalAreaPlantada, setTotalAreaPlantada] = useState(0);
	const [areaSemPlantio, setAreaSemPlantio] = useState(0);


	const [anchorEl, setAnchorEl] = useState(null);
	const [targetRowId, setTargetRowId] = useState(null);
	const open = Boolean(anchorEl);
	const [showColors, setShowColors] = useState(false);

	const [sort, setSort] = useState({ by: null, dir: "asc" }); // by: 'parcela' | 'variedade' | null

	const resetSort = () => setSort({ by: null, dir: "asc" });

	const toggleSort = (by) => {
		setSort((prev) =>
			prev.by === by ? { by, dir: prev.dir === "asc" ? "desc" : "asc" } : { by, dir: "asc" }
		);
	};

	const getArrow = (by) => {
		if (!sort.by) {
			// estado "resetado" → check no header clicado
			return <CheckIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: "middle" }} />;
		}
		if (sort.by !== by) return "";
		return sort.dir === "asc" ? " ↑" : " ↓";
	};

	// rows computadas (ordenadas ou não)
	const displayedRows = useMemo(() => {
		if (!sort.by) return useRealArray; // mantém ordem de inserção
		const rows = [...useRealArray];
		const collator = new Intl.Collator("pt-BR", { sensitivity: "base", numeric: true });

		const pick = (row) => {
			console.log('rowHere: ', row)
			if (sort.by === "parcela") return row.talhao__id_talhao ?? "";
			if (sort.by === "variedade") return row.variedade__nome_fantasia ?? "";
			return "";
		};

		rows.sort((a, b) => {
			const va = pick(a), vb = pick(b);
			const r = collator.compare(String(va), String(vb));
			return sort.dir === "asc" ? r : -r;
		});

		return rows;
	}, [useRealArray, sort]);

	useEffect(() => {
		if (parcelasSelected?.length > 0) {
			// 1) Monte a lista na MESMA ORDEM em que o usuário selecionou
			const onlySelected = parcelasSelected
				.map((id) => filteredArray.find((d) => String(d.id_farmbox) === String(id)))
				.filter(Boolean);

			setUseRealArray((prev) => {
				// 2) Preserve dados já definidos (ex: variedadeColor) sem perder a ordem de seleção
				const prevById = new Map(prev.map((it) => [String(it.id_farmbox), it]));
				const merged = onlySelected.map((it) => {
					const old = prevById.get(String(it.id_farmbox));
					return old ? { ...it, ...old } : it;
				});
				return merged;
			});

			setShowColors(true);
		} else {
			setUseRealArray(filteredArray.sort((a,b) => a.talhao__id_talhao.localeCompare(b.talhao__id_talhao)));
			setShowColors(false);
		}
	}, [parcelasSelected, filteredArray]);

	useEffect(() => {
		const newTotal = useRealArray.reduce(
			(acc, curr) => (acc += curr.area_colheita),
			0
		);
		setTotalArea(newTotal);
	}, [useRealArray]);

	useEffect(() => {
		let totalResumo = 0;
		Object.keys(resumo).forEach((data) => {
			totalResumo += resumo[data].area;
		});
		setTotalAreaPlantada(totalResumo);
	}, [resumo]);

	useEffect(() => {
		setAreaSemPlantio(totalArea?.toFixed(0) - totalAreaPlantada?.toFixed(0));
	}, [totalArea, totalAreaPlantada]);

	const handlePaletteClick = (event, rowId) => {
		setAnchorEl(event.currentTarget);
		setTargetRowId(rowId);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setTargetRowId(null);
	};

	const handleColorChange = (rowId, newColor) => {
		if (newColor === '#FFF') {
			setUseRealArray((prev) =>
				prev.map((item) =>
					item.id === rowId ? { ...item, variedadeColor: '' } : item
				)
			);
		} else {
			setUseRealArray((prev) =>
				prev.map((item) =>
					item.id === rowId ? { ...item, variedadeColor: newColor } : item
				)
			);
		}
		handleClose();
	};

	return (
		<Box>
			<TableContainer
				component={Paper}
				sx={{ backgroundColor: lightTableColors.containerBg, maxHeight: '90vh' }}
			>
				<Table aria-label="simple table" stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell
								sx={{ color: lightTableColors.headerText + '!important', fontWeight: 'bold', position: 'sticky', top: 0, zIndex: 10, backgroundColor: lightTableColors.headerBg, cursor: 'pointer' }}
								align="left"
								onClick={() => toggleSort("parcela")}
								onDoubleClick={resetSort}
							>
								<Box ml={margintR}>Parcela{getArrow("parcela")}</Box>
							</TableCell>

							<TableCell
								sx={{ color: lightTableColors.headerText + '!important', fontWeight: 'bold', position: 'sticky', top: 0, zIndex: 10, backgroundColor: lightTableColors.headerBg }}
								align="right"
							>
								<Box mr={margintR}>Área</Box>
							</TableCell>

							<TableCell
								sx={{ color: lightTableColors.headerText + '!important', fontWeight: 'bold', position: 'sticky', top: 0, zIndex: 10, backgroundColor: lightTableColors.headerBg, cursor: 'pointer' }}
								align="right"
								onClick={() => toggleSort("variedade")}
							>
								<Box mr={margintR}>Variedade{getArrow("variedade")}</Box>
							</TableCell>

							{showColors && (
								<TableCell
									sx={{ color: lightTableColors.headerText + '!important', fontWeight: 'bold', position: 'sticky', top: 0, zIndex: 10, backgroundColor: lightTableColors.headerBg }}
									align="center"
								>
									Cor
								</TableCell>
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{displayedRows
							// .sort((a, b) =>
							// 	a.talhao__id_talhao.localeCompare(b.talhao__id_talhao)
							// )
							// .filter((data) =>
							// 	filtPlantioDone === false
							// 		? data.finalizado_plantio === true
							// 		: true
							// )
							.map((row, i) => (
								<TableRow
									key={row.id}
									sx={{
										backgroundColor:
											i % 2 === 0
												? lightTableColors.zebraRowBg
												: lightTableColors.zebraAltRowBg,
										"& .MuiTableCell-root": {
											borderBottom: "1px solid rgba(0,0,0,0.2)"
										},
										"&:hover": {
											backgroundColor: "rgba(100, 100, 100, 0.8)", // use alpha menor para hover suave
											"& .MuiTableCell-root": {
												color: "whitesmoke" // aplica diretamente nas células
											}
										},
									}}
								>
									<TableCell sx={{ color: lightTableColors.rowText }} align="left">
										<Box ml={0} display="flex" alignItems="center" gap={1}>
											

											{/* STATUS */}
											{row.finalizado_plantio && !row.finalizado_colheita && (
												<Box display="flex" alignItems="center" ml={1}>
													<DoneIcon fontSize="small" sx={{ color: "green" }} />
												</Box>
											)}

											{row.finalizado_plantio && row.finalizado_colheita && (
												<Box display="flex" alignItems="center" ml={1}>
													<DoneAllIcon fontSize="small" sx={{ color: "green" }} />
												</Box>
											)}

											{!row.finalizado_plantio && !row.finalizado_colheita && (
												<CloseIcon fontSize="small" sx={{ color: "red", ml: 1 }} />
											)}

											{row.talhao__id_talhao}
										</Box>
									</TableCell>
									<TableCell sx={{ color: lightTableColors.rowText }} align="right">
										<Box mr={margintR}>

											{row.area_colheita.toLocaleString("pt-br", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</Box>
									</TableCell>
									<TableCell sx={{ color: lightTableColors.rowText }} align="right">
										<Box mr={margintR}>
											{row.variedade__nome_fantasia}
										</Box>
									</TableCell>
									{
										showColors &&
										<TableCell sx={{ color: lightTableColors.rowText }} align="center">
											<IconButton
												size="small"
												onClick={(e) => handlePaletteClick(e, row.id)}
											>
												<Box
													sx={{
														width: 20,
														height: 20,
														borderRadius: "50%",
														backgroundColor: row.variedadeColor,
														border: "1px solid #ccc",
													}}
												/>
											</IconButton>
										</TableCell>
									}
								</TableRow>
							))}
					</TableBody>

					{/* --- FOOTER --- */}
					<TableFooter>
						<TableRow>
							<TableCell align="left" colSpan={2} sx={{ color: lightTableColors.rowText, fontWeight: 'bold' }}>
								<Box ml={4}>Área Total</Box>
							</TableCell>
							<TableCell sx={{ color: lightTableColors.rowText, fontWeight: 'bold' }} align="right">
								<Box mr={margintR}>

									{totalArea.toLocaleString("pt-br", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</Box>
							</TableCell>
						</TableRow>
						{
							areaSemPlantio > 0 &&
							<TableRow>
								<TableCell align="left" sx={{ color: lightTableColors.rowText, fontWeight: 'bold' }} colSpan={2}>
									<Box ml={4}>
										-
									</Box>
								</TableCell>
								<TableCell sx={{ color: lightTableColors.rowText, fontWeight: 'bold' }} align="right">
									<Box mr={margintR}>
										{areaSemPlantio.toLocaleString("pt-br", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</Box>
								</TableCell>
							</TableRow>
						}
						{resumo &&
							Object.keys(resumo).map((data, i) => (
								<TableRow key={i}>
									<TableCell align="left" colSpan={2} sx={{ color: lightTableColors.rowText, fontWeight: 'bold' }}>
										<Box ml={4}>{data.split("|")[1] === 'null' ? "N/D" : data.split("|")[1]}</Box>
									</TableCell>
									<TableCell sx={{ color: lightTableColors.rowText, fontWeight: 'bold' }} align="right">
										<Box mr={margintR}>
											{resumo[data].area.toLocaleString("pt-br", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</Box>
									</TableCell>
								</TableRow>
							))}
					</TableFooter>
				</Table>

				{/* ----- COLOR MENU ----- */}
				<Menu
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
				>
					{colorOptions.map((color) => (
						<MenuItem
							key={color}
							onClick={() => handleColorChange(targetRowId, color)}
						>
							<Box
								sx={{
									width: 20,
									height: 20,
									backgroundColor: color,
									borderRadius: "50%",
								}}
							/>
						</MenuItem>
					))}
				</Menu>
			</TableContainer>
		</Box>
	);
};

export default ListPrintPage;
