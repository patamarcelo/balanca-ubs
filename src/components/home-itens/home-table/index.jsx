import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import { getTruckMoves } from "../../../utils/firebase/firebase.datatable";
// import { listenerTruckTable } from "../../utils/firebase/firebase.datatable";

import { useDispatch } from "react-redux";
import { setTruckLoads } from "../../../store/trucks/trucks.actions";
import CircularProgress from "@mui/material/CircularProgress";

import { useSelector } from "react-redux";
import { selectTruckLoadsOnWork } from "../../../store/trucks/trucks.selector";

import HomeTableTruck from "../home-table-truck";
const HomeTable = (props) => {
	const {
		saved,
		handlerSave,
		isOpenModal,
		handleCloseModal,
		dataModal,
		handleCloseModalEsc,
		handleChangeTruck,
		handleBlurTruck,
		truckValues,
		setTruckValues,
		handleOpenModal,
		isLoadingHome
	} = props;

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [isLoading, setIsLoading] = useState(false);
	const [showAd, setShowAd] = useState(false);

	const tableHome = useSelector(selectTruckLoadsOnWork);

	// const dispatch = useDispatch();

	// useEffect(() => {
	// 	const getData = async () => {
	// 		setIsLoading(true);
	// 		const data = await getTruckMoves();
	// 		dispatch(setTruckLoads(data));
	// 		setIsLoading(false);
	// 	};
	// 	return () => getData();
	// }, [saved]);

	useEffect(() => {
		if (tableHome.length === 0) {
			setTimeout(() => {
				setShowAd(true);
			}, 1000);
		}
	}, [tableHome]);

	if (isLoadingHome) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="100%"
				height="100%"
				sx={{
					backgroundColor: colors.blueOrigin[700],
					borderRadius: "8px",
					boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
				}}
			>
				<Typography
					variant="h2"
					color={colors.yellow[700]}
					sx={{ fontWeight: "bold" }}
				>
					<CircularProgress sx={{ color: colors.primary[100] }} />
				</Typography>
			</Box>
		);
	}

	if (tableHome.length === 0 && showAd) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="100%"
				height="100%"
				sx={{
					backgroundColor: colors.blueOrigin[700],
					borderRadius: "8px",
					boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
				}}
			>
				<Typography
					variant="h2"
					color={colors.yellow[700]}
					sx={{ fontWeight: "bold" }}
				>
					SEM VEÍCULOS NO PÁTIO
				</Typography>
			</Box>
		);
	}

	return (
		<Box
			width="100%"
			display="flex"
			alignItems="center"
			flexDirection="column"
			gap="15px"
			sx={{
				padding: "15px 0"
			}}
		>
			<HomeTableTruck
				saved={saved}
				handlerSave={handlerSave}
				isOpenModal={isOpenModal}
				handleCloseModal={handleCloseModal}
				dataModal={dataModal}
				handleCloseModalEsc={handleCloseModalEsc}
				handleChangeTruck={handleChangeTruck}
				handleBlurTruck={handleBlurTruck}
				truckValues={truckValues}
				setTruckValues={setTruckValues}
				handleOpenModal={handleOpenModal}
			/>
		</Box>
	);
};

export default HomeTable;
