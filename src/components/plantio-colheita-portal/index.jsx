import { useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";

import ColheitaAtual from "./plantio-colheita";
import RomaneiosPage from "./romaneios";
import SRDPage from "./srd-page";
import PlantioAtual from "./plantio-atual";

import { tokens } from "../../theme";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faArrowAltCircleLeft, faArrowAltCircleRight, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const PlantioColheitaPortal = (props) => {
	const {
		filteredFarm,
		selectedFarm,
		handlerFilter,
		selectedFilteredData,
		selectedRoute,
		idsPending,
		resumeFarmRomaneios,
		setOpenDrawer,
		openDrawer
	} = props;

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const routesComps = [
		{
			route: "rota 1",
			component: (
				<PlantioAtual
				/>
			)
		},
		{
			route: "rota 2",
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
			route: "rota 3",
			component: (
				<RomaneiosPage />
			)
		},
		{
			route: "rota 4",
			component: (
				<SRDPage />
			)
		}
	];

	const getCompToRender = routesComps.find(
		(data) => data.route === selectedRoute
	);

	return getCompToRender ? (
		<>
			{
				openDrawer ?
					<FontAwesomeIcon
						icon={faArrowAltCircleLeft}
						color={colors.greenAccent[500]}
						onClick={() => setOpenDrawer(false)}
						style={{ cursor: 'pointer', marginLeft: '10px', position: 'fixed' }}
					/>

					:
					<FontAwesomeIcon
						icon={faArrowAltCircleRight}
						color={colors.greenAccent[500]}
						onClick={() => setOpenDrawer(true)}
						style={{ cursor: 'pointer', marginLeft: '10px', position: 'fixed' }}
					/>


			}
			{getCompToRender.component}
		</>
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
