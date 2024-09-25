import moment from 'moment';

export const dataPlannerHandler = qs_planned => {
    qs_planned.sort(
        (a, b) =>
            new Date(a.data_prevista_plantio) - new Date(b.data_prevista_plantio)
    );

    // Get the earliest date and calculate the start of that week (Sunday to Saturday)
    const earliestDate = new Date(qs_planned[0].data_prevista_plantio);
    const weekStart = new Date(
        earliestDate.setDate(earliestDate.getDate() - earliestDate.getDay())
    ); // Start of the week

    // Step 2: Group data by weeks
    const groupByWeeks = qs_planned.reduce((acc, entry) => {
        const entryDate = moment(entry.data_prevista_plantio)
        // entryDate.add(1, 'days')


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
    // Step 3: Sum areas by week and project name
    const summedByWeekAndProject = Object.entries(
        groupByWeeks
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
        const plantioDate = new Date(entry.data_plantio);
        const dayOfWeek = plantioDate.getDay(); // Get the day of the week (0 for Sunday, 6 for Saturday)
        
        // Calculate the previous Sunday to start the week
        const weekStart = new Date(plantioDate);
        weekStart.setDate(plantioDate.getDate() - dayOfWeek); // Subtract the day of the week to get Sunday

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
