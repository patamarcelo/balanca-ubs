import { useSelector } from "react-redux";
import { geralAppDetail } from "../../../store/plantio/plantio.selector";
import classes from "./farmbox.module.css";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";
import question from "../../../utils/assets/icons/question.png";
import { Box, Divider, Typography } from "@mui/material";
import CardDiviOperations from "./card-divisor-operations";

const ResumoFazendasPage = (props) => {
	const {
		fazenda,
		colors,
		divider,
		filterPreaproSolo,
		operationFilter,
		showFutureApps,
		daysFilter,
		dataGeral
	} = props;
	// console.log('dataGeral: ', dataGeral)
	const fazPlan = dataGeral.fazendas[fazenda];
	// console.log('fazPlan', fazPlan)
	const iconDict = [
		{ cultura: "Soja", icon: soy, alt: "soja" },
		{ cultura: "Feijão", icon: beans, alt: "feijao" },
		{ cultura: "Arroz", icon: rice, alt: "arroz" },
		{ cultura: "SemCultura", icon: question, alt: "?" }
	];

	const filteredIcon = (data) => {
		const filtered = iconDict.filter((dictD) => dictD.cultura === data);

		if (filtered.length > 0) {
			return filtered[0].icon;
		}
		return iconDict[3].icon;
		// return "";
	};

	const filteredAlt = (data) => {
		const filtered = iconDict.filter((dictD) => dictD.cultura === data);

		if (filtered.length > 0) {
			return filtered[0].alt;
		}
		return iconDict[3].alt;
		// return "";
	};

	return (
		<div style={{ width: "100%" }}>
			<div className={classes.resumoFazendasMainDiv}>
				<span>
					<a
						href={"#" + fazenda}
						style={{
							textDecoration: "none",
							cursor: "pointer",
							color: "whitesmoke"
						}}
					>
						{fazenda.split("Fazenda")[1]}
					</a>
				</span>
				<div style={{ marginLeft: "10px", fontSize: "large" }}>
					{fazenda in dataGeral.fazendas
						? dataGeral.fazendas[fazenda].saldo.toLocaleString(
							"pt-br",
							{
								minimumFractionDigits: 0,
								maximumFractionDigits: 0
							}
						)
						: "0,00"}
				</div>
			</div>
			{fazenda in dataGeral.fazendas ? (
				<>

					<div
						className={classes.resumoByCultura}
						style={{ color: colors.primary[200] }}
					>
						{iconDict.map((data, i) => {
							if (fazPlan[data.cultura] !== undefined) {
								return (
									<Box
										key={i}
										width="100%"
										display="flex"
										justifyContent="start"
										alignItems="center"
									>
										<img
											className={classes.imgFarmDiv}
											src={filteredIcon(data.cultura)}
											alt={filteredAlt(data.cultura)}
										/>
										<p style={{ marginLeft: "2px" }}>
											{fazPlan[data.cultura].toLocaleString(
												"pt-br",
												{
													minimumFractionDigits:0,
													maximumFractionDigits: 0
												}
											)} Há
										</p>
									</Box>
								);
							} else {
								return <></>;
							}
						})}
					</div>
					{/* <Divider /> */}
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'flex-start',
							gap: '30px',
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<CardDiviOperations
							title="Sólido"
							value={fazPlan["saldoSolido"]}
						/>
						<CardDiviOperations
							title="Líquido"
							value={fazPlan["saldoLiquido"]}
						/>
						<CardDiviOperations
							title="Operações"
							value={fazPlan["saldoOperacao"]}
						/>
					</Box>
					{/* <p>{fazPlan['saldoLiquido']}</p>
					<p>{fazPlan['saldoOperacao']}</p> */}
				</>
			) : (
				<Box mb={3}></Box>
			)}
			{divider && (
				<Box width="100%" sx={{marginTop: '10px'}}>
					<Divider />
				</Box>
			)}
		</div>
	);
};

export default ResumoFazendasPage;
