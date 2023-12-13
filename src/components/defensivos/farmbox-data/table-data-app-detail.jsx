import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Chip from "@mui/material/Chip";
import { Box, Grid } from "@mui/material";
import classes from "./farmbox.module.css";

const colorDict = [
	{
		tipo: "Inseticida",
		color: "rgb(218,78,75)"
	},
	{
		tipo: "Herbicida",
		color: "rgb(166,166,54)"
	},
	{
		tipo: "Adjuvante",
		color: "rgb(136,171,172)"
	},
	{
		tipo: "Óleo",
		color: "rgb(120,161,144)"
	},
	{
		tipo: "Micronutrientes",
		color: "rgb(118,192,226)"
	},
	{
		tipo: "Fungicida",
		color: "rgb(238,165,56)"
	},
	{
		tipo: "Fertilizante",
		color: "rgb(76,180,211)"
	},
	{
		tipo: "Nutrição ",
		color: "rgb(87,77,109)"
	},
	{
		tipo: "Biológico",
		color: "rgb(69,133,255)"
	}
];

const getColorChip = (data) => {
	const folt = colorDict.filter((tipo) => tipo.tipo === data);
	if (folt.length > 0) {
		return folt[0].color;
	} else {
		return "rgb(255,255,255,0.1)";
	}
};

const IconDetail = ({ color }) => {
	return (
		<FontAwesomeIcon
			icon={faCircleCheck}
			color={color ? "green" : "red"}
			size="sm"
			style={{
				margin: "0px 10px",
				cursor: "pointer"
			}}
		/>
	);
};
const DetailAppData = ({ data, showData }) => {
	return (
		<>
			<Box
				display="grid"
				gridAutoFlow="row"
				justifyContent="start"
				flexWrap="wrap"
				gridAutoRows="0fr"
				gridTemplateColumns="1fr 1fr 1fr"
				gridRowGap="0px"
				width="50%"
			>
				{data.parcelas
					.sort((a, b) => b.aplicado - a.aplicado)
					.map((data, i) => {
						return (
							<Box m={1}>
								{/* {<IconDetail color={data.aplicado} />} */}
								<span
									style={{
										backgroundColor: data.aplicado
											? "rgba(0,250,0, 0.6)"
											: "rgba(238,75,43, 0.6)",
										padding: "3px 10px",
										borderRadius: "12px",
										fontWeight: "bold"
									}}
								>
									{data.parcela} -{" "}
									{data.area
										.toFixed(2)
										.toString()
										.replace(".", ",")}
								</span>
								{/* <progress value={20} max={data.area}></progress> */}
							</Box>
						);
					})}
			</Box>
			<div>
				{data.insumos
					.sort((a, b) => a.tipo.localeCompare(b.tipo))
					.map((data, i) => {
						const tipo = data.tipo.includes("Óleo Mineral")
							? "Óleo"
							: data.tipo;
						return (
							<>
								<p key={i}>
									<b>
										{parseFloat(data.dose).toLocaleString(
											"pt-br",
											{
												minimumFractionDigits: 3,
												maximumFractionDigits: 3
											}
										)}
									</b>{" "}
									<Chip
										label={
											tipo.includes("Óleo Mineral")
												? "Óleo"
												: tipo
										}
										sx={{
											backgroundColor: getColorChip(tipo),
											minWidth: "90px",
											textAlign: "center",
											height: "auto",
											margin: "0px 8px 0px 4px"
										}}
										size="small"
									/>
									{data.insumo} -{" "}
									{parseFloat(data.quantidade).toLocaleString(
										"pt-br",
										{
											minimumFractionDigits: 2,
											maximumFractionDigits: 2
										}
									)}
								</p>
							</>
						);
					})}
			</div>
		</>
	);
};

export default DetailAppData;
