import { ResponsiveBar } from "@nivo/bar";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { useState, useEffect } from "react";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const data = [
	{
		country: "AD",
		"hot dog": 164,
		"hot dogColor": "hsl(72, 70%, 50%)",
		burger: 78,
		burgerColor: "hsl(312, 70%, 50%)",
		sandwich: 39,
		sandwichColor: "hsl(64, 70%, 50%)",
		kebab: 35,
		kebabColor: "hsl(57, 70%, 50%)",
		fries: 127,
		friesColor: "hsl(235, 70%, 50%)",
		donut: 69,
		donutColor: "hsl(244, 70%, 50%)"
	},
	{
		country: "AE",
		"hot dog": 37,
		"hot dogColor": "hsl(129, 70%, 50%)",
		burger: 90,
		burgerColor: "hsl(27, 70%, 50%)",
		sandwich: 22,
		sandwichColor: "hsl(84, 70%, 50%)",
		kebab: 89,
		kebabColor: "hsl(209, 70%, 50%)",
		fries: 74,
		friesColor: "hsl(302, 70%, 50%)",
		donut: 192,
		donutColor: "hsl(259, 70%, 50%)"
	},
	{
		country: "AF",
		"hot dog": 5,
		"hot dogColor": "hsl(245, 70%, 50%)",
		burger: 177,
		burgerColor: "hsl(55, 70%, 50%)",
		sandwich: 152,
		sandwichColor: "hsl(95, 70%, 50%)",
		kebab: 73,
		kebabColor: "hsl(102, 70%, 50%)",
		fries: 63,
		friesColor: "hsl(195, 70%, 50%)",
		donut: 1,
		donutColor: "hsl(287, 70%, 50%)"
	},
	{
		country: "AG",
		"hot dog": 13,
		"hot dogColor": "hsl(45, 70%, 50%)",
		burger: 168,
		burgerColor: "hsl(2, 70%, 50%)",
		sandwich: 65,
		sandwichColor: "hsl(209, 70%, 50%)",
		kebab: 41,
		kebabColor: "hsl(204, 70%, 50%)",
		fries: 84,
		friesColor: "hsl(290, 70%, 50%)",
		donut: 37,
		donutColor: "hsl(331, 70%, 50%)"
	},
	{
		country: "AI",
		"hot dog": 180,
		"hot dogColor": "hsl(52, 70%, 50%)",
		burger: 127,
		burgerColor: "hsl(149, 70%, 50%)",
		sandwich: 54,
		sandwichColor: "hsl(273, 70%, 50%)",
		kebab: 7,
		kebabColor: "hsl(207, 70%, 50%)",
		fries: 48,
		friesColor: "hsl(14, 70%, 50%)",
		donut: 70,
		donutColor: "hsl(265, 70%, 50%)"
	},
	{
		country: "AL",
		"hot dog": 194,
		"hot dogColor": "hsl(117, 70%, 50%)",
		burger: 111,
		burgerColor: "hsl(181, 70%, 50%)",
		sandwich: 46,
		sandwichColor: "hsl(68, 70%, 50%)",
		kebab: 197,
		kebabColor: "hsl(54, 70%, 50%)",
		fries: 24,
		friesColor: "hsl(228, 70%, 50%)",
		donut: 124,
		donutColor: "hsl(110, 70%, 50%)"
	},
	{
		country: "AM",
		"hot dog": 107,
		"hot dogColor": "hsl(228, 70%, 50%)",
		burger: 108,
		burgerColor: "hsl(195, 70%, 50%)",
		sandwich: 109,
		sandwichColor: "hsl(210, 70%, 50%)",
		kebab: 59,
		kebabColor: "hsl(4, 70%, 50%)",
		fries: 31,
		friesColor: "hsl(126, 70%, 50%)",
		donut: 114,
		donutColor: "hsl(197, 70%, 50%)"
	}
];
const DailyChartBar = (props) => {
	const { dataByDay, filtCult } = props;
	const themeP = useTheme();
	const colors = tokens(themeP.palette.mode);

	const [formatData, setFormatData] = useState([]);
	const [onlyFarms, setOnlyFarms] = useState([]);
	const [selectedFilter, setSelectedFilter] = useState("Fazenda");

	const [chartInsideData, setchartInsideData] = useState([]);
	const [farmFilter, setfarmFilter] = useState([]);

	useEffect(() => {
		if (dataByDay) {
			const dataToReduce =
				filtCult === "Todas"
					? dataByDay
					: dataByDay.filter(
							(data) =>
								data.variedade__cultura__cultura === filtCult
					  );
			const formData = dataToReduce.reduce((acc, curr) => {
				const dataP = curr.data_plantio;
				const areaTotal = curr.area_total;
				let fazenda = "";
				if (selectedFilter === "Fazenda") {
					fazenda = curr.talhao__fazenda__fazenda__nome.replace(
						selectedFilter,
						""
					);
				} else {
					fazenda = fazenda = curr.talhao__fazenda__nome.replace(
						selectedFilter,
						""
					);
				}
				if (acc.filter((data) => data.country === dataP).length === 0) {
					const objToAdd = {};
					objToAdd.country = dataP;
					objToAdd[fazenda] = areaTotal;
					acc.push(objToAdd);
				} else {
					const findIndexOf = (e) => e.country === dataP;
					const getIndex = acc.findIndex(findIndexOf);
					if (acc[getIndex].hasOwnProperty(fazenda)) {
						acc[getIndex][fazenda] += areaTotal;
					} else {
						acc[getIndex][fazenda] = areaTotal;
					}
				}

				return acc;
			}, []);
			setFormatData(formData);
			let filteredFarms = "";
			if (selectedFilter === "Fazenda") {
				filteredFarms = dataToReduce.map((farms) =>
					farms.talhao__fazenda__fazenda__nome.replace(
						selectedFilter,
						""
					)
				);
			} else {
				filteredFarms = dataToReduce.map((farms) =>
					farms.talhao__fazenda__nome.replace(selectedFilter, "")
				);
			}
			setOnlyFarms([...new Set([...filteredFarms])]);
		}
	}, [dataByDay, selectedFilter, filtCult]);

	const theme = {
		// background: "#ffffff",
		text: {
			fontSize: 7,
			fill: colors.textColor[100],
			outlineWidth: 0,
			outlineColor: "transparent"
		},
		axis: {
			domain: {
				line: {
					stroke: "#777777",
					strokeWidth: 1
				}
			},
			legend: {
				text: {
					fontSize: 12,
					fill: "whitesmoke",
					outlineWidth: 0,
					outlineColor: "transparent"
				}
			},
			ticks: {
				line: {
					stroke: "#777777",
					strokeWidth: 1
				},
				text: {
					fontSize: 11,
					fill: colors.textColor[100],
					outlineWidth: 0,
					outlineColor: "transparent"
				}
			}
		},
		grid: {
			line: {
				stroke: "#dddddd",
				strokeWidth: 1
			}
		},
		legends: {
			title: {
				text: {
					fontSize: 11,
					fill: colors.textColor[100],
					outlineWidth: 0,
					outlineColor: "transparent"
				}
			},
			text: {
				fontSize: 11,
				fill: colors.textColor[100],
				outlineWidth: 0,
				outlineColor: "transparent"
			},
			ticks: {
				line: {},
				text: {
					fontSize: 10,
					fill: colors.textColor[100],
					outlineWidth: 0,
					outlineColor: "transparent"
				}
			}
		},
		annotations: {
			text: {
				fontSize: 13,
				fill: colors.textColor[100],
				outlineWidth: 2,
				outlineColor: "#ffffff",
				outlineOpacity: 1
			},
			link: {
				stroke: "#000000",
				strokeWidth: 1,
				outlineWidth: 2,
				outlineColor: "#ffffff",
				outlineOpacity: 1
			},
			outline: {
				stroke: "#000000",
				strokeWidth: 2,
				outlineWidth: 2,
				outlineColor: "#ffffff",
				outlineOpacity: 1
			},
			symbol: {
				fill: "#000000",
				outlineWidth: 2,
				outlineColor: "#ffffff",
				outlineOpacity: 1
			}
		},
		tooltip: {
			container: {
				background: "#ffffff",
				fontSize: 12,
				color: "black"
			},
			basic: {},
			chip: {},
			table: {},
			tableCell: {},
			tableCellValue: {}
		}
	};
	const optFilter = [
		{ title: "Fazenda", opt: "Fazenda" },
		{ title: "Projeto", opt: "Projeto" }
	];

	const handlerFilter = (data) => {
		setSelectedFilter(data);
		setfarmFilter([]);
	};

	const handlerDataChart = (data) => {
		setchartInsideData(formatData);
		const farmFinder = farmFilter.filter((farms) => farms === data.id);
		if (farmFinder.length > 0) {
			setfarmFilter(farmFilter.filter((farms) => farms !== data.id));
		} else {
			setOnlyFarms((prev) => prev.filter((farm) => farm !== data.id));
			setfarmFilter((prev) => [...prev, data.id]);
		}
	};

	useEffect(() => {
		console.log(farmFilter);
		// setchartInsideData(formatData);
		const filtArr = chartInsideData.map((data) => {
			if (farmFilter.length > 0) {
				farmFilter.forEach((farms) => {
					if (data.hasOwnProperty(farms)) {
						delete data[farms];
					} else {
						// console.log("aqui: ", data);
						// console.log("aqui: ", farms);
					}
					// console.log(data.hasOwnProperty(farms));
				});
			}
			return data;
		});
		setchartInsideData(filtArr);
		console.table(formatData);
	}, [farmFilter]);

	if (formatData && onlyFarms) {
		return (
			<Box
				sx={{
					width: "100%",
					minHeight: "300px",
					// backgroundColor: "rgb(208, 209, 213, 0.2)",
					backgroundColor: colors.blueOrigin[700],
					borderRadius: "12px",
					display: "flex",
					justifyContent: "space-between",
					flexDirection: "column",
					alignItems: "center",
					marginTop: "5px",
					// border: "1px solid black",
					gap: "5px"
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignSelf: "self-start",
						padding: "10px",
						justifyContent: "space-between",
						gap: "10px",
						width: "100px"
						// backgroundColor: "red"
					}}
				>
					{optFilter.map((data, i) => {
						return (
							<Box
								onClick={() => handlerFilter(data.title)}
								sx={{
									cursor: "pointer",
									backgroundColor:
										selectedFilter === data.title
											? "white"
											: "black",
									color:
										selectedFilter === data.title
											? "black"
											: "white",
									"&:hover": {
										opacity: "0.7"
									},
									padding: "4px 8px",
									borderRadius: "12px"
								}}
							>
								<Typography
									variant="h6"
									// color={colors.textColor[100]}
								>
									{data.title}
								</Typography>
							</Box>
						);
					})}
				</Box>
				<Box mt={0}>
					<Typography
						variant="h3"
						color={colors.textColor[100]}
						fontWeight={"bold"}
					>
						Plantio diário por {selectedFilter}
					</Typography>
				</Box>
				<Box
					sx={{
						height: "500px",
						width: "100%",
						display: "flex"
					}}
				>
					<ResponsiveBar
						data={formatData}
						keys={onlyFarms}
						indexBy="country"
						margin={{ top: 50, right: 20, bottom: 50, left: 60 }}
						padding={0.3}
						valueScale={{ type: "linear" }}
						indexScale={{ type: "band", round: true }}
						colors={{ scheme: "set3" }}
						theme={theme}
						// enableLabel={false}
						// layout="horizontal"
						defs={[
							{
								id: "dots",
								type: "patternDots",
								background: "inherit",
								color: "#38bcb2",
								size: 4,
								padding: 1,
								stagger: true
							},
							{
								id: "lines",
								type: "patternLines",
								background: "inherit",
								color: "#eed312",
								rotation: -45,
								lineWidth: 9,
								spacing: 10
							}
						]}
						fill={[
							{
								match: {
									id: "fries"
								},
								id: "dots"
							},
							{
								match: {
									id: "sandwich"
								},
								id: "lines"
							}
						]}
						borderColor={{
							from: "color",
							modifiers: [["darker", 1.6]]
						}}
						axisTop={null}
						axisRight={null}
						axisBottom={{
							tickSize: 5,
							tickPadding: 5,
							tickRotation: -35,
							legend: "",
							legendPosition: "middle",
							legendOffset: 32,
							truncateTickAt: 0,
							format: function (value) {
								return value.split("-").reverse().join("/");
							}
						}}
						axisLeft={{
							tickSize: 5,
							tickPadding: 5,
							tickRotation: 0,
							legend: "Hectares",
							legendPosition: "middle",
							legendOffset: -40,
							truncateTickAt: 0
						}}
						labelSkipWidth={12}
						labelSkipHeight={11}
						labelTextColor={{
							from: "color",
							modifiers: [["darker", "3"]]
						}}
						label={(data) => data.value.toFixed(0)}
						legends={[
							{
								dataFrom: "keys",
								anchor: "top",
								direction: "row",
								justify: false,
								translateX: 0,
								translateY: -30,
								itemsSpacing: 20,
								itemWidth: 100,
								itemHeight: 20,
								itemDirection: "left-to-right",
								itemOpacity: 1,
								symbolSize: 10,
								onClick: (data) => {
									handlerDataChart(data);
								},
								effects: [
									{
										on: "hover",
										style: {
											itemOpacity: 0.5
										}
									}
								]
							}
						]}
						role="application"
						ariaLabel="Nivo bar chart demo"
						barAriaLabel={(e) => {
							const text = e.id + " - " + e.value;
							return text;
						}}
					/>
				</Box>
			</Box>
		);
	}
};

export default DailyChartBar;
