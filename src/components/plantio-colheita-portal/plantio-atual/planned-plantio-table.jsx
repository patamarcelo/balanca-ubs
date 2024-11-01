import styles from "./plantio-atual.module.css";
import { useTheme } from "@mui/material";

import { tokens } from "../../../theme";

import moment from 'moment'

const TableComponent = ({ data, onlyFarmsArr, type, dataExec }) => {
    const onlyWeeks = data.map((data) => data.weekRange);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const isLastDateBeforeToday = (dateRange) => {
        const lastDateStr = dateRange.split(' - ')[1]; // Get the last date part
        const lastDate = moment(lastDateStr, 'DD/MM/YYYY'); // Parse date in DD/MM/YYYY format
        return lastDate.isBefore(moment(), 'day'); // Check if it's before today
    };

    const isTodayWithinRange = (dateRange) => {
        const [startDateStr, endDateStr] = dateRange.split(' - '); // Split the range
        const startDate = moment(startDateStr, 'DD/MM/YYYY');
        const endDate = moment(endDateStr, 'DD/MM/YYYY');
        const today = moment();

        return today.isSameOrAfter(startDate, 'day') && today.isSameOrBefore(endDate, 'day');
    };

    const formatNumber = (data) => {
        return data?.toLocaleString("pt-br", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    const totals = data.map((entry) => {
        const totalArea = Object.values(entry.projects).reduce(
            (sum, value) => sum + value,
            0
        );
        return {
            weekRange: entry.weekRange,
            total: parseFloat(totalArea.toFixed(2))
        };
    });

    const totalGeral = totals.reduce((acc, curr) => (acc += curr.total), 0);

    const projectTotals = {};

    data.forEach((entry) => {
        Object.entries(entry.projects).forEach(([project, value]) => {
            if (!projectTotals[project]) {
                projectTotals[project] = 0;
            }
            projectTotals[project] += value;
        });
    });


    const projectTotalsDone = {};

    dataExec?.forEach((entry) => {
        Object.entries(entry.projects).forEach(([project, value]) => {
            if (!projectTotalsDone[project]) {
                projectTotalsDone[project] = 0;
            }
            projectTotalsDone[project] += value;
        });
    });

    const totalExec = dataExec?.reduce((acc, curr) => acc += curr.totalPlanned, 0)

    // -----------------------------------PLANNED TABLE-----------------------------------
    if (type === "planner") {
        return (
            <table className={styles.table}>
                <thead style={{ backgroundColor: colors.blueOrigin[500] }}>
                    <tr>
                        <th style={{ minWidth: "110px", textAlign: "left" }}>
                            {" "}
                            <span style={{ paddingLeft: "5px" }}> Projetos</span>
                        </th>
                        {onlyWeeks.map((project) => (
                            <th style={{ minWidth: "80px" }} key={project}>
                                {project.replace("-", "")}
                            </th>
                        ))}
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody style={{ color: colors.textColor[100] }}>
                    {onlyFarmsArr.map((farms, i) => {
                        return (
                            <tr
                                className={`${i % 2 !== 0 ? styles.oddRow : styles.evenRow} ${theme.palette.mode === "light" &&
                                    i % 2 !== 0 &&
                                    styles.oddRowLight
                                    }`}
                            >
                                <td style={{ textAlign: "left" }}>
                                    {" "}
                                    <span style={{ paddingLeft: "5px" }}>
                                        {farms?.replace("Projeto", "")}
                                    </span>
                                </td>
                                {data.map((dataProj, i) => {
                                    console.log('dataProj', dataProj)
                                    const isBefore = isLastDateBeforeToday(dataProj.weekRange)
                                    const isBetween = isTodayWithinRange(dataProj.weekRange)
                                    const getValue = dataProj.projects[farms]
                                        ? formatNumber(dataProj.projects[farms])
                                        : " - ";
                                    return <td key={i}
                                        style={{
                                            fontWeight: 'bold',
                                            backgroundColor: isBefore
                                            ? 'rgba(161,164,171,0.3)'
                                            : isBetween
                                            ? 'rgba(0,123,255,0.3)' // Example color when today is within the range
                                            : 'transparent' // D
                                        }}
                                        >{getValue}</td>;
                                })}
                                <td style={{ textAlign: "right" }}>
                                    {formatNumber(projectTotals[farms])}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot
                    style={{
                        color: colors.textColor[100],
                        borderTop:
                            theme.palette.mode === "light"
                                ? "black 1px solid"
                                : "whitesmoke 1px solid"
                    }}
                >
                    <tr>
                        <th scope="row" style={{ fontWeight: "bold" }}></th>
                        {totals.map((total, i) => {
                            return (
                                <td style={{ fontWeight: "bold" }} key={i}>
                                    {formatNumber(total.total)}
                                </td>
                            );
                        })}
                        <td style={{ textAlign: "right", fontWeight: "bold" }}>
                            {formatNumber(totalGeral)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        );
    }
    // -----------------------------------PLANNED TABLE-----------------------------------
    // -----------------------------------EXEC TABLE-----------------------------------
    if (type === 'executed') {
        return (
            <table className={styles.table}>
                <thead style={{ backgroundColor: colors.blueOrigin[500] }}>
                    <tr>
                        <th style={{ minWidth: "110px", textAlign: "left" }}>
                            {" "}
                            <span style={{ paddingLeft: "5px" }}> Projetos</span>
                        </th>
                        {onlyWeeks.map((project) => (
                            <th style={{ minWidth: "80px" }} key={project}>
                                {project.replace("-", "")}
                            </th>
                        ))}
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody style={{ color: colors.textColor[100] }}>
                    {onlyFarmsArr.map((farms, i) => {
                        const totalByFarm = projectTotalsDone[farms] ? formatNumber(projectTotalsDone[farms]) : ' - '
                        return (
                            <tr
                                className={`${i % 2 !== 0 ? styles.oddRow : styles.evenRow} ${theme.palette.mode === "light" &&
                                    i % 2 !== 0 &&
                                    styles.oddRowLight
                                    }`}
                            >
                                <td style={{ textAlign: "left" }}>
                                    {" "}
                                    <span style={{ paddingLeft: "5px" }}>
                                        {farms?.replace("Projeto", "")}
                                    </span>
                                </td>
                                {data.map((dataProj, i) => {
                                    const getValuePlanned = dataProj.projects[farms]
                                        ? formatNumber(dataProj.projects[farms])
                                        : " - ";
                                    const getValue = dataExec.find((data) => data.weekRange === dataProj.weekRange);
                                    let valueByFarm = " - "
                                    if (getValue) {
                                        valueByFarm = getValue.projects[farms] ? formatNumber(getValue.projects[farms]) : ' - '

                                        const defineColor = () => {
                                            if (getValuePlanned === "") {
                                                return colors.textColor[100]
                                            }
                                            if (getValue?.projects[farms] > dataProj?.projects[farms]) {
                                                return colors.greenAccent[400]
                                            }
                                            if (getValue?.projects[farms] < dataProj?.projects[farms]) {
                                                return 'red'
                                            }
                                            return ''
                                        }

                                        return <td key={i}><span style={{ color: defineColor() }}>{valueByFarm}</span>{getValuePlanned && " / " + getValuePlanned}</td>;
                                    } else {
                                        return <td key={i}>-</td>;
                                    }
                                })}
                                <td style={{ textAlign: "right" }}>
                                    {totalByFarm}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot
                    style={{
                        color: colors.textColor[100],
                        borderTop:
                            theme.palette.mode === "light"
                                ? "black 1px solid"
                                : "whitesmoke 1px solid"
                    }}
                >
                    <tr>
                        <th scope="row" style={{ fontWeight: "bold" }}></th>
                        {data.map((dataProj, i) => {
                            const getValue = dataExec.find((data) => data.weekRange === dataProj.weekRange);
                            let valueByFarm = " - "
                            if (getValue) {
                                valueByFarm = getValue.totalPlanned ? formatNumber(getValue.totalPlanned) : ' - '
                            }
                            return <td key={i} style={{ fontWeight: 'bold' }}>{valueByFarm}</td>;
                        })}
                        <td style={{ textAlign: "right", fontWeight: "bold" }}>
                            {formatNumber(totalExec)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        )
    }
    // -----------------------------------EXEC TABLE-----------------------------------
};

export default TableComponent;
