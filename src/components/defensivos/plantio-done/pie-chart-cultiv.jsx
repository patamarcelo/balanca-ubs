// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/sunburst
import { ResponsivePie } from "@nivo/pie";
import { Box } from "@mui/material";

import { useState, useEffect } from "react";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveChartVars = (props) => {
	const margin = { top: 30, right: 200, bottom: 40, left: 199 };
	const { colors, data, setFiltCult, cultFilt } = props;

	const [chartData, setChartData] = useState([]);
	const [colorArr, setColorArr] = useState([]);

	useEffect(() => {
		const newData = data.map((data) => {
			return {
				id: data.id,
				label: data.id,
				value: data.area,
				cultura: data.cultura
			};
		});
		setChartData(newData);
	}, []);

	useEffect(() => {
		if (cultFilt === "Todas") {
			const newData = data.map((data) => {
				return {
					id: data.id,
					label: data.id,
					value: data.area,
					cultura: data.cultura
				};
			});
			setChartData(newData);
			return;
		}
		if (cultFilt) {
			const newData = data
				.filter((data) => data.cultura === cultFilt)
				.map((data) => {
					return {
						id: data.id,
						label: data.id,
						value: data.area,
						cultura: data.cultura
					};
				});
			setChartData(newData);
		}
	}, [cultFilt]);

	useEffect(() => {
		const colorA = data.map((data) => {
			return {
				match: {
					id: data.id
				},
				id: data.cultura
			};
		});
		setColorArr(colorA);
	}, []);

	useEffect(() => {
		const filtCult = data.map((data) => data.cultura);
		const Add = [...filtCult, "Todas"];
		setFiltCult([...new Set(Add)]);
	}, []);

	return (
		<Box
			sx={{
				width: "100%",
				height: "450px",
				textAlign: "center",
				position: "relative"
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-evenly",
					width: "100%",
					justifySelf: "center",
					alignSelf: "center",
					textAlign: "center",
					position: "absolute",
					top: 20
				}}
			></Box>
			<ResponsivePie
				data={chartData}
				color={{ scheme: "nvio" }}
				margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
				innerRadius={0.35}
				padAngle={2}
				cornerRadius={3}
				activeOuterRadiusOffset={8}
				borderWidth={1}
				borderColor={"black"}
				arcLinkLabelsSkipAngle={10}
				//labelColor
				arcLinkLabelsTextColor={colors.textColor[100]}
				arcLinkLabelsThickness={2}
				arcLinkLabelsColor={{ from: "color" }}
				enableArcLabels={true}
				arcLabelsSkipAngle={10}
				arcLabel={(d) =>
					parseFloat(d.value).toLocaleString("pt-br", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})
				}
				arcLabelsTextColor={{
					from: "white",
					modifiers: [["darker", 1]]
				}}
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
							<p>{point.datum.label}</p>
							<p>
								{parseFloat(point.datum.value).toLocaleString(
									"pt-br",
									{
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									}
								)}
							</p>
						</div>
					);
				}}
				defs={[
					{
						id: "Feijão",
						type: "patternDots",
						background: "rgb(119,63,27)",
						color: "rgba(255, 255, 255, 0.5)",
						size: 0.1,
						padding: 1,
						stagger: true
					},
					{
						id: "Soja",
						type: "patternDots",
						background: "#33CD32",
						color: "rgba(255, 255, 255, 0.5)",
						size: 0.1,
						padding: 1,
						stagger: true
					},
					{
						id: "Arroz",
						type: "patternDots",
						background: "#FBBF70",
						color: "rgba(255, 255, 255, 0.5)",
						size: 0.1,
						padding: 1,
						stagger: true
					}
				]}
				fill={colorArr}
			/>
			<Box
				sx={{
					position: "absolute",
					top: 0,
					right: margin.right,
					left: margin.left,
					bottom: margin.bottom,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					fontSize: 17,
					// background: "#FFFFFF33",
					textAlign: "center",
					// This is important to preserve the chart interactivity
					pointerEvents: "none",
					fontWeight: "bold",
					color: colors.textColor[100]
				}}
			>
				<p>
					{chartData
						.reduce((acc, curr) => acc + curr.value, 0)
						.toLocaleString("pt-br", {
							minimumFractionDigits: 0,
							maximumFractionDigits: 0
						})}
				</p>
			</Box>
		</Box>
	);
};
export default MyResponsiveChartVars;
