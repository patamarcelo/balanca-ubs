import moment from 'moment';

const dataToUse = (finalizadoPlantio, dataPlantio, dataPrevista) => {
    if (finalizadoPlantio) {
        return dataPlantio
    }
    return moment(dataPrevista).isBefore(moment(), 'day') ? moment().format('YYYY-MM-DD') : dataPrevista;
}

const getColheitaDate = (plantioDate, cicle) => {
    const startDate = moment(plantioDate); // Starting date
    const newDate = startDate.add(cicle, 'days'); // Add 5 days
    const formatDate = newDate.format('YYYY-MM-DD'); // Output: '2024-10-06'
    return formatDate
}

export const dataPlannerHandler = (qs_planned_orig, plantioView = true) => {
    const qs_planned = qs_planned_orig.map((data) => {
        const newDateHere = dataToUse(data.finalizado_plantio, data.data_plantio, data.data_prevista_plantio)
        const colheitaDate = getColheitaDate(newDateHere, data.variedade__dias_ciclo)
        return ({
            ...data,
            newDate: newDateHere,
            colheitaDate: colheitaDate
        })
    }).sort(
        (a, b) => plantioView ? new Date(a.newDate) - new Date(b.newDate) : new Date(a.colheitaDate) - new Date(b.colheitaDate)
            
    );

    console.log(qs_planned)
    // Get the earliest date and calculate the start of that week (Sunday to Saturday)
    let earliestDate = ''
    if(plantioView){
        earliestDate = new Date(qs_planned[0].data_prevista_plantio);
    } else {
        earliestDate = new Date(qs_planned[0].data_prevista_plantio);
    }
    const weekStart = new Date(
        earliestDate.setDate(earliestDate.getDate() - earliestDate.getDay())
    ); // Start of the week

    // Step 2: Group data by weeks
    const weekRangesPlantio = [
        // "15/09/2024 - 21/09/2024",
        // "22/09/2024 - 28/09/2024",
        // "29/09/2024 - 05/10/2024",
        "06/10/2024 - 12/10/2024",
        "13/10/2024 - 19/10/2024",
        "20/10/2024 - 26/10/2024",
        "27/10/2024 - 02/11/2024",
        "03/11/2024 - 09/11/2024",
        "10/11/2024 - 16/11/2024",
        "17/11/2024 - 23/11/2024",
        "24/11/2024 - 30/11/2024",
        "01/12/2024 - 07/12/2024",
        "08/12/2024 - 14/12/2024",
        "15/12/2024 - 21/12/2024",
        "22/12/2024 - 28/12/2024",
        "29/12/2024 - 04/01/2025",
        "05/01/2025 - 11/01/2025",
        "12/01/2025 - 18/01/2025",
        "19/01/2025 - 25/01/2025",
        "26/01/2025 - 01/02/2025",
        "02/02/2025 - 08/02/2025"

    ];
    const weekRangesColheita = [
        // "12/01/2025 - 18/01/2025",
        "19/01/2025 - 25/01/2025",
        "26/01/2025 - 01/02/2025",
        "02/02/2025 - 08/02/2025",
        "09/02/2025 - 15/02/2025",
        "16/02/2025 - 22/02/2025",
        "23/02/2025 - 01/03/2025",
        "02/03/2025 - 08/03/2025",
        "09/03/2025 - 15/03/2025",
        "16/03/2025 - 22/03/2025",
        "23/03/2025 - 29/03/2025",
        "30/03/2025 - 05/04/2025",
        "06/04/2025 - 12/04/2025",
        "13/04/2025 - 19/04/2025",
        "20/04/2025 - 26/04/2025",
        "27/04/2025 - 03/05/2025",
        "04/05/2025 - 10/05/2025",
        "11/05/2025 - 17/05/2025",
        "18/05/2025 - 24/05/2025",
        "25/05/2025 - 31/05/2025",
        "01/06/2025 - 07/06/2025",
        // "08/06/2025 - 15/06/2025",
        // "16/06/2025 - 22/06/2025",
        // "23/06/2025 - 29/06/2025",
    ];

    const weekRanges = plantioView ? weekRangesPlantio : weekRangesColheita

    const groupByWeeks = qs_planned.reduce((acc, entry) => {
        let newDate = ''
        if(plantioView){
            newDate = dataToUse(entry.finalizado_plantio, entry.data_plantio, entry.data_prevista_plantio)
        } else {
            const getInit = dataToUse(entry.finalizado_plantio, entry.data_plantio, entry.data_prevista_plantio)
            newDate = getColheitaDate(getInit, entry.variedade__dias_ciclo)

        }
        const entryDate = moment(newDate)
        entryDate.add(1, 'days')


        // Find the week difference from the start of the first week
        const weekDiff = Math.floor(
            (entryDate - weekStart) / (7 * 24 * 60 * 60 * 1000)
        ); // Convert ms to weeks

        const weekStartDate = new Date(weekStart);
        weekStartDate.setDate(weekStartDate.getDate() + weekDiff * 7);

        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6); // End of the week (Saturday)

        const weekRange = `${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()}`;


        // Group by week range
        if (!acc[weekRange]) {
            acc[weekRange] = [];
        }
        acc[weekRange].push(entry);
        return acc;
    }, {});
    const result = weekRanges.reduce((acc, range) => {
        if (!groupByWeeks[range]) {
            acc[range] = []; // Initialize empty array for weeks with no data
        } else {
            acc[range] = groupByWeeks[range];
        }
        return acc;
    }, {});
    // Step 3: Sum areas by week and project name
    const summedByWeekAndProject = Object.entries(
        result
    ).map(([weekRange, entries]) => {
        const projectSums = entries.reduce((projectAcc, entry) => {
            const projectName = entry.talhao__fazenda__nome;
            if (!projectAcc[projectName]) {
                projectAcc[projectName] = 0;
            }
            projectAcc[projectName] += entry.area_planejamento_plantio;
            return projectAcc;
        }, {});
        const totalPlanned = entries.reduce((acc, curr) => {
            acc += curr.area_planejamento_plantio
            return acc
        }, 0)
        return { weekRange, totalPlanned: totalPlanned, projects: projectSums };
    });

    return summedByWeekAndProject;
};
export const dataPlannerHandlerBarChart = (qs_planned_orig, plantioView = true) => {
    const qs_planned = qs_planned_orig.map((data) => {
        
        const newDateHere = dataToUse(data.finalizado_plantio, data.data_plantio, data.data_prevista_plantio)
        const colheitaDate = getColheitaDate(newDateHere, data.variedade__dias_ciclo)
        return ({
            ...data,
            newDate: newDateHere,
            colheitaDate: colheitaDate
        })
    }).sort(
        (a, b) => new Date(a.data_prevista_plantio) - new Date(b.data_prevista_plantio) 
            
    );

    // Get the earliest date and calculate the start of that week (Sunday to Saturday)
    let earliestDate = ''
    if(plantioView){
        earliestDate = new Date(qs_planned[0].data_prevista_plantio);
    } else {
        earliestDate = new Date(qs_planned[0].data_prevista_plantio);
    }
    const weekStart = new Date(
        earliestDate.setDate(earliestDate.getDate() - earliestDate.getDay())
    ); // Start of the week

    // Step 2: Group data by weeks
    const weekRangesPlantio = [
        // "15/09/2024 - 21/09/2024",
        // "22/09/2024 - 28/09/2024",
        "29/09/2024 - 05/10/2024",
        "06/10/2024 - 12/10/2024",
        "13/10/2024 - 19/10/2024",
        "20/10/2024 - 26/10/2024",
        "27/10/2024 - 02/11/2024",
        "03/11/2024 - 09/11/2024",
        "10/11/2024 - 16/11/2024",
        "17/11/2024 - 23/11/2024",
        "24/11/2024 - 30/11/2024",
        "01/12/2024 - 07/12/2024",
        "08/12/2024 - 14/12/2024",
        "15/12/2024 - 21/12/2024",
        "22/12/2024 - 28/12/2024",
        "29/12/2024 - 04/01/2025",
        "05/01/2025 - 11/01/2025",
        "12/01/2025 - 18/01/2025",
        "19/01/2025 - 25/01/2025"
    ];
    const weekRangesColheita = [
        "12/01/2025 - 18/01/2025",
        "19/01/2025 - 25/01/2025",
        "26/01/2025 - 01/02/2025",
        "02/02/2025 - 08/02/2025",
        "09/02/2025 - 15/02/2025",
        "16/02/2025 - 22/02/2025",
        "23/02/2025 - 01/03/2025",
        "02/03/2025 - 08/03/2025",
        "09/03/2025 - 15/03/2025",
        "16/03/2025 - 22/03/2025",
        "23/03/2025 - 29/03/2025",
        "30/03/2025 - 05/04/2025",
        "06/04/2025 - 12/04/2025",
        "13/04/2025 - 19/04/2025",
        "20/04/2025 - 26/04/2025",
        "27/04/2025 - 03/05/2025",
        "04/05/2025 - 10/05/2025",
        "11/05/2025 - 17/05/2025",
        "18/05/2025 - 24/05/2025",
        "25/05/2025 - 31/05/2025",
        "01/06/2025 - 07/06/2025"
    ];

    const weekRanges = plantioView ? weekRangesPlantio : weekRangesColheita

    const groupByWeeks = qs_planned.reduce((acc, entry) => {
        const newDate = entry.data_prevista_plantio
        const entryDate = moment(newDate)
        entryDate.add(1, 'days')


        // Find the week difference from the start of the first week
        const weekDiff = Math.floor(
            (entryDate - weekStart) / (7 * 24 * 60 * 60 * 1000)
        ); // Convert ms to weeks

        const weekStartDate = new Date(weekStart);
        weekStartDate.setDate(weekStartDate.getDate() + weekDiff * 7);

        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6); // End of the week (Saturday)

        const weekRange = `${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()}`;


        // Group by week range
        if (!acc[weekRange]) {
            acc[weekRange] = [];
        }
        acc[weekRange].push(entry);
        return acc;
    }, {});
    const result = weekRanges.reduce((acc, range) => {
        if (!groupByWeeks[range]) {
            acc[range] = []; // Initialize empty array for weeks with no data
        } else {
            acc[range] = groupByWeeks[range];
        }
        return acc;
    }, {});
    // Step 3: Sum areas by week and project name
    const summedByWeekAndProject = Object.entries(
        result
    ).map(([weekRange, entries]) => {
        const projectSums = entries.reduce((projectAcc, entry) => {
            const projectName = entry.talhao__fazenda__nome;
            if (!projectAcc[projectName]) {
                projectAcc[projectName] = 0;
            }
            projectAcc[projectName] += entry.area_planejamento_plantio;
            return projectAcc;
        }, {});
        const totalPlanned = entries.reduce((acc, curr) => {
            acc += curr.area_planejamento_plantio
            return acc
        }, 0)
        return { weekRange, totalPlanned: totalPlanned, projects: projectSums };
    });

    return summedByWeekAndProject;
};


