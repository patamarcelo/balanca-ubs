import Table from "react-bootstrap/Table";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { useSelector } from "react-redux";
import { selecCalendarArray } from "../../../store/plantio/plantio.selector";
import { useState, useEffect } from "react";
import styles from "./plantio-done-page.module.css";

const MONTHS = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro"
];

const COLORS_TABLE = {
	Caupi: "rgb(119,63,27, 0.3)",
	"de Ouro": "rgb(119,63,27, 0.4)",
	"Mungo Verde": "rgb(119,63,27, 0.5)",
	Soja: "rgb(51,205,50, 0.5)",
	Arroz: "rgb(251,192,115, 0.5)"
};
const CalendarDonePage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const calendarDone = useSelector(selecCalendarArray);

	return (
		<Box
			mt={4}
			mb={4}
			sx={{
				width: "100%",
				overflow: "auto"
				// backgroundColor: "white"
			}}
		>
			<Table
				striped
				// bordered
				hover
				variant="dark"
				className={styles.calendarTable}
			>
				<thead>
					<tr>
						<th className={styles.projetoTile}>Projeto</th>
						{calendarDone.headerTable.map((data, i) => {
							return (
								<th
									key={i}
									style={{
										backgroundColor:
											COLORS_TABLE[data.cultura]
									}}
								>
									<p style={{ marginBottom: 0 }}>
										{data.cultura}
									</p>
									<p style={{ marginTop: 2 }}>
										{MONTHS[data.month - 1]}
									</p>
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{calendarDone.farms.map((data, i) => {
						const farmFilt = data;
						return (
							<tr key={i}>
								<td>{data.replace("Projeto", "")}</td>
								{calendarDone.headerTable.map((header, iH) => {
									const filtCal = calendarDone.table.filter(
										(dataFilt) => {
											return (
												dataFilt.cultura ===
													header.cultura &&
												dataFilt.month ===
													header.month &&
												dataFilt.fazenda === farmFilt
											);
										}
									);
									if (filtCal.length > 0) {
										const obj = filtCal[0];
										const area = obj.area;
										const farm = obj.fazenda;
										const month = obj.month;
										const cultura = obj.cultura;
										if (
											farm === data &&
											month === header.month &&
											cultura === header.cultura
										) {
											return (
												<td
													key={iH}
													style={{
														backgroundColor:
															COLORS_TABLE[
																cultura
															]
													}}
												>
													{area?.toLocaleString(
														"pt-br",
														{
															minimumFractionDigits: 2,
															maximumFractionDigits: 2
														}
													)}
												</td>
											);
										}
										return (
											<td
												key={iH}
												style={{
													backgroundColor:
														COLORS_TABLE[cultura]
												}}
											>
												-
											</td>
										);
									} else {
										return (
											<td
												key={iH}
												style={{
													backgroundColor:
														COLORS_TABLE[
															header.cultura
														]
												}}
											>
												-
											</td>
										);
									}
								})}
							</tr>
						);
					})}
				</tbody>
				<tfoot>
					<tr>
						<td>Totais</td>
						{calendarDone.headerTable.map((data, i) => {
							console.log(data.cultura);
							return (
								<td
									key={i}
									style={{
										backgroundColor:
											COLORS_TABLE[data.cultura]
									}}
								>
									{data.area.toLocaleString("pt-br", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									})}
								</td>
							);
						})}
					</tr>
				</tfoot>
			</Table>
		</Box>
	);
};

export default CalendarDonePage;