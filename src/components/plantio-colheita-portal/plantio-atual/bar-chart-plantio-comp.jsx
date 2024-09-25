import { ResponsiveBar } from '@nivo/bar';
import { Box, useTheme } from '@mui/material';
import "./bar-chart.css"
import { tokens } from '../../../theme';


const BarPlantioPlanner = ({ data }) => {


    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const formatNumber = (data) => {
        return data.toLocaleString(
            "pt-br",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    }
    const formatNumberNoDecimal = (data) => {
        return data.toLocaleString(
            "pt-br",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        )
    }


    return (

        <Box sx={{ height: '400px', minWidth: '1360px', width: "100%" }}>

            <ResponsiveBar
                data={data}
                keys={['Planejado', 'Realizado']}
                indexBy="week"
                margin={{ top: 50, right: 20, bottom: 80, left: 100 }} // Adjust bottom margin for rotated labels
                padding={0.2}
                groupMode="grouped" // This ensures the bars are grouped side by side
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    // tickRotation: 45, // Rotate the week range labels by 45º
                    legend: 'Semanal',
                    legendPosition: 'middle',
                    legendOffset: 60, // Adjust offset due to the rotation
                    format: (value) => {
                        // Split the date range into two parts
                        const [startDate, endDate] = value.split(" - ");
                        return `${startDate}`; // Format with a space, we will handle line-break in CSS
                    }
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Area (ha)',
                    legendPosition: 'middle',
                    legendOffset: -60,
                    format: (value) => {
                        // Split the date range into two parts
                        return formatNumberNoDecimal(value)
                    }
                }}
                label={(d) => `${formatNumberNoDecimal(d.value)}`}
                // colors={{ scheme: 'nivo' }} // Or you can customize your own color scheme
                labelSkipWidth={12}
                labelSkipHeight={1}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                colors={({ id }) => (id === 'Planejado' ? 'rgb(233,217,164)' : colors.greenAccent[700] )} // Custom colors for each key
                // labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'top',
                        direction: 'row',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1,
                                }
                            }
                        ]
                    }
                ]}
            />
        </Box>
    )
};

export default BarPlantioPlanner
