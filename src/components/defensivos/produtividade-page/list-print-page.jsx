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

const ListPrintPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const {
		filteredArray,
		setSumTotalSelected,
		totalSelected,
		setTotalSelected,
		handleSUm,
		resumo,
		filtPlantioDone
	} = props;
	const [totalArea, setTotalArea] = useState(0);
	const [totalAreaPlantada, setTotalAreaPlantada] = useState(0);
	const [areaSemPlantio, setAreaSemPlantio] = useState(0);

	useEffect(() => {
		console.log('filtered arramp: ', filteredArray)
	}, []);

	useEffect(() => {
		setTotalArea(0);
		const newArr = [...filteredArray];
		const newTotal = newArr.reduce(
			(acc, curr) => (acc += curr.area_colheita),
			0
		);
		setTotalArea(newTotal);
	}, [filteredArray]);

	useEffect(() => {
		setTotalAreaPlantada(0);
		let totalResumo = 0;
		Object.keys(resumo).forEach((data) => {
			totalResumo += resumo[data].area;
		});
		setTotalAreaPlantada(totalResumo);
	}, [resumo]);

	useEffect(() => {
		setAreaSemPlantio(totalArea - totalAreaPlantada);
	}, [totalArea, totalAreaPlantada]);

	return (
		// <Box sx={{ height: "1300px", overflow: "auto" }}>
		<Box>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="center">Parcela</TableCell>
							<TableCell align="center">Área</TableCell>
							<TableCell align="center">Variedade</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredArray
							.sort((a, b) =>
								a.talhao__id_talhao.localeCompare(
									b.talhao__id_talhao
								)
							)
							.filter((data) => {
								if (filtPlantioDone === false) {
									return data.finalizado_plantio === true;
								} else {
									return data;
								}
							})
							.map((row, i) => {
								const variedade =
									// row.finalizado_plantio &&
									row.variedade__nome_fantasia
										// ? row.variedade__nome_fantasia
										// : " - ";
								return (
									<TableRow
										className={styles.rowTableResume}
										key={i}
										// sx={{
										// 	"&:last-child td, &:last-child th": {
										// 		border: 0
										// 	}
										// }}
									>
										<TableCell align="center">
											{row.talhao__id_talhao}
										</TableCell>
										<TableCell
											component="th"
											align="center"
											scope="row"
										>
											{row.area_colheita.toLocaleString(
												"pt-br",
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2
												}
											)}
										</TableCell>

										<TableCell align="center">
											{variedade}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell align="center" colSpan={2}>
								Area Total
							</TableCell>
							<TableCell align="center">
								{totalArea.toLocaleString("pt-br", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="center" colSpan={2}>
								-
							</TableCell>
							<TableCell align="center">
								{areaSemPlantio.toLocaleString("pt-br", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}
							</TableCell>
						</TableRow>
						{resumo &&
							Object.keys(resumo).map((data, i) => {
								return (
									<TableRow key={i}>
										<TableCell align="center" colSpan={2}>
											{data.split("|")[1]}
										</TableCell>
										<TableCell align="center">
											{resumo[data].area.toLocaleString(
												"pt-br",
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2
												}
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableFooter>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default ListPrintPage;
