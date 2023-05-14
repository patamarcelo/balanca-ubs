import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";

import djangoApi from "../../../utils/axios/axios.utils";

import { useEffect } from "react";
import DataDefensivoPage from "../data-table-all";
import DataDefensivoPageByDay from "../data-table-by-day";
import DataDefensivoPageDinamic from "../data-table-dinamic";
import DataProgramPage from "../data-program";

import Stack from "@mui/material/Stack";
import CustomButton from "../../button";

import Skeleton from "@mui/material/Skeleton";

import LoaderHomeSkeleton from "./loader";

const HomeDefensivoPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const { isLoadingHome, dataDef, resumeData } = props;

	const [isOpenProducts, setIsOpenProducts] = useState(true);
	const [isOpenProductsByDay, setisOpenProductsByDay] = useState(false);
	const [isOpenProductsByDayDinamic, setisOpenProductsByDayDinamic] =
		useState(false);
	const [isOpenProductsProgram, setisOpenProductsProgram] = useState(false);

	const [isChangingTable, setIsChangingTable] = useState(false);

	const dictComps = {
		dinamic: "dinamic",
		table: "table",
		tableByDay: "tableByDay",
		productsProgram: "productsProgram"
	};

	const handleSelectComponent = (name) => {
		setIsChangingTable(true);
		switch (name) {
			case "dinamic":
				setisOpenProductsByDayDinamic(true);
				setisOpenProductsByDay(false);
				setIsOpenProducts(false);
				setisOpenProductsProgram(false);
				break;
			case "tableByDay":
				setisOpenProductsByDay(true);
				setisOpenProductsByDayDinamic(false);
				setIsOpenProducts(false);
				setisOpenProductsProgram(false);
				break;
			case "table":
				setIsOpenProducts(true);
				setisOpenProductsByDay(false);
				setisOpenProductsByDayDinamic(false);
				setisOpenProductsProgram(false);
				break;
			case "productsProgram":
				setisOpenProductsProgram(true);
				setIsOpenProducts(false);
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
			<Box sx={{ marginLeft: "5px" }} mb={2}>
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
					<CustomButton
						color={
							isOpenProductsProgram
								? colors.greenAccent[900]
								: colors.greenAccent[600]
						}
						title="Programas"
						handleOpenModal={() =>
							handleSelectComponent(dictComps.productsProgram)
						}
					/>
				</Stack>
			</Box>
			{isOpenProducts && (
				<>
					{isChangingTable && <LoaderHomeSkeleton />}
					{!isLoadingHome && !isChangingTable && (
						<DataDefensivoPage
							isLoadingHome={isLoadingHome}
							data={dataDef}
						/>
					)}
				</>
			)}
			{isOpenProductsByDay && (
				<>
					{isChangingTable && <LoaderHomeSkeleton />}
					{!isLoadingHome && !isChangingTable && (
						<DataDefensivoPageByDay
							isLoadingHome={isLoadingHome}
							resumeData={resumeData}
						/>
					)}
				</>
			)}
			{isOpenProductsByDayDinamic && (
				<>
					{isChangingTable && <LoaderHomeSkeleton />}
					{!isLoadingHome && !isChangingTable && (
						<DataDefensivoPageDinamic
							isLoadingHome={isLoadingHome}
							dataDef={dataDef}
						/>
					)}
				</>
			)}
			{isOpenProductsProgram && (
				<>
					{isChangingTable && <LoaderHomeSkeleton />}
					{!isLoadingHome && !isChangingTable && (
						<DataProgramPage
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
