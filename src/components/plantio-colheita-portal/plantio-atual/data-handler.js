export const dataPlannerHandler = qs_planned => {
    console.log('data insideL ', qs_planned)
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
        const entryDate = new Date(entry.data_prevista_plantio);

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

        return { weekRange, projects: projectSums };
    });

    return summedByWeekAndProject;
};
