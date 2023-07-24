import { useSelector } from "react-redux";
import { geralAppDetail } from "../../../store/plantio/plantio.selector";
import classes from "./farmbox.module.css";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";
import { Box, Divider } from "@mui/material";

const ResumoFazendasPage = (props) => {
	const dataGeral = useSelector(geralAppDetail);

	const { fazenda, colors } = props;

	const fazPlan = dataGeral.fazendas[fazenda];

	const iconDict = [
		{ cultura: "Soja", icon: soy, alt: "soja" },
		{ cultura: "Feijão", icon: beans, alt: "feijao" },
		{ cultura: "Arroz", icon: rice, alt: "arroz" }
	];

	const filteredIcon = (data) => {
		const filtered = iconDict.filter((dictD) => dictD.cultura === data);

		if (filtered.length > 0) {
			return filtered[0].icon;
		}
		return "";
	};

	const filteredAlt = (data) => {
		const filtered = iconDict.filter((dictD) => dictD.cultura === data);

		if (filtered.length > 0) {
			return filtered[0].alt;
		}
		return "";
	};

	return (
		<div style={{ width: "100%" }}>
			<div className={classes.resumoFazendasMainDiv}>
				<span>{fazenda.split("Fazenda")[1]}</span>
				<div style={{ marginLeft: "10px", fontSize: "large" }}>
					{fazenda in dataGeral.fazendas
						? dataGeral.fazendas[fazenda].saldo.toLocaleString(
								"pt-br",
								{
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								}
						  )
						: "0,00"}
				</div>
			</div>
			{fazenda in dataGeral.fazendas ? (
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
										src={filteredIcon(data.cultura)}
										alt={filteredAlt(data.cultura)}
									/>
									<p style={{ marginLeft: "6px" }}>
										{fazPlan[data.cultura].toLocaleString(
											"pt-br",
											{
												minimumFractionDigits: 2,
												maximumFractionDigits: 2
											}
										)}
									</p>
								</Box>
							);
						} else {
							return <></>;
						}
					})}
				</div>
			) : (
				<Box mb={3}></Box>
			)}

			<Box width="100%">
				<Divider />
			</Box>
		</div>
	);
};

export default ResumoFazendasPage;
