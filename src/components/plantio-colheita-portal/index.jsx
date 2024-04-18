import ColheitaAtual from "./plantio-colheita";
import { useEffect } from "react";
import { Box } from "@mui/material";
import RomaneiosPage from "./romaneios";
import SRDPage from "./srd-page";

const PlantioColheitaPortal = (props) => {
	const {
		filteredFarm,
		selectedFarm,
		handlerFilter,
		selectedFilteredData,
		selectedRoute,
		idsPending,
		resumeFarmRomaneios
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
					resumeFarmRomaneios={resumeFarmRomaneios}
				/>
			)
		},
		{
			route: "rota 2",
			component: (
				<RomaneiosPage />
			)
		},
		{
			route: "rota 3",
			component: (
				<SRDPage />
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
