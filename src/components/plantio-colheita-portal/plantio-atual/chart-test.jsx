import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const data = [
    { date: '10/09', planned: 404, actual: 380 },
    { date: '17/09', planned: 379, actual: 350 },
    { date: '24/09', planned: 322, actual: 322 },
    { date: '01/10', planned: 346, actual: 340 },
];

const MyBarChart = () => (
    <div style={{ height: '400px', width: '800px' }}>
        <ResponsiveBar
            data={data}
            keys={['planned', 'actual']}
            indexBy="date"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            colors={{ scheme: 'nivo' }} // You can customize colors
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Date',
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Area',
                legendPosition: 'middle',
                legendOffset: -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        />
    </div>
);

export default MyBarChart;