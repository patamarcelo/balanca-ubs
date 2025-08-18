import { Typography, Box, TextField } from "@mui/material";
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
	const { selectedProject, filtCult, resumo, sumTotalSelected, showTableList, setShowTableList, setOperationName, operationName } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [showProdTable, setShowProdTable] = useState(false);

	const iconDict = [
		{ cultura: "Feijão", icon: beans, alt: "feijao" },
		{ cultura: "Arroz", icon: rice, alt: "arroz" },
		{ cultura: "Soja", icon: soy, alt: "soja" }
	];
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
			<Collapse orientation="horizontal" in={showProdTable}>
					<TextField
						label="Nome da operação"
						size="small"
						value={operationName}
						onChange={(e) => setOperationName(e.target.value)}
						width={"500px"}
					/>
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
