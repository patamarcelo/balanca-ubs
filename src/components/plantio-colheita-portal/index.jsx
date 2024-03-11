import ColheitaAtual from "./plantio-colheita";
import { useEffect } from "react";
import { Box } from "@mui/material";

const PlantioColheitaPortal = (props) => {
	const {
		filteredFarm,
		selectedFarm,
		handlerFilter,
		selectedFilteredData,
		selectedRoute
	} = props;
	const routesComps = [
		{
			route: "rota 1",
			component: (
				<ColheitaAtual
					filteredFarm={filteredFarm}
					selectedFarm={selectedFarm}
					handlerFilter={handlerFilter}
					selectedFilteredData={selectedFilteredData}
				/>
			)
		},
		{
			route: "rota 2",
			component: (
				<Box
					width={"100%"}
					height={"100%"}
					justifyContent={"center"}
					display={"flex"}
					alignItems={"center"}
				>
					Route 2
				</Box>
			)
		}
	];

	const getCompToRender = routesComps.find(
		(data) => data.route === selectedRoute
	);

	return getCompToRender ? (
		<>{getCompToRender.component}</>
	) : (
		<Box
			display={"flex"}
			justifyContent={"center"}
			alignItems={"center"}
			width={"100%"}
			height={"100%"}
		>
			ROTA SEM COMPONENTE CADASTRADO
		</Box>
	);
};

export default PlantioColheitaPortal;