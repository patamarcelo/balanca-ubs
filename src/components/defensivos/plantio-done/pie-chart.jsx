// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/pie
import { ResponsivePie } from "@nivo/pie";
import { Box } from "@mui/material";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

// const data = [
// 	{
// 		id: "javascript",
// 		label: "javascript",
// 		value: 541,
// 		color: "hsl(123, 70%, 50%)"
// 	},

// 	{
// 		id: "python",
// 		label: "python",
// 		value: 35,
// 		color: "hsl(258, 70%, 50%)"
// 	}
// ];
// const MyResponsivePie = ({ data /* see data tab */ }) => (
const margin = { top: 30, right: 200, bottom: 40, left: 199 };

const MyResponsivePie = (props) => {
	const { colors, data } = props;
	const getPercent = data.filter((data) => data.label === "Plantado")[0]
		.percen;
	const formatPercent = `${parseFloat(getPercent).toLocaleString("pt-br", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})}%`;
	return (
		<Box
			sx={{
				width: "100%",
				height: "450px",
				textAlign: "center",
				position: "relative"
			}}
		>
			<ResponsivePie
				data={data}
				color={{ scheme: "nvio" }}
				margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
				innerRadius={0.35}
				padAngle={2}
				cornerRadius={3}
				activeOuterRadiusOffset={8}
				borderWidth={1}
				borderColor={{
					from: "color",
					modifiers: [["darker", 0.2]]
				}}
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
					modifiers: [["darker", 3]]
				}}
				tooltip={(point) => {
					const val = parseFloat(point.datum.value).toLocaleString(
						"pt-br",
						{
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						}
					);
					const getPercent = data.filter(
						(data) => data.label === point.datum.label
					)[0].percen;
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
							<p>{val} Ha</p>
							<p>
								{getPercent.toLocaleString("pt-br", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}{" "}
								%
							</p>
						</div>
					);
				}}
				defs={[
					{
						id: "dots",
						type: "patternDots",
						background: "hsl(123, 70%, 50%)",
						color: "rgba(255, 255, 255, 0.5)",
						size: 0.1,
						padding: 1,
						stagger: true
					},
					{
						id: "lines",
						type: "patternDots",
						background: "inherit",
						color: "rgba(255, 255, 255, 0.1)",
						rotation: -45,
						lineWidth: 6,
						spacing: 10
					}
				]}
				fill={[
					{
						match: {
							id: "Plantado"
						},
						id: "dots"
					}
					// {
					// 	match: {
					// 		id: "Aberto"
					// 	},
					// 	id: "lines"
					// }
				]}
				// legends={[
				// 	{
				// 		anchor: "bottom",
				// 		direction: "row",
				// 		justify: false,
				// 		translateX: 0,
				// 		translateY: 56,
				// 		itemsSpacing: 0,
				// 		itemWidth: 100,
				// 		itemHeight: 18,
				// 		itemTextColor: colors.primary[900],
				// 		itemDirection: "left-to-right",
				// 		itemOpacity: 1,
				// 		symbolSize: 18,
				// 		symbolShape: "circle",
				// 		effects: [
				// 			{
				// 				on: "hover",
				// 				style: {
				// 					itemTextColor: colors.primary[800]
				// 				}
				// 			}
				// 		]
				// 	}
				// ]}
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
				<p>{formatPercent}</p>
			</Box>
		</Box>
	);
};
export default MyResponsivePie;
