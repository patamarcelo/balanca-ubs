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
import PlantioDonePage from "../plantio-done";

import Stack from "@mui/material/Stack";
import CustomButton from "../../button";

import Skeleton from "@mui/material/Skeleton";

import LoaderHomeSkeleton from "./loader";

import DateIntervalPage from "../data-program/date-interval";

import classes from "../data-program/data-program.module.css";

import SafraCicloComp from "./safra-ciclo";

const HomeDefensivoPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const { isLoadingHome, dataDef, resumeData } = props;

	const [isOpenProducts, setIsOpenProducts] = useState(true);
	const [isOpenProductsByDay, setisOpenProductsByDay] = useState(false);
	const [isOpenProductsByDayDinamic, setisOpenProductsByDayDinamic] =
		useState(false);
	const [isOpenProductsProgram, setisOpenProductsProgram] = useState(false);
	const [isOpenPlantioPage, setIsOpenPlantioPage] = useState(false);

	const [isChangingTable, setIsChangingTable] = useState(false);

	const [initialDateForm, setInitialDate] = useState(null);
	const [finalDateForm, setFinalDateForm] = useState(null);

	// useEffect(() => {
	// 	const current = new Date();
	// 	current.setDate(current.getDate() + 7);
	// 	setFinalDateForm(current.toISOString().split("T")[0]);
	// }, []);

	useEffect(() => {
		const today = new Date();
		const lastSunday = (today) => {
			var t = new Date(today);
			t.setDate(t.getDate() - t.getDay());
			return [t.toISOString().slice(0, 10), t];
		};
		// setInitialDate(lastSunday(today)[0]);
		setInitialDate("2023-05-01");
		const finalDate = lastSunday(today)[1];
		finalDate.setDate(finalDate.getDate() + 6);
		setFinalDateForm(finalDate.toISOString().split("T")[0]);
	}, []);

	const dictComps = {
		dinamic: "dinamic",
		table: "table",
		tableByDay: "tableByDay",
		productsProgram: "productsProgram",
		plantioPage: "plantioPage"
	};

	const handleSelectComponent = (name) => {
		setIsChangingTable(true);
		switch (name) {
			case "dinamic":
				setisOpenProductsByDayDinamic(true);
				setisOpenProductsByDay(false);
				setIsOpenProducts(false);
				setisOpenProductsProgram(false);
				setIsOpenPlantioPage(false);
				break;
			case "tableByDay":
				setisOpenProductsByDay(true);
				setisOpenProductsByDayDinamic(false);
				setIsOpenProducts(false);
				setisOpenProductsProgram(false);
				setIsOpenPlantioPage(false);
				break;
			case "table":
				setIsOpenProducts(true);
				setisOpenProductsByDay(false);
				setisOpenProductsByDayDinamic(false);
				setisOpenProductsProgram(false);
				setIsOpenPlantioPage(false);
				break;
			case "productsProgram":
				setisOpenProductsProgram(true);
				setIsOpenProducts(false);
				setisOpenProductsByDay(false);
				setisOpenProductsByDayDinamic(false);
				setIsOpenPlantioPage(false);
				break;
			case "plantioPage":
				setIsOpenPlantioPage(true);
				setisOpenProductsProgram(false);
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

	const buttonTable = [
		{
			title: "Programação",
			option: dictComps.table,
			selection: isOpenProducts
		},
		{
			title: "Produtos",
			option: dictComps.tableByDay,
			selection: isOpenProductsByDay
		},
		{
			title: "AP Detalhado",
			option: dictComps.dinamic,
			selection: isOpenProductsByDayDinamic
		},
		{
			title: "Aplicações",
			option: dictComps.productsProgram,
			selection: isOpenProductsProgram
		},
		{
			title: "Plantio",
			option: dictComps.plantioPage,
			selection: isOpenPlantioPage
		}
	];
	return (
		<Box width="100%" height="100%">
			<Box sx={{ marginLeft: "5px" }} mb={2}>
				<Stack spacing={2} direction="row" justifyContent="start">
					<Box display="flex" justifyContent="start" gap="20px">
						{buttonTable.map((data, i) => {
							return (
								<CustomButton
									color={
										data.selection
											? colors.greenAccent[900]
											: colors.greenAccent[600]
									}
									title={data.title}
									handleOpenModal={() =>
										handleSelectComponent(data.option)
									}
								/>
							);
						})}
					</Box>
					{isOpenProductsProgram && (
						<Box
							sx={{
								maxHeight: " 33px",
								flexGrow: 1,
								display: "flex",
								justifyContent: "center"
							}}
						>
							<div className={classes["date-picker"]}>
								<DateIntervalPage
									setInitialDate={setInitialDate}
									initialDateForm={initialDateForm}
									label="Data Inicial"
								/>
								<DateIntervalPage
									setInitialDate={setFinalDateForm}
									initialDateForm={finalDateForm}
									label="Data Final"
								/>
							</div>
						</Box>
					)}
					{isOpenPlantioPage && <SafraCicloComp />}
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
							initialDateForm={initialDateForm}
							finalDateForm={finalDateForm}
							isLoadingHome={isLoadingHome}
							dataDef={dataDef}
						/>
					)}
				</>
			)}
			{isOpenPlantioPage && (
				<>
					{isChangingTable && <LoaderHomeSkeleton />}
					{!isLoadingHome && !isChangingTable && (
						<PlantioDonePage
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
