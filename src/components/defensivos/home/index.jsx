import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";

import djangoApi from "../../../utils/axios/axios.utils";

import { useEffect } from "react";
import DataDefensivoPage from "../data-table-all";
import DataDefensivoPageByDay from "../data-table-by-day";
import DataDefensivoPageDinamic from "../data-table-dinamic";

import Stack from "@mui/material/Stack";
import CustomButton from "../../button";

import Skeleton from "@mui/material/Skeleton";

const HomeDefensivoPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const { isLoadingHome, dataDef, resumeData } = props;

	const [isOpenProducts, setIsOpenProducts] = useState(true);
	const [isOpenProductsByDay, setisOpenProductsByDay] = useState(false);
	const [isOpenProductsByDayDinamic, setisOpenProductsByDayDinamic] =
		useState(false);

	const [isChangingTable, setIsChangingTable] = useState(false);

	const dictComps = {
		dinamic: "dinamic",
		table: "table",
		tableByDay: "tableByDay"
	};

	const handleSelectComponent = (name) => {
		setIsChangingTable(true);
		switch (name) {
			case "dinamic":
				setisOpenProductsByDayDinamic(true);
				setisOpenProductsByDay(false);
				setIsOpenProducts(false);
				break;
			case "tableByDay":
				setisOpenProductsByDay(true);
				setisOpenProductsByDayDinamic(false);
				setIsOpenProducts(false);
				break;
			case "table":
				setIsOpenProducts(true);
				setisOpenProductsByDay(false);
				setisOpenProductsByDayDinamic(false);
				break;
			default:
				console.log("sem nenhum selecionado");
		}

		setTimeout(() => {
			setIsChangingTable(false);
		}, 500);
	};

	return (
		<Box width="100%" height="100%">
			<Box>
				<Stack spacing={2} direction="row">
					<CustomButton
						color={
							isOpenProducts
								? colors.greenAccent[900]
								: colors.greenAccent[600]
						}
						title="Programação"
						handleOpenModal={() =>
							handleSelectComponent(dictComps.table)
						}
					/>
					<CustomButton
						color={
							isOpenProductsByDay
								? colors.greenAccent[900]
								: colors.greenAccent[600]
						}
						title="Produtos"
						handleOpenModal={() =>
							handleSelectComponent(dictComps.tableByDay)
						}
					/>
					<CustomButton
						color={
							isOpenProductsByDayDinamic
								? colors.greenAccent[900]
								: colors.greenAccent[600]
						}
						title="AP Detalhado"
						handleOpenModal={() =>
							handleSelectComponent(dictComps.dinamic)
						}
					/>
				</Stack>
			</Box>
			{isOpenProducts && (
				<>
					{isChangingTable && (
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							width="100%"
							height="100%"
							mt={2}
							sx={{
								backgroundColor: colors.blueOrigin[700],
								borderRadius: "8px",
								boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
							}}
						>
							<Box
								sx={{
									width: "100%",
									height: "100%",
									padding: "20px"
								}}
							>
								<Typography variant="h1">
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
								</Typography>
							</Box>
						</Box>
					)}
					{!isLoadingHome && (
						<DataDefensivoPage
							isLoadingHome={isLoadingHome}
							data={dataDef}
						/>
					)}
				</>
			)}
			{isOpenProductsByDay && (
				<>
					{isChangingTable && (
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							width="100%"
							height="100%"
							mt={2}
							sx={{
								backgroundColor: colors.blueOrigin[700],
								borderRadius: "8px",
								boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
							}}
						>
							<Box
								sx={{
									width: "100%",
									height: "100%",
									padding: "20px"
								}}
							>
								<Typography variant="h1">
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
								</Typography>
							</Box>
						</Box>
					)}
					{!isLoadingHome && (
						<DataDefensivoPageByDay
							isLoadingHome={isLoadingHome}
							resumeData={resumeData}
						/>
					)}
				</>
			)}
			{isOpenProductsByDayDinamic && (
				<>
					{isChangingTable && (
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							width="100%"
							height="100%"
							mt={2}
							sx={{
								backgroundColor: colors.blueOrigin[700],
								borderRadius: "8px",
								boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
							}}
						>
							<Box
								sx={{
									width: "100%",
									height: "100%",
									padding: "20px"
								}}
							>
								<Typography variant="h1">
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
								</Typography>
							</Box>
						</Box>
					)}
					{!isLoadingHome && (
						<DataDefensivoPageDinamic
							isLoadingHome={isLoadingHome}
							dataDef={dataDef}
						/>
					)}
				</>
			)}
		</Box>
	);
};

export default HomeDefensivoPage;
