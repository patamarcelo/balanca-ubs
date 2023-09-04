import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { useState } from "react";

import { useEffect } from "react";
import DataDefensivoPage from "../data-table-all";
import DataDefensivoPageDinamic from "../data-table-dinamic";
import DataProgramPage from "../data-program";
import PlantioDonePage from "../plantio-done";
import ProdutividadePage from "../produtividade-page";
import FarmBoxPage from "../farmbox-data";

import Stack from "@mui/material/Stack";
import CustomButton from "../../button";

import LoaderHomeSkeleton from "./loader";

import DateIntervalPage from "../data-program/date-interval";

import classes from "../data-program/data-program.module.css";

import SafraCicloComp from "./safra-ciclo";
import classesPlantioDone from "../plantio-done/plantio-done-page.module.css";

const HomeDefensivoPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const { isLoadingHome, handleRefreshData } = props;

	const [isOpenProducts, setIsOpenProducts] = useState(true);
	const [isOpenProductsByDayDinamic, setisOpenProductsByDayDinamic] =
		useState(false);
	const [isOpenProductsProgram, setisOpenProductsProgram] = useState(false);
	const [isOpenPlantioPage, setIsOpenPlantioPage] = useState(false);
	const [isOpenFarmbox, setIsOpenFarmbox] = useState(false);

	const [isChangingTable, setIsChangingTable] = useState(false);
	const [isProdutividadePage, setIsProdutividadePage] = useState(false);

	const [initialDateForm, setInitialDate] = useState(null);
	const [finalDateForm, setFinalDateForm] = useState(null);

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
		plantioPage: "plantioPage",
		produtividadePage: "produtividadePage",
		farmboxData: "farmbox"
	};

	const handleSelectComponent = (name) => {
		setIsChangingTable(true);
		switch (name) {
			case "dinamic":
				setisOpenProductsByDayDinamic(true);
				setIsOpenFarmbox(false);
				setIsOpenProducts(false);
				setisOpenProductsProgram(false);
				setIsOpenPlantioPage(false);
				setIsProdutividadePage(false);
				break;
			case "table":
				setIsOpenProducts(true);
				setisOpenProductsByDayDinamic(false);
				setIsOpenFarmbox(false);
				setisOpenProductsProgram(false);
				setIsOpenPlantioPage(false);
				setIsProdutividadePage(false);
				break;
			case "productsProgram":
				setisOpenProductsProgram(true);
				setIsOpenProducts(false);
				setisOpenProductsByDayDinamic(false);
				setIsOpenFarmbox(false);
				setIsOpenPlantioPage(false);
				setIsProdutividadePage(false);
				break;
			case "plantioPage":
				setIsOpenPlantioPage(true);
				setisOpenProductsProgram(false);
				setIsOpenProducts(false);
				setisOpenProductsByDayDinamic(false);
				setIsOpenFarmbox(false);
				setIsProdutividadePage(false);

				break;
			case "produtividadePage":
				setIsProdutividadePage(true);
				setIsOpenPlantioPage(false);
				setisOpenProductsProgram(false);
				setIsOpenProducts(false);
				setisOpenProductsByDayDinamic(false);
				setIsOpenFarmbox(false);
				break;
			case "farmbox":
				setIsOpenFarmbox(true);
				setIsOpenPlantioPage(false);
				setisOpenProductsProgram(false);
				setIsOpenProducts(false);
				setisOpenProductsByDayDinamic(false);
				setIsProdutividadePage(false);
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
			title: "Aplicações",
			option: dictComps.productsProgram,
			selection: isOpenProductsProgram
		},
		{
			title: "AP Detalhado",
			option: dictComps.dinamic,
			selection: isOpenProductsByDayDinamic
		},
		{
			title: "Plantio",
			option: dictComps.plantioPage,
			selection: isOpenPlantioPage
		},
		{
			title: "Produtividade",
			option: dictComps.produtividadePage,
			selection: isProdutividadePage
		},
		{
			title: "Farmbox",
			option: dictComps.farmboxData,
			selection: isOpenFarmbox
		}
	];
	return (
		<Box width="100%" height="100%">
			<Box sx={{ marginLeft: "5px" }} mb={2}>
				<Stack spacing={2} direction="row" justifyContent="start">
					<Box
						display="flex"
						justifyContent="start"
						gap="20px"
						height="42px"
						alignItems="end"
					>
						{buttonTable.map((data, i) => {
							return (
								<CustomButton
									size="small"
									height="30px"
									key={i}
									color={
										data.selection
											? colors.greenAccent[900]
											: colors.greenAccent[600]
									}
									fontColor={colors.primary[100]}
									title={data.title}
									handleOpenModal={() =>
										handleSelectComponent(data.option)
									}
								/>
							);
						})}
					</Box>
					<Box>
						<SafraCicloComp />
					</Box>
					{isOpenProductsProgram && (
						<Box
							sx={{
								flexGrow: 1,
								display: "flex",
								justifyContent: "center",
								margin: "5px"
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
				</Stack>
			</Box>
			{isOpenProducts && (
				<>
					{isChangingTable && <LoaderHomeSkeleton />}
					{!isLoadingHome && !isChangingTable && (
						<DataDefensivoPage isLoadingHome={isLoadingHome} />
					)}
				</>
			)}
			{isOpenProductsByDayDinamic && (
				<>
					{isChangingTable && <LoaderHomeSkeleton />}
					{!isLoadingHome && !isChangingTable && (
						<DataDefensivoPageDinamic
							isLoadingHome={isLoadingHome}
						/>
					)}
				</>
			)}
			{isOpenProductsProgram && (
				<>
					{isChangingTable && <LoaderHomeSkeleton />}
					{!isLoadingHome && !isChangingTable && (
						<DataProgramPage
							handleRefreshData={handleRefreshData}
							initialDateForm={initialDateForm}
							finalDateForm={finalDateForm}
							isLoadingHome={isLoadingHome}
						/>
					)}
				</>
			)}
			{isOpenPlantioPage && (
				<>
					{isChangingTable && (
						<Box className={classesPlantioDone.container}>
							<LoaderHomeSkeleton />
						</Box>
					)}
					{!isLoadingHome && !isChangingTable && (
						<PlantioDonePage isLoadingHome={isLoadingHome} />
					)}
				</>
			)}
			{isProdutividadePage && (
				<>
					{isChangingTable && (
						<Box className={classesPlantioDone.container}>
							<LoaderHomeSkeleton />
						</Box>
					)}
					{!isLoadingHome && !isChangingTable && (
						<ProdutividadePage isLoadingHome={isLoadingHome} />
					)}
				</>
			)}
			{isOpenFarmbox && (
				<>
					{isChangingTable && (
						<Box className={classesPlantioDone.container}>
							<LoaderHomeSkeleton />
						</Box>
					)}
					{!isLoadingHome && !isChangingTable && (
						<FarmBoxPage isLoadingHome={isLoadingHome} />
					)}
				</>
			)}
		</Box>
	);
};

export default HomeDefensivoPage;
