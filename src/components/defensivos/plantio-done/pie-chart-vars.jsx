// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/sunburst
import { ResponsivePie } from "@nivo/pie";
import { Box } from "@mui/material";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveSunburst = (props) => {
	const margin = { top: 30, right: 200, bottom: 40, left: 199 };
	const { colors, data } = props;
	const total = data.reduce((acc, curr) => acc + curr.value, 0);
	return (
		<Box
			sx={{
				width: "100%",
				height: "400px",
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
				borderColor={"black"}
				arcLinkLabelsSkipAngle={10}
				//labelColor
				arcLinkLabelsTextColor={colors.textColor[100]}
				arcLinkLabelsThickness={2}
				arcLinkLabelsColor={{ from: "color" }}
				enableArcLabels={true}
				arcLabelsSkipAngle={10}
				arcLabelsTextColor={(data) =>
					data.label.split("-")[0].trim() === "Feijão"
						? "white"
						: "black"
				}
				arcLabel={(d) =>
					parseFloat(d.value).toLocaleString("pt-br", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})
				}
				// arcLabelsTextColor={{
				// 	from: "white",
				// 	modifiers: [["darker", 1]]
				// }}
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
				fill={[
					{
						match: {
							id: "Feijão"
						},
						id: "Feijão"
					},
					{
						match: {
							id: "Soja"
						},
						id: "Soja"
					},
					{
						match: {
							id: "Arroz"
						},
						id: "Arroz"
					}
				]}
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
					{total.toLocaleString("pt-br", {
						minimumFractionDigits: 0,
						maximumFractionDigits: 0
					})}
				</p>
			</Box>
		</Box>
	);
};
export default MyResponsiveSunburst;
