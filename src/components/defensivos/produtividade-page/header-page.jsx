import { Typography, Box, TextField } from "@mui/material";
import { Stack, Tooltip, ButtonBase } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import styles from "./produtividade.module.css";
import ResumoPage from "./resumo-page";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";

import { useState } from "react";
import Collapse from '@mui/material/Collapse';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const HeaderPage = (props) => {
	const { selectedProject, filtCult, resumo, sumTotalSelected, showTableList, setShowTableList, setOperationName, operationName, selectedColor, setSelectedColor } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [showProdTable, setShowProdTable] = useState(false);

	const iconDict = [
		{ cultura: "Feijão", icon: beans, alt: "feijao" },
		{ cultura: "Arroz", icon: rice, alt: "arroz" },
		{ cultura: "Soja", icon: soy, alt: "soja" }
	];

	const colorOptions = [
		"#FFF",       // crucial (sem cor)
		"#C28E5C",    // marrom feijão (terra/leguminosas)
		"#FFD700",    // amarelo soja (grão maduro)
		"#228B22",    // verde floresta (milho/folhagem)
		"#00FF00",
		"#BDB76B",    // cáqui (folha seca)
		"#0000FF",
		"#FFFF00",
	];

	const colorLabels = {
		"#FFF": "Sem cor / Branco",
		"#C28E5C": "Marrom feijão",
		"#FFD700": "Amarelo soja",
		"#228B22": "Verde floresta",
		"#00FF00": "Verde",
		"#BDB76B": "Cáqui",
		"#0000FF": "Azul",
		"#FFFF00": "Amarelo",
	};

	const handleChangeProd = () => {
		setShowProdTable((prev) => !prev);
	};

	const handleChangeList = () => {
		setShowTableList((prev) => !prev);
	};

	const filteredAlt = (data) => {
		const filtered = iconDict.filter((dictD) => dictD.cultura === data);

		if (filtered.length > 0) {
			return filtered[0].alt;
		}
		return "";
	};

	const filteredIcon = (data) => {
		const filtered = iconDict.filter((dictD) => dictD.cultura === data);

		if (filtered.length > 0) {
			return filtered[0].icon;
		}
		return "";
	};


	const formatProjectName = selectedProject
		.map((data, index) => (index > 0 ? `| ${data.replace('Projeto', '')}` : data.replace('Projeto', '')))
		.join(' ');


	return (
		<div className={styles.headerPageDiv}>
			<div className={styles.headerNameDiv}>
				<Typography
					// variant="h3"
					color={
						theme.palette.mode === "dark" ? "whitesmoke" : "black"
					}
					sx={{
						fontSize: "32px",
						textAlign: "left",
						padding: "5px",
						paddingLeft: "0px",
						marginLeft: "0px",
						fontWeight: "bold",
						// marginBottom: "10px",
						width: "100%"
						// backgroundColor: "red"
					}}
					className={styles.titleProdutividade}
				>
					{formatProjectName}
					<FormControlLabel
						sx={{ marginLeft: '30px' }}
						control={<Switch checked={showProdTable} onChange={handleChangeProd} color="info" />}
					/>
					<FormControlLabel
						sx={{ marginLeft: '10px' }}
						control={<Switch checked={showTableList} onChange={handleChangeList} color="success" />}
					/>

				</Typography>
			</div>
			<Collapse orientation="horizontal" in={showProdTable} sx={{height: !showProdTable && 0}}>
				<Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '30px' }}>
				<TextField
					label="Nome da operação"
					size="small"
					value={operationName}
					onChange={(e) => setOperationName(e.target.value)}
					sx={{ width: 500 }}
				/>

				{/* Color Picker */}
				<Box sx={{ mt: 1.5}}>
					<Typography variant="caption" sx={{ color: "text.secondary" }}>
						Cor da operação
					</Typography>

					<Stack
						direction="row"
						spacing={1}
						sx={{ mt: 0.5, flexWrap: "wrap", rowGap: 1 }}
						role="radiogroup"
						aria-label="Selecionar cor"
					>
						{colorOptions.map((c) => {
							const isSelected = selectedColor === c;
							return (
								<Tooltip key={c} title={colorLabels[c] || c} arrow>
									<ButtonBase
										onClick={() => setSelectedColor(c)}
										aria-label={colorLabels[c] || c}
										aria-checked={isSelected}
										role="radio"
										focusRipple
										sx={{
											width: 28,
											height: 28,
											borderRadius: "50%",
											border: "1px solid",
											borderColor: isSelected ? "primary.main" : "divider",
											outline: isSelected ? "2px solid" : "none",
											outlineColor: isSelected ? "primary.main" : "transparent",
											transition: "outline-color 0.15s ease, border-color 0.15s ease, transform 0.05s ease",
											transform: isSelected ? "scale(1.05)" : "none",
											p: 0,
											overflow: "hidden",
										}}
									>
										{/* Disco de cor */}
										<Box
											sx={{
												width: "100%",
												height: "100%",
												bgcolor: c,
											}}
										/>

										{/* Checkerboard sutil quando a cor é #FFF para diferenciar de “sem cor/sem preenchimento” */}
										{c === "#FFF" && (
											<Box
												aria-hidden
												sx={{
													position: "absolute",
													inset: 0,
													backgroundImage:
														"linear-gradient(45deg, rgba(0,0,0,0.06) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.06) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.06) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.06) 75%)",
													backgroundSize: "8px 8px",
													backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
													borderRadius: "50%",
													mixBlendMode: "multiply",
												}}
											/>
										)}
									</ButtonBase>
								</Tooltip>
							);
						})}
					</Stack>
				</Box>
				</Box>
			</Collapse>

			<Collapse orientation="horizontal" in={showProdTable}>
				<ResumoPage
					filtCult={filtCult}
					sumTotalSelected={sumTotalSelected}
				/>
			</Collapse>

		</div >
	);
};

export default HeaderPage;
