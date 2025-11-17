import moment from "moment";

const dataToUse = (finalizadoPlantio, dataPlantio, dataPrevista) => {
  // Se já finalizou o plantio, sempre usa a data real de plantio
  if (finalizadoPlantio && dataPlantio) {
    return moment(dataPlantio).format("YYYY-MM-DD");
  }

  if (!dataPrevista) return null;

  const hoje = moment().startOf("day");
  const prevista = moment(dataPrevista);

  if (!prevista.isValid()) return null;

  // Se a data prevista ficou para trás, puxa para hoje (semana corrente)
  return prevista.isBefore(hoje, "day")
    ? hoje.format("YYYY-MM-DD")
    : prevista.format("YYYY-MM-DD");
};

const dataToUseBarChart = (finalizadoPlantio, dataPlantio, dataPrevista) => {
  if (finalizadoPlantio) {
    return dataPlantio;
  }
  return moment(dataPrevista).isBefore(moment(), "day")
    ? moment().format("YYYY-MM-DD")
    : dataPrevista;
};

const getColheitaDate = (plantioDate, cicle) => {
  const startDate = moment(plantioDate); // Starting date
  const newDate = startDate.add(cicle, "days"); // Add 5 days
  const formatDate = newDate.format("YYYY-MM-DD"); // Output: '2024-10-06'
  return formatDate;
};

function getWeeklyRanges(entries, field, startOnMonday = true) {
  if (!entries.length) return [];

  const dates = entries
    .map(e => e[field])
    .filter(date => !!date && !isNaN(new Date(date)))
    .map(date => new Date(date));

  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  // Início da semana (domingo, do jeito que você já estava usando)
  const start = new Date(minDate);
  const day = start.getDay(); // 0 = domingo
  start.setDate(start.getDate() - day);

  // Fim da última semana (até domingo)
  const end = new Date(maxDate);
  const endDay = end.getDay();
  const daysToSunday = 7 - endDay;
  end.setDate(end.getDate() + daysToSunday);

  const result = [];
  const current = new Date(start);
  while (current <= end) {
    const weekStart = new Date(current);
    const weekEnd = new Date(current);
    weekEnd.setDate(weekEnd.getDate() + 6);

    result.push(
      `${moment(weekStart).format("DD/MM/YYYY")} - ${moment(weekEnd).format(
        "DD/MM/YYYY"
      )}`
    );
    current.setDate(current.getDate() + 7);
  }
  return result;
}

function getWeeklyRangesBarChart(entries, field) {
  if (!entries.length) return [];

  const dates = entries
    .map(e => e[field])
    .filter(date => !!date && !isNaN(new Date(date)))
    .map(date => new Date(date));

  if (!dates.length) return [];

  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  // Início da semana (domingo)
  const start = new Date(minDate);
  const day = start.getDay(); // 0 = domingo
  start.setDate(start.getDate() - day);

  // Fim da última semana (até domingo)
  const end = new Date(maxDate);
  const endDay = end.getDay();
  const daysToSunday = 7 - endDay;
  end.setDate(end.getDate() + daysToSunday);

  const result = [];
  const current = new Date(start);
  while (current <= end) {
    const weekStart = new Date(current);
    const weekEnd = new Date(current);
    weekEnd.setDate(weekEnd.getDate() + 6);

    result.push(
      `${moment(weekStart).format("DD/MM/YYYY")} - ${moment(weekEnd).format(
        "DD/MM/YYYY"
      )}`
    );
    current.setDate(current.getDate() + 7);
  }
  return result;
}

export const dataPlannerHandler = (qs_planned_orig, plantioView = true) => {
  const qs_planned = qs_planned_orig
    .map(data => {
      const newDateHere = dataToUse(
        data.finalizado_plantio,
        data.data_plantio,
        data.data_prevista_plantio
      );
      const colheitaDate = getColheitaDate(
        newDateHere,
        data.variedade__dias_ciclo
      );
      return {
        ...data,
        newDate: newDateHere,
        colheitaDate: colheitaDate
      };
    })
    .sort(
      (a, b) =>
        plantioView
          ? new Date(a.newDate) - new Date(b.newDate)
          : new Date(a.colheitaDate) - new Date(b.colheitaDate)
    );

  const weekRanges = getWeeklyRanges(
    qs_planned,
    plantioView ? "newDate" : "colheitaDate"
  );

  const firstWeekRange = weekRanges[0];

  const groupByWeeks = qs_planned.reduce((acc, entry) => {
    const field = plantioView ? entry.newDate : entry.colheitaDate;

    let entryDate = field ? moment(field) : null;

    if (!entryDate || !entryDate.isValid()) {
      if (!acc[firstWeekRange]) acc[firstWeekRange] = [];
      acc[firstWeekRange].push(entry);
      return acc;
    }

    const baseWeekStart = moment(firstWeekRange.split(" - ")[0], "DD/MM/YYYY");
    const weekDiff = Math.floor(entryDate.diff(baseWeekStart, "days") / 7);

    const weekStart = moment(baseWeekStart).add(weekDiff * 7, "days");
    const weekEnd = moment(weekStart).add(6, "days");

    const weekRange = `${weekStart.format("DD/MM/YYYY")} - ${weekEnd.format(
      "DD/MM/YYYY"
    )}`;

    if (!acc[weekRange]) acc[weekRange] = [];
    acc[weekRange].push(entry);
    return acc;
  }, {});

  const result = weekRanges.reduce((acc, range) => {
    acc[range] = groupByWeeks[range] || [];
    return acc;
  }, {});

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
    const totalPlanned = entries.reduce(
      (acc, curr) => acc + curr.area_planejamento_plantio,
      0
    );
    return { weekRange, totalPlanned, projects: projectSums };
  });

  return summedByWeekAndProject;
};

