import styles from "./plantio-atual.module.css";
import { useTheme } from "@mui/material";

import { tokens } from "../../../theme";

const TableComponent = ({ data, onlyFarmsArr, type, dataExec }) => {
    const onlyWeeks = data.map((data) => data.weekRange);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const formatNumber = (data) => {
        return data.toLocaleString("pt-br", {
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
    console.log('data to check project', data)

    const totalExec = dataExec?.reduce((acc, curr) => acc += curr.totalPlanned, 0)
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
                        <th>Total Geral</th>
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
                                    const getValue = dataProj.projects[farms]
                                        ? formatNumber(dataProj.projects[farms])
                                        : " - ";
                                    return <td key={i}>{getValue}</td>;
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
                        {totals.map((total) => {
                            return (
                                <td style={{ fontWeight: "bold" }}>
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
    if (type === 'executed') {
        console.log('executed arr', dataExec)
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
                        <th>Total Geral</th>
                    </tr>
                </thead>

                <tbody style={{ color: colors.textColor[100] }}>
                    {onlyFarmsArr.map((farms, i) => {
                        const totalByFarm = projectTotalsDone[farms] ? projectTotalsDone[farms] : ' - '
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
                                    const getValue = dataExec.find((data) => data.weekRange === dataProj.weekRange);
                                    console.log('getValuehere', getValue)
                                    let valueByFarm = " - "
                                    if(getValue){
                                        valueByFarm = getValue.projects[farms] ? getValue.projects[farms] : ' - '
                                    }
                                    return <td key={i}>{valueByFarm}</td>;
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
                                    console.log('getValuehere', getValue)
                                    let valueByFarm = " - "
                                    if(getValue){
                                        valueByFarm = getValue.totalPlanned ? getValue.totalPlanned : ' - '
                                    }
                                    return <td key={i}>{valueByFarm}</td>;
                                })}
                        <td style={{ textAlign: "right", fontWeight: "bold" }}>
                            {formatNumber(totalExec)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        )
    }
};

export default TableComponent;
