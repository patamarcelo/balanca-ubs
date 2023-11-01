// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bar
import { ResponsiveBar } from "@nivo/bar";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";

const colorObj = {
	Arroz: "#FBBF70",
	Feijão: "rgb(119,63,27)",
	Soja: "#33CD32"
};

const MyResponsiveBar = (props) => {
	const { colors, dataChart, filtCult } = props;
	const [onlyPlanted, setOnlyPlanted] = useState([]);
	const [dataChartFilt, setdataChartFilt] = useState([]);
	// const [filtCultR, setFiltCultR] = useState([]);

	useEffect(() => {
		const filtArr = dataChart.filter((data) => data.status === "plantado");
		setOnlyPlanted(filtArr);
	}, [dataChart]);

	useEffect(() => {
		const chartFiltArr = onlyPlanted.reduce((acc, curr) => {
			if (
				acc.filter(
					(data) =>
						data.fazenda.replace("Projeto", "") ===
						curr.fazenda.replace("Projeto", "")
				).length === 0
			) {
				const name = curr.cultura;
				const objToAdd = {
					fazenda: curr.fazenda.replace("Projeto", ""),
					country: curr.fazenda.replace("Projeto", ""),
					status: curr.status
				};
				const nameColor = `${curr.cultura}Color`;
				objToAdd[nameColor] = colorObj[curr.cultura];
				objToAdd[name] = curr.area.toFixed(2);
				acc.push(objToAdd);
			} else {
				const findIndexOf = (e) =>
					e.fazenda.replace("Projeto", "") ===
					curr.fazenda.replace("Projeto", "");
				const getIndex = acc.findIndex(findIndexOf);
				acc[getIndex][curr.cultura] = curr.area;
				const nameColor = `${curr.cultura}Color`;
				acc[getIndex][nameColor] = colorObj[curr.cultura];
			}
			return acc;
		}, []);
		const sortedArr = chartFiltArr.sort((a, b) =>
			a.fazenda.localeCompare(b.fazenda)
		);
		setdataChartFilt(sortedArr);
	}, [onlyPlanted]);

	const theme = {
		// background: "#ffffff",
		text: {
			fontSize: 11,
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
				fontSize: 12
			},
			basic: {},
			chip: {},
			table: {},
			tableCell: {},
			tableCellValue: {}
		}
	};
	return (
		<Box
			sx={{
				width: "100%",
				height: "400px"
				// paddingLeft: "40px"
			}}
		>
			<ResponsiveBar
				data={dataChartFilt}
				keys={filtCult.slice(1)}
				indexBy="country"
				margin={{ top: 50, right: 100, bottom: 50, left: 100 }}
				padding={0.3}
				valueScale={{ type: "linear" }}
				indexScale={{ type: "band", round: true }}
				// colors={{ scheme: "nivo" }}
				theme={theme}
				// colorBy="index"
				colors={({ id, data }) => data[`${id}Color`]}
				valueFormat=" >-0,.2~f"
				borderColor={{
					from: "color",
					modifiers: [["darker", 1.6]]
				}}
				axisTop={null}
				axisRight={null}
				axisBottom={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: "Projetos",
					legendPosition: "middle",
					legendOffset: 32
				}}
				axisLeft={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: "Area em Hectare",
					legendPosition: "middle",
					legendOffset: -80,
					format: function (value) {
						return value.toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						});
					}
				}}
				labelSkipWidth={0}
				labelTextColor={"white"}
				// legends={[]}
				legends={[
					{
						dataFrom: "keys",
						anchor: "bottom-right",
						direction: "column",
						justify: false,
						translateX: 120,
						translateY: 0,
						itemsSpacing: 2,
						itemWidth: 100,
						itemHeight: 20,
						itemDirection: "left-to-right",
						itemOpacity: 0.85,
						symbolSize: 20,
						effects: [
							{
								on: "hover",
								style: {
									itemOpacity: 1
								}
							}
						]
					}
				]}
				role="application"
				ariaLabel="Projetos"
				barAriaLabel={(e) =>
					e.id +
					": " +
					e.formattedValue +
					" in country: " +
					e.indexValue
				}
				tooltip={(point) => {
					return (
						<div
							style={{
								fontSize: "12px",
								backgroundColor: colors.primary[900],
								color: "whitesmoke",
								padding: "10px",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center"
							}}
						>
							<p>{point.data.fazenda}</p>
							<p>{point.id}</p>
							<p>
								{point.value.toLocaleString("pt-br", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}
							</p>
						</div>
					);
				}}
			/>
		</Box>
	);
};

export default MyResponsiveBar;
