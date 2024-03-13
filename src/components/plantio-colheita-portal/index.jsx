import ColheitaAtual from "./plantio-colheita";
import { useEffect } from "react";
import { Box } from "@mui/material";
import RomaneiosPage from "./romaneios";

const PlantioColheitaPortal = (props) => {
	const {
		filteredFarm,
		selectedFarm,
		handlerFilter,
		selectedFilteredData,
		selectedRoute,
		idsPending
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
					idsPending={idsPending}
				/>
			)
		},
		{
			route: "rota 2",
			component: (
				<RomaneiosPage />
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
