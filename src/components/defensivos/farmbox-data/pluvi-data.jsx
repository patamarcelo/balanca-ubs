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

	const getLastFiveDays = () => {
		let fiveDays = [];
		const today = new Date();
		for (let i = 0; i < 5; i++) {
			const getDay = new Date(new Date().setDate(today.getDate() - i));
			const formatDay = getDay.toISOString().split("T")[0];
			fiveDays.push(formatDay);
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
						const [year, month, day] = data.split("-");
						const formatData = `${day}/${month}/${year}`;
						return (
							<div className={styles.headerDate} key={i}>
								{formatData}
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
							if (filteredValueObj.length > 0) {
								const value = filteredValueObj[0].value;
								return `${value} mm`;
							}
							return "Sem Apontamento";
						};
						return (
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: "repeat(6,1fr)",
									width: "10"
								}}
								className={styles.rowTablePluvi}
							>
								<span className={styles.pluviHeader}>
									{data.name.replace("Fazenda", "")}
								</span>
								{lastFiveDays.map((lastDays, i) => {
									const valuePluvi = getPluviValue(
										data.name,
										lastFiveDays[i]
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
