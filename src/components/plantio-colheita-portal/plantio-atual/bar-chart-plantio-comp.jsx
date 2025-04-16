import { ResponsiveBar } from '@nivo/bar';
import { Box, useTheme } from '@mui/material';
import "./bar-chart.css"
import { tokens } from '../../../theme';
import moment from 'moment';


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

    const isTodayWithinRange = (dateRange) => {
        const [startDateStr, endDateStr] = dateRange.split(' - '); // Split the range
        const startDate = moment(startDateStr, 'DD/MM/YYYY');
        const endDate = moment(endDateStr, 'DD/MM/YYYY');
        const today = moment();
    
        return today.isSameOrAfter(startDate, 'day') && today.isSameOrBefore(endDate, 'day');
    };


    return (

        <Box sx={{ height: '400px', minWidth: '1581px', width: "100%" }}>

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
                    renderTick: (tick) => {
                        const isHighlighted = isTodayWithinRange(tick.value);
                        return (
                            <g transform={`translate(${tick.x},${tick.y + 15})`}>
                                <text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                        fill: isHighlighted ? 'rgba(0,123,255,1)' : colors.textColor[100] ,
                                        backgroundColor: isHighlighted ? 'rgba(0,123,255,1)' : 'transparent',
                                        padding: isHighlighted ? '4px 8px' : '0',
                                        borderRadius: isHighlighted ? '4px' : '0'
                                    }}
                                    textAnchor="middle"
                                >
                                    {tick.value.split(" - ")[0]}
                                </text>
                            </g>
                        );
                    },
                    format: (value) => {
                        // Split the date range into two parts
                        const [startDate, endDate] = value.split(" - ");
                        return `${startDate}`; // Format with a space, we will handle line-break in CSS
                    }
                }}
                theme={{
                    // background: '#ffffff', // Custom background color for the chart area
                    legends:{
                        title:{
                            fill: colors.textColor[100],
                        },
                        text:{
                            fill: colors.textColor[100],
                            fontSize: 12,
                            fontWeight: 'bold',  // Makes bar labels bold
                        }
                    },
                    axis: {
                        domain: {
                            line: {
                                stroke: '#777777',
                                strokeWidth: 1,
                            },
                        },
                        ticks: {
                            line: {
                                stroke: '#777777',
                                strokeWidth: 1,
                            },
                            text: {
                                fill: colors.textColor[100],
                                fontSize: 12,
                            },
                        },
                        legend: {
                            text: {
                                fill: colors.textColor[100],
                                fontWeight: 'bold',
                                fontSize: 14
                            },
                        },
                    },
                    tooltip: {
                        container: {
                            background: '#333333', // Tooltip background color
                            color: '#ffffff', // Tooltip text color
                            fontSize: '14px',
                            borderRadius: '4px',
                            boxShadow: '0 3px 9px rgba(0, 0, 0, 0.5)',
                            padding: '10px',
                        },
                    },
                    labels: {
                        text: {
                            // fontSize: 10,
                            // fontWeight: 'bold',  // Makes bar labels bold
                            fill: 'black'
                        }
                    },
                    grid: {
                        line: {
                            stroke: '#dddddd', // Grid line color
                        },
                    },
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
                colors={({ id }) => (id === 'Planejado' ? 'rgb(233,217,164)' : colors.greenAccent[700])} // Custom colors for each key
                // labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'top',
                        direction: 'row',
                        justify: false,
                        translateX: -650,
                        translateY: 310,
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
                tooltip={({ id, value, indexValue, color }) => (
                    <div
                        style={{
                            padding: '12px',
                            background: '#222',
                            color: '#fff',
                            borderRadius: '5px',
                        }}
                    >
                        <strong>{id}:</strong> {formatNumber(value)} ha<br />
                        <strong>Semana:</strong> {indexValue}
                    </div>
                )}
            />
        </Box>
    )
};

export default BarPlantioPlanner
