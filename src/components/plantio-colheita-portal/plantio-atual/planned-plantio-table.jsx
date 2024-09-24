import styles from './plantio-atual.module.css'
import { useTheme } from '@mui/material';

import { tokens } from '../../../theme';

const TableComponent = ({ data, onlyFarmsArr }) => {
    const onlyWeeks = data.map((data) => data.weekRange)
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

    const totals = data.map(entry => {
        const totalArea = Object.values(entry.projects).reduce((sum, value) => sum + value, 0);
        return { weekRange: entry.weekRange, total: parseFloat(totalArea.toFixed(2)) };
    });

    const totalGeral = totals.reduce((acc, curr) => acc += curr.total, 0)

    const projectTotals = {};

    data.forEach(entry => {
        Object.entries(entry.projects).forEach(([project, value]) => {
            if (!projectTotals[project]) {
                projectTotals[project] = 0;
            }
            projectTotals[project] += value;
        });
    });

    return (
        <table className={styles.table}>
            <thead style={{ backgroundColor: colors.blueOrigin[500] }}>
                <tr>
                    <th style={{ minWidth: '110px' }}>Planejamento Plantio</th>
                    {onlyWeeks.map((project) => (
                        <th  style={{minWidth: '80px'}} key={project}>{project.replace('-', '')}</th>
                    ))}
                    <th>Total Geral</th>
                </tr>
            </thead>
            <tbody>
                {
                    onlyFarmsArr.map((farms) => {
                        return (
                            <tr>
                                <td>{farms?.replace('Projeto', '')}</td>
                                {data.map((dataProj, i) => {
                                    const getValue = dataProj.projects[farms] ? formatNumber(dataProj.projects[farms]) : ' - '
                                    return (
                                        <td key={i}>{getValue}</td>
                                    )
                                })}
                                <td style={{textAlign: 'right'}}>{formatNumber(projectTotals[farms])}</td>
                            </tr>
                        )
                    })

                }
            </tbody>
            <tfoot>
                <tr>
                    <th scope="row" style={{ fontWeight: 'bold' }}>Totais</th>
                    {
                        totals.map((total) => {
                            return (
                                <td style={{ fontWeight: 'bold' }}>{formatNumber(total.total)}</td>
                            )
                        })
                    }
                    <td>{formatNumber(totalGeral)}</td>
                </tr>

            </tfoot>
        </table>
    )
};

export default TableComponent

