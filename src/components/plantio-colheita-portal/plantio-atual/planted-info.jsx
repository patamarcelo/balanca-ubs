import { Box, Typography, useTheme } from '@mui/material'
import { tokens } from '../../../theme';

import Paper from '@mui/material/Paper';

import { ResponsiveBar } from '@nivo/bar';

import { Gauge } from '@mui/x-charts/Gauge';




const TotalCOmp = (props) => {
    const { totalsSet } = props;
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    const formatNumber = (data) => {
        return data.toLocaleString(
            "pt-br",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        )
    }


    const data = [
        {
            category: 'Projetado',
            value: totalsSet['projetado'].toFixed(0)
        },
        {
            category: 'Planejado',
            value: totalsSet['planejado'].toFixed(0)
        },
        {
            category: 'Plantado',
            value: totalsSet['plantado'].toFixed(0)
        },
    ];


    return (
        <Paper elevation={8}
            sx={{
                width: '100%',
                padding: '20px',
                paddingBottom: '0px'
            }}
        >

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    width: '100%'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '30px',
                    }}
                >
                    <Typography variant="h6" color={colors.textColor[100]}
                        sx={{
                            backgroundColor: 'rgb(233,217,164,0.3)',
                            padding: '2px 10px',
                            borderBottom: `1px solid ${colors.textColor[100]}`
                        }}
                    >
                        <b>Planejado: </b>{formatNumber(totalsSet['planejado'])}
                    </Typography>
                    {/* <Box>
                    <Gauge width={40} height={40} value={60} startAngle={-90} endAngle={90} />
                    </Box> */}
                    <Typography variant="h6" color={colors.textColor[100]}
                        sx={{
                            backgroundColor: colors.greenAccent[700],
                            padding: '2px 10px',
                            borderBottom: `1px solid ${colors.textColor[100]}`
                        }}
                    >
                        <b>Plantado: </b>{formatNumber(totalsSet['plantado'])}
                    </Typography>
                    <Typography variant="h6" color={colors.textColor[100]}
                        sx={{
                            backgroundColor: colors.primary[900],
                            padding: '2px 10px',
                            borderBottom: `1px solid ${colors.textColor[100]}`
                        }}
                    >
                        <b>Projetado: </b>{formatNumber(totalsSet['projetado'])}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        height: '200px',
                        width: '100%',
                    }}
                >
                    <ResponsiveBar
                        data={data}
                        keys={['value']}
                        indexBy="category"
                        margin={{ top: 20, right: 20, bottom: 50, left: 72 }}
                        layout="horizontal"
                        padding={0.3}
                        colors={({ id, data }) => (data.category === 'Planejado' ? 'rgb(233,217,164)' : data.category === 'Projetado' ? "#d0d1d5" : colors.greenAccent[700])}
                        label={(d) => `${formatNumber(d.value)}`}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 10,
                            tickRotation: 0,
                            legend: '',
                            legendPosition: 'middle',
                            legendOffset: -40
                        }}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: '',
                            legendPosition: 'middle',
                            legendOffset: 40,
                            format: (value) => {
                                return `${formatNumber(value)}`
                            }
                        }}
                        // Custom theme to make axis legends bold
                        // Custom theme to make axis labels bold
                        theme={{
                            axis: {
                                ticks: {
                                    text: {
                                        fontSize: 12,
                                        fontWeight: 'bold'  // Makes axis labels bold
                                    }
                                },
                                legend: {
                                    text: {
                                        fontSize: 12,
                                        fontWeight: 'bold',  // Makes axis legend bold
                                        fill: 'red'
                                    }
                                }
                            },
                            labels: {
                                text: {
                                    fontSize: 14,
                                    fontWeight: 'bold',  // Makes bar labels bold
                                    fill: 'red'
                                }
                            }
                        }}
                        maxValue={16000}  // Set the maximum value for the bars
                        enableGridX={true}
                        enableGridY={false}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor={'black'} // Set the color of the text inside the bars
                        // labelTextColor={colors.textColor[100]} // Set the color of the text inside the bars
                        // labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    />
                </Box>

            </Box>
        </Paper>
    );
}

export default TotalCOmp;