export const dataPlannerHandlerBarChart = (
  qs_planned_orig,
  plantioView = true
) => {
  const qs_planned = qs_planned_orig
    .map(data => {
      const newDateHere = dataToUseBarChart(
        data.finalizado_plantio,
        data.data_plantio,
        data.data_prevista_plantio
      );
      const colheitaDate = getColheitaDate(
        newDateHere,
        data.variedade__dias_ciclo
      );
      return {
        ...data,
        newDate: newDateHere,
        colheitaDate: colheitaDate
      };
    })
    .sort(
      (a, b) =>
        new Date(a.data_prevista_plantio) - new Date(b.data_prevista_plantio)
    );

  // Get the earliest date and calculate the start of that week (Sunday to Saturday)
  let earliestDate = "";
  if (plantioView) {
    earliestDate = new Date(qs_planned[0].data_prevista_plantio);
  } else {
    earliestDate = new Date(qs_planned[0].data_prevista_plantio);
  }
  const weekStart = new Date(
    earliestDate.setDate(earliestDate.getDate() - earliestDate.getDay())
  ); // Start of the week

  const weekRanges = getWeeklyRangesBarChart(
    qs_planned,
    plantioView ? "data_prevista_plantio" : "colheitaDate"
  );
  console.log("weekRange here ", weekRanges);

  const firstWeekRange = weekRanges[0];

  const groupByWeeks = qs_planned.reduce((acc, entry) => {
    const field = plantioView
      ? entry.data_prevista_plantio
      : entry.colheitaDate;

    let entryDate = field ? moment(field) : null;

    if (!entryDate || !entryDate.isValid()) {
      // Se a data for inválida ou undefined, envia para a primeira semana
      if (!acc[firstWeekRange]) acc[firstWeekRange] = [];
      acc[firstWeekRange].push(entry);
      return acc;
    }

    // Calcular o início da primeira semana (Date real, não string)
    const baseWeekStart = moment(firstWeekRange.split(" - ")[0], "DD/MM/YYYY");

    // Calcula a diferença de semanas entre entryDate e a primeira semana
    const weekDiff = Math.floor(entryDate.diff(baseWeekStart, "days") / 7);

    const weekStart = moment(baseWeekStart).add(weekDiff * 7, "days");
    const weekEnd = moment(weekStart).add(6, "days");

    const weekRange = `${weekStart.format("DD/MM/YYYY")} - ${weekEnd.format(
      "DD/MM/YYYY"
    )}`;

    if (!acc[weekRange]) acc[weekRange] = [];
    acc[weekRange].push(entry);
    return acc;
  }, {});
  // const groupByWeeks = qs_planned.reduce((acc, entry) => {
  //     const newDate = entry.data_prevista_plantio
  //     const entryDate = moment(newDate)
  //     entryDate.add(1, 'days')

  //     // Find the week difference from the start of the first week
  //     const weekDiff = Math.floor(
  //         (entryDate - weekStart) / (7 * 24 * 60 * 60 * 1000)
  //     ); // Convert ms to weeks

  //     const weekStartDate = new Date(weekStart);
  //     weekStartDate.setDate(weekStartDate.getDate() + weekDiff * 7);

  //     const weekEndDate = new Date(weekStartDate);
  //     weekEndDate.setDate(weekEndDate.getDate() + 6); // End of the week (Saturday)

  //     const weekRange = `${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()}`;

  //     // Group by week range
  //     if (!acc[weekRange]) {
  //         acc[weekRange] = [];
  //     }
  //     acc[weekRange].push(entry);
  //     return acc;
  // }, {});
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
      acc += curr.area_planejamento_plantio;
      return acc;
    }, 0);
    return { weekRange, totalPlanned: totalPlanned, projects: projectSums };
  });

  return summedByWeekAndProject;
};

export const consolidateData = (plannedData, executedData) => {
  // Helper to check if a date falls within a given week range
  const isDateInRange = (date, range) => {
    const [start, end] = range
      .split(" - ")
      .map(d => new Date(d.split("/").reverse().join("-")));
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

export const groupExecutedByWeek = qs_executed_area => {
  // Helper function to format the date range string (week start and end)
  const formatWeekRange = startDate => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // 6 days ahead to get the full week range

    // Format date as 'dd/mm/yyyy'
    const formatDate = date =>
      `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${date.getFullYear()}`;

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  // Group data by week ranges starting on Sunday
  const groupedByWeek = {};

  qs_executed_area.forEach(entry => {
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
    const weekStart = moment(plantioDate).subtract(dayOfWeek, "days"); // Subtract the day of the week to get Sunday

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
};
