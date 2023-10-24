import { Box, Button, useTheme, Typography } from "@mui/material";
import { tokens } from "../../../theme";

import { FarmsFarmBoxData } from "../../../store/farmsFarmboxData";
import styles from "./farmbox.module.css";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selecPluviFormat } from "../../../store/plantio/plantio.selector";

const PluviDataComp = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [lastFiveDays, setlastFiveDays] = useState();
	const pluviData = useSelector(selecPluviFormat);

	const days = [
		"Domingo",
		"Segunda-Feira",
		"Terça-Feira",
		"Quarta-Feira",
		"Quinta-Feira",
		"Sexta-Feira",
		"Sábado"
	];

	const getLastFiveDays = () => {
		let fiveDays = [];
		const today = new Date();
		for (let i = 0; i < 5; i++) {
			const getDay = new Date(new Date().setDate(today.getDate() - i));
			const formatDay = getDay.toISOString().split("T")[0];
			const newDay = {
				date: formatDay,
				number: days[getDay.getDay()]
			};
			fiveDays.push(newDay);
		}
		return fiveDays.reverse();
	};

	useEffect(() => {
		const daysTo = getLastFiveDays();
		setlastFiveDays(daysTo);
	}, []);

	return (
		<Box
			mt={4}
			p={2}
			sx={{
				backgroundColor: colors.blueOrigin[800],
				width: "100%",
				borderRadius: "8px"
			}}
		>
			<Typography
				variant="h3"
				color={colors.primary[100]}
				m={2}
				sx={{ textAlign: "center", fontWeight: "bold" }}
			>
				Pluviometria
			</Typography>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(6,1fr)",
					width: "10"
				}}
				id="gridTablePluvi"
			>
				<div className={styles.headerTitle}>Fazenda</div>
				{lastFiveDays &&
					lastFiveDays.map((data, i) => {
						const [year, month, day] = data.date.split("-");
						const formatData = `${day}/${month}/${year}`;
						return (
							<div className={styles.headerDate} key={i}>
								<p>{formatData}</p>
								<p style={{ color: colors.primary[200] }}>
									{data.number}
								</p>
							</div>
						);
					})}
			</Box>

			{pluviData &&
				FarmsFarmBoxData &&
				lastFiveDays &&
				FarmsFarmBoxData.filter((data) => data.show === true)
					.sort((a, b) => a.name.localeCompare(b.name))
					.map((data, i) => {
						const getPluviValue = (farmName, indexDate) => {
							const filteredValueObj = pluviData.filter(
								(data) =>
									data.fazenda === farmName &&
									data.date === indexDate
							);
							console.log(filteredValueObj.length);
							if (filteredValueObj.length > 1) {
								console.log(
									"objetos filtados: ",
									filteredValueObj
								);
								const divideBy = filteredValueObj.length;
								const value = filteredValueObj.reduce(
									(acc, curr) => {
										acc += curr.value;
										return acc;
									},
									0
								);

								const finalValue = value / divideBy;
								return `${finalValue.toLocaleString("pt-br", {
									minimumFractionDigits: 1,
									maximumFractionDigits: 1
								})} mm`;
							}
							if (filteredValueObj.length > 0) {
								const value = filteredValueObj[0].value;
								return `${value.toLocaleString("pt-br", {
									minimumFractionDigits: 1,
									maximumFractionDigits: 1
								})} mm`;
							}
							return "Sem Apontamento";
						};
						return (
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: "repeat(6,1fr)",
									width: "10",
									padding: "3px 0px"
								}}
								className={styles.rowTablePluvi}
							>
								<span className={styles.pluviHeader}>
									{data.name.replace("Fazenda", "")}
								</span>
								{lastFiveDays.map((lastDays, i) => {
									const valuePluvi = getPluviValue(
										data.name,
										lastFiveDays[i].date
									);
									const classesUsed = `${
										styles.pluviNumber
									} ${
										valuePluvi.length > 10
											? styles.pluviZero
											: styles.pluviGood
									}`;
									return (
										<div className={classesUsed} key={i}>
											{valuePluvi}
										</div>
									);
								})}
							</Box>
						);
					})}
		</Box>
	);
};

export default PluviDataComp;
