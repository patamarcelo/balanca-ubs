import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

import classes from "./data-by-day.module.css";
import DataDefensivoDaysTable from "./data-table-mui";

const DataDefensivoPageByDay = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { isLoadingHome, resumeData } = props;

	const [sortedData, setSortedData] = useState([]);
	const [onlyData, setOnlyData] = useState([]);
	const [onlyProducts, setOnlyProducts] = useState([]);
	const [dataTableDays, setDataTableDays] = useState([]);

	useEffect(() => {
		if (resumeData) {
			const sortData = resumeData.sort((a, b) => {
				var aa = a.data.replace("-", ""),
					bb = b.data.replace("-", "");
				return aa < bb ? -1 : aa > bb ? 1 : 0;
			});
			setSortedData(sortData);
		}
	}, [resumeData]);

	useEffect(() => {
		const onlyData = sortedData.map((data) => {
			return data.data;
		});
		setOnlyData(onlyData);

		const onlyProdctName = sortedData.map((data) => {
			const prodFilt = data.produtos.map((produtos) => {
				return produtos.produto;
			});
			return prodFilt;
		});
		setOnlyProducts([...new Set(onlyProdctName.flat())].sort());
	}, [sortedData]);

	useEffect(() => {
		const arr = [];
		const newArrTable = onlyProducts.map((prodd) => {
			const objToappend = {};
			const prodName = prodd;
			objToappend["produto"] = prodName;
			objToappend["id"] = prodName;
			for (let dataD of onlyData) {
				for (let sortData of sortedData) {
					if (dataD === sortData.data) {
						for (let prodData of sortData.produtos) {
							if (prodName === prodData.produto) {
								objToappend["tipo"] = prodData.tipo;
								objToappend[sortData.data] =
									prodData.quantidade.toLocaleString(
										"pt-BR",
										{ maximumFractionDigits: 2 }
									);
							}
							if (!(sortData.data in objToappend)) {
								objToappend[dataD] = "-";
							}
						}
					}
				}
			}
			arr.push(objToappend);
			return arr;
			// return arr;
		});
		setDataTableDays(arr);
	}, [sortedData, isLoadingHome, onlyData, onlyProducts]);

	return (
		<Box
			width="100%"
			height="96%"
			pb={2}
			sx={
				{
					// backgroundColor: "red"
				}
			}
		>
			<DataDefensivoDaysTable rows={dataTableDays} columns={onlyData} />
			{isLoadingHome && !sortedData && (
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					width="100%"
					height="100%"
					mt={4}
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
			)}
		</Box>
	);
};

export default DataDefensivoPageByDay;