export const consolidateData = (plannedData, executedData) => {
    // Helper to check if a date falls within a given week range
    const isDateInRange = (date, range) => {
        const [start, end] = range.split(" - ").map(d => new Date(d.split("/").reverse().join("-")));
        const d = new Date(date);
        return d >= start && d <= end;
    };

    // Consolidate executed data into the planned week structure
    return plannedData.map(week => {
        const executedTotal = executedData
            .filter(exec => isDateInRange(exec.data_plantio, week.weekRange))
            .reduce((sum, exec) => sum + Number(exec.area_plantada), 0);

        return {
            week: week.weekRange,
            Planejado: week.totalPlanned,
            Realizado: executedTotal
        };
    });
};


export const groupExecutedByWeek = (qs_executed_area) => {
    // Helper function to format the date range string (week start and end)
    const formatWeekRange = (startDate) => {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + 6); // 6 days ahead to get the full week range

        // Format date as 'dd/mm/yyyy'
        const formatDate = (date) =>
            `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

        return `${formatDate(start)} - ${formatDate(end)}`;
    };

    // Group data by week ranges starting on Sunday
    const groupedByWeek = {};

    qs_executed_area.forEach((entry) => {
        // const plantioDate = new Date(entry.data_plantio);
        // console.log('plantio Date: ', plantioDate);
        // const dayOfWeek = plantioDate.getDay(); // Get the day of the week (0 for Sunday, 6 for Saturday)

        // // Calculate the previous Sunday to start the week
        // const weekStart = new Date(plantioDate);
        // weekStart.setDate(plantioDate.getDate() - dayOfWeek); // Subtract the day of the week to get Sunday

        const plantioDate = moment(entry.data_plantio);

        // Get the day of the week (0 for Sunday, 6 for Saturday)
        const dayOfWeek = plantioDate.day();

        // Calculate the previous Sunday to start the week
        const weekStart = moment(plantioDate).subtract(dayOfWeek, 'days'); // Subtract the day of the week to get Sunday

        // console.log('Week start: ', weekStart.format()); // Print formatted weekStart (previous Sunday)

        const weekRange = formatWeekRange(weekStart);
        const project = entry.plantio__talhao__fazenda__nome;
        const areaPlanted = entry.area_plantada;

        // Initialize week range if not yet present
        if (!groupedByWeek[weekRange]) {
            groupedByWeek[weekRange] = {
                weekRange: weekRange,
                totalPlanned: 0,
                projects: {}
            };
        }

        // Add the planted area to the total for the week
        groupedByWeek[weekRange].totalPlanned += areaPlanted;

        // Add the planted area to the specific project within that week
        if (!groupedByWeek[weekRange].projects[project]) {
            groupedByWeek[weekRange].projects[project] = 0;
        }
        groupedByWeek[weekRange].projects[project] += areaPlanted;
    });

    // Convert grouped data to an array
    return Object.values(groupedByWeek);
}
