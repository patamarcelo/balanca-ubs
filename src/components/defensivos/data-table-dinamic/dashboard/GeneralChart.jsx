import React, { useMemo, useState } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ReferenceArea,
    LabelList,
} from 'recharts';

import { useTheme } from "@mui/material/styles";
import { tokens } from '../../../../theme';

function formatDateBR(date) {
    if (!date) return '—';
    return date.toLocaleDateString('pt-BR');
}

function formatWeekLabel(start, end) {
    if (!start || !end) return 'sem data';
    return `${formatDateBR(start)} - ${formatDateBR(end)}`;
}

/* ==========================
   Cores reutilizáveis
   ========================== */

function getStageColor(_key, index, dark) {
    const paletteLight = [
        '#2563eb',
        '#16a34a',
        '#f97316',
        '#7c3aed',
        '#dc2626',
        '#059669',
        '#ea580c',
    ];
    const paletteDark = [
        '#38bdf8',
        '#4ade80',
        '#fb923c',
        '#a855f7',
        '#f97373',
        '#22c55e',
        '#fdba74',
    ];
    const palette = dark ? paletteDark : paletteLight;

    return palette[index % palette.length];
}

// semana: domingo (início) até sábado (fim)
function getWeekRange(date) {
    if (!date) {
        return {
            weekKey: 'sem-data',
            start: null,
            end: null,
        };
    }

    const d = new Date(date);
    const day = d.getDay(); // 0 domingo, 6 sábado
    const start = new Date(d);
    // volta até o domingo
    start.setDate(d.getDate() - day);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const year = start.getFullYear();
    const month = String(start.getMonth() + 1).padStart(2, '0');
    const dayMonth = String(start.getDate()).padStart(2, '0');

    return {
        weekKey: `${year}-${month}-${dayMonth}`, // chave usando domingo
        start,
        end,
    };
}

/* ==========================
   Agregação base
   ========================== */

function isOperacao(item) {
    return item.tipo === 'operacao';
}

/* ==========================
   Helpers de estágio
   ========================== */

function getStageKey(estagio) {
    if (!estagio) return 'Sem estágio';
    return String(estagio).split('|')[0].trim() || 'Sem estágio';
}

/* ==========================
   Agregação: por semana + estágio
   ========================== */

function getOperacoesPorSemanaComEstagio(data) {
    const weekMap = new Map();
    const stageStats = new Map(); // guarda DAP por estágio neste DATA FILTRADO

    data.forEach((item) => {
        const stageKey = getStageKey(item.estagio);

        // === 1) Atualiza stats de DAP do estágio (para ESTE data filtrado) ===
        if (stageKey) {
            const dapNumeric =
                item.dap != null && !Number.isNaN(item.dap)
                    ? item.dap
                    : null;

            let stat = stageStats.get(stageKey);
            if (!stat) {
                stat = { minDap: null };
            }

            if (dapNumeric != null) {
                if (stat.minDap == null || dapNumeric < stat.minDap) {
                    stat.minDap = dapNumeric;
                }
            }

            stageStats.set(stageKey, stat);
        }

        // === 2) A partir daqui, só OPERAÇÕES entram no gráfico ===
        if (!item.dataPrevista) return;
        if (!isOperacao(item)) return;

        const { weekKey, start, end } = getWeekRange(item.dataPrevista);
        const area = item.area || 0;

        let week = weekMap.get(weekKey);
        if (!week) {
            week = {
                weekKey,
                weekStart: start,
                weekEnd: end,
                totalArea: 0,
            };
            weekMap.set(weekKey, week);
        }

        week.totalArea += area;

        if (stageKey) {
            week[stageKey] = (week[stageKey] || 0) + area;
        }
    });

    const weeks = Array.from(weekMap.values()).sort((a, b) =>
        a.weekKey.localeCompare(b.weekKey)
    );

    const stageKeys = Array.from(stageStats.entries())
        .sort((a, b) => {
            const aD = a[1].minDap;
            const bD = b[1].minDap;

            const aHas = aD != null && !Number.isNaN(aD);
            const bHas = bD != null && !Number.isNaN(bD);

            if (aHas && bHas && aD !== bD) {
                return aD - bD;
            }

            if (aHas && !bHas) return -1;
            if (!aHas && bHas) return 1;

            return a[0].localeCompare(b[0], 'pt-BR');
        })
        .map(([stageKey]) => stageKey);

    return {
        weeks,
        stageKeys,
    };
}

/* ==========================
   Agregação: por semana + projeto
   ========================== */

function getOperacoesPorSemanaPorProjeto(data) {
    const weekMap = new Map();
    const projectSet = new Set();

    data.forEach((item) => {
        if (!item.dataPrevista) return;
        if (!isOperacao(item)) return;

        const { weekKey, start, end } = getWeekRange(item.dataPrevista);
        const area = item.area || 0;
        const projeto = item.projeto || 'Sem projeto';

        let week = weekMap.get(weekKey);
        if (!week) {
            week = {
                weekKey,
                weekStart: start,
                weekEnd: end,
                totalArea: 0,
            };
            weekMap.set(weekKey, week);
        }

        week.totalArea += area;
        week[projeto] = (week[projeto] || 0) + area;

        projectSet.add(projeto);
    });

    const weeks = Array.from(weekMap.values()).sort((a, b) =>
        a.weekKey.localeCompare(b.weekKey)
    );

    const projectKeys = Array.from(projectSet.values()).sort((a, b) =>
        a.localeCompare(b, 'pt-BR')
    );

    return {
        weeks,
        projectKeys,
    };
}

/* ==========================
   Agregação: por semana + fazenda
   ========================== */

function getOperacoesPorSemanaPorFazenda(data) {
    const weekMap = new Map();
    const farmSet = new Set();

    data.forEach((item) => {
        if (!item.dataPrevista) return;
        if (!isOperacao(item)) return;

        const { weekKey, start, end } = getWeekRange(item.dataPrevista);
        const area = item.area || 0;

        // prioridade no grupo de fazenda, depois nome simples
        const fazenda =
            item.fazendaGrupo ||
            item.fazenda ||
            'Sem fazenda';

        let week = weekMap.get(weekKey);
        if (!week) {
            week = {
                weekKey,
                weekStart: start,
                weekEnd: end,
                totalArea: 0,
            };
            weekMap.set(weekKey, week);
        }

        week.totalArea += area;
        week[fazenda] = (week[fazenda] || 0) + area;

        farmSet.add(fazenda);
    });

    const weeks = Array.from(weekMap.values()).sort((a, b) =>
        a.weekKey.localeCompare(b.weekKey)
    );

    const farmKeys = Array.from(farmSet.values()).sort((a, b) =>
        a.localeCompare(b, 'pt-BR')
    );

    return {
        weeks,
        farmKeys,
    };
}

/* ==========================
   VIEW WRAPPER (Chips de visão)
   ========================== */

const ProdutosSemanaChart = ({ data, dark, hiddenStages, setHiddenStages }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isDark = dark ?? theme.palette.mode === "dark";

    const [viewMode, setViewMode] = useState('stages'); // 'stages' | 'projects' | 'farms'

    const chipBg = isDark ? colors.primary[600] : '#ffffff';
    const chipBorder = isDark ? colors.grey[700] : colors.grey[300];
    const chipText = colors.textColor[100];
    const chipSelectedBg = isDark ? colors.greenAccent[500] : colors.blueOrigin[800];
    const chipSelectedText = '#ffffff';

    const renderChip = (label, mode) => {
        const selected = viewMode === mode;
        return (
            <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    border: `1px solid ${selected ? chipSelectedBg : chipBorder}`,
                    backgroundColor: selected ? chipSelectedBg : chipBg,
                    color: selected ? chipSelectedText : chipText,
                    fontSize: 12,
                    fontWeight: selected ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-out',
                }}
            >
                {label}
            </button>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            {/* Header com "Visão" e chips alinhados à esquerda */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 4,
                }}
            >
                <span
                    style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: colors.textColor[100],
                    }}
                >
                    Visão
                </span>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {renderChip('Estágios', 'stages')}
                    {renderChip('Projetos', 'projects')}
                    {renderChip('Fazendas', 'farms')}
                </div>
            </div>

            {/* Conteúdo conforme visão */}
            {viewMode === 'stages' && (
                <StageViewChart
                    data={data}
                    dark={dark}
                    hiddenStages={hiddenStages}
                    setHiddenStages={setHiddenStages}
                />
            )}

            {viewMode === 'projects' && (
                <ProjectViewChart
                    data={data}
                    dark={dark}
                />
            )}

            {viewMode === 'farms' && (
                <FarmViewChart
                    data={data}
                    dark={dark}
                />
            )}
        </div>
    );
};

/* ==========================
   VISÃO 1: Estágios (a que você já tinha)
   ========================== */

function StageViewChart({ data, dark, hiddenStages, setHiddenStages }) {
    const { weeks, stageKeys } = useMemo(
        () => getOperacoesPorSemanaComEstagio(data),
        [data]
    );

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isDark = dark ?? theme.palette.mode === "dark";

    const axisColor = colors.primary[100];
    const gridColor = colors.primary[100];
    const textColor = colors.textColor[100];
    const tooltipBg = isDark ? colors.primary[500] : colors.blueOrigin[800];
    const tooltipBorder = isDark ? colors.blueAccent[400] : colors.grey[300];

    const legendText = textColor;
    const legendSub = isDark ? colors.grey[400] : colors.grey[600];
    const legendBorder = isDark ? colors.grey[700] : colors.grey[300];
    const legendBg = isDark ? colors.primary[600] : colors.blueOrigin[800];

    const [accordionOpen, setAccordionOpen] = useState(true);

    const paperShadowLight = isDark
        ? '0px 4px 10px rgba(0,0,0,0.55)'
        : '0px 2px 6px rgba(15,23,42,0.16)';

    const stageColorMap = useMemo(() => {
        const map = {};
        stageKeys.forEach((stage, index) => {
            map[stage] = getStageColor(stage, index, isDark);
        });
        return map;
    }, [stageKeys, isDark]);

    if (!weeks.length) {
        return <p>Nenhum dado de operações para exibir o gráfico.</p>;
    }

    // Semana corrente (pela data de hoje)
    const today = new Date();
    const { weekKey: currentWeekKey } = getWeekRange(today);

    const currentWeekLabel = (() => {
        const current = weeks.find((w) => w.weekKey === currentWeekKey);
        if (!current) return null;
        return formatWeekLabel(current.weekStart, current.weekEnd);
    })();

    const visibleStageKeys = stageKeys.filter(
        (stage) => !hiddenStages.includes(stage)
    );

    const chartData = weeks.map((item) => ({
        ...item,
        weekLabel: formatWeekLabel(item.weekStart, item.weekEnd),
    }));

    const chartDataWithTotal = chartData.map((item) => {
        const totalStack = visibleStageKeys.reduce(
            (sum, key) => sum + (item[key] || 0),
            0
        );
        return { ...item, totalStack };
    });

    const handleToggleStage = (stage) => {
        setHiddenStages((prev) =>
            prev.includes(stage)
                ? prev.filter((s) => s !== stage)
                : [...prev, stage]
        );
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;

        const total = payload.reduce((acc, entry) => {
            const v = entry?.value ?? 0;
            return acc + (isNaN(v) ? 0 : v);
        }, 0);

        return (
            <div
                style={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: 8,
                    padding: 8,
                    fontSize: 12,
                    minWidth: 180,
                    boxShadow: paperShadowLight,
                }}
            >
                <div
                    style={{
                        fontWeight: 600,
                        marginBottom: 4,
                        color: textColor,
                    }}
                >
                    {label}
                </div>

                <div
                    style={{
                        fontWeight: 700,
                        fontSize: 12,
                        color: isDark ? colors.yellow[550] : '#000',
                        marginBottom: 6,
                    }}
                >
                    Total{' '}
                    {total.toLocaleString('pt-BR', {
                        maximumFractionDigits: 0,
                    })}{' '}
                    ha
                </div>

                <div
                    style={{
                        borderTop: `1px solid ${tooltipBorder}`,
                        margin: '4px 0 6px',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    {payload.map((entry) => {
                        const { name, value, color } = entry;
                        if (!name) return null;

                        return (
                            <div
                                key={name}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 8,
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 2,
                                            backgroundColor: color || stageColorMap[name],
                                        }}
                                    />
                                    <span
                                        style={{
                                            color: textColor,
                                        }}
                                    >
                                        {name}
                                    </span>
                                </div>
                                <span
                                    style={{
                                        fontVariantNumeric: 'tabular-nums',
                                        color: textColor,
                                    }}
                                >
                                    {value?.toLocaleString('pt-BR', {
                                        maximumFractionDigits: 0,
                                    })}{' '}
                                    ha
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', width: '100%', gap: 24, alignItems: 'stretch' }}>
            <div style={{ flex: 1, height: 450 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={chartDataWithTotal}
                        margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
                    >
                        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="weekLabel"
                            angle={-35}
                            textAnchor="end"
                            interval={0}
                            tick={{ fill: axisColor, fontSize: 11 }}
                            stroke={axisColor}
                        />
                        <YAxis
                            tick={{ fill: axisColor, fontSize: 11 }}
                            stroke={axisColor}
                            tickFormatter={(value) =>
                                Number(value).toLocaleString('pt-BR', {
                                    maximumFractionDigits: 0,
                                })
                            }
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {currentWeekLabel && (
                            <ReferenceArea
                                x1={currentWeekLabel}
                                x2={currentWeekLabel}
                                ifOverflow="extendDomain"
                                fill={
                                    dark
                                        ? 'rgba(104, 112, 250, 0.40)'
                                        : 'rgba(18, 117, 181, 0.46)'
                                }
                            />
                        )}

                        {visibleStageKeys.map((stage, index) => (
                            <Bar
                                key={stage}
                                dataKey={stage}
                                name={stage}
                                stackId="total"
                                fill={stageColorMap[stage]}
                            >
                                {index === visibleStageKeys.length - 1 && (
                                    <LabelList
                                        dataKey="totalStack"
                                        position="top"
                                        style={{
                                            fill: colors.primary[100],
                                            fontSize: 12,
                                            fontWeight: 700,
                                        }}
                                        formatter={(v) =>
                                            Number(v).toLocaleString('pt-BR', {
                                                maximumFractionDigits: 0,
                                            })
                                        }
                                    />
                                )}
                            </Bar>
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div
                style={{
                    width: 220,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    paddingTop: 4,
                    height: '100%',
                    marginTop: -24,
                }}
            >
                <button
                    type="button"
                    onClick={() => setAccordionOpen((open) => !open)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                        padding: '6px 10px',
                        borderRadius: 8,
                        border: `1px solid ${legendBorder}`,
                        backgroundColor: legendBg,
                        cursor: 'pointer',
                        fontSize: 13,
                        color: legendText,
                        boxShadow: paperShadowLight,
                    }}
                >
                    <span style={{ fontWeight: 600 }}>Estágios</span>
                    <span
                        style={{
                            fontSize: 16,
                            lineHeight: 1,
                            transform: accordionOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.15s ease-out',
                        }}
                    >
                        ▶
                    </span>
                </button>

                {accordionOpen && (
                    <div
                        style={{
                            marginTop: 6,
                            borderRadius: 8,
                            border: `1px solid ${legendBorder}`,
                            backgroundColor: legendBg,
                            padding: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6,
                            maxHeight: 450,
                            overflowY: 'auto',
                            scrollbarWidth: 'thin',
                            boxShadow: paperShadowLight,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 11,
                                color: legendSub,
                                marginBottom: 4,
                            }}
                        >
                            Marque/desmarque para mostrar/ocultar estágios:
                        </div>

                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: 13,
                                cursor: 'pointer',
                                paddingBottom: 6,
                                borderBottom: `1px solid ${legendBorder}`,
                                marginBottom: 6,
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={hiddenStages.length === 0}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setHiddenStages([]);
                                    } else {
                                        setHiddenStages(stageKeys);
                                    }
                                }}
                                style={{
                                    width: 14,
                                    height: 14,
                                    cursor: 'pointer',
                                }}
                            />
                            <span style={{ fontWeight: 600 }}>
                                Selecionar / Desmarcar todos
                            </span>
                        </label>

                        {stageKeys.map((stage) => {
                            const checked = !hiddenStages.includes(stage);
                            return (
                                <label
                                    key={stage}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        fontSize: 13,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleToggleStage(stage)}
                                        style={{
                                            width: 14,
                                            height: 14,
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: 4,
                                            backgroundColor: stageColorMap[stage],
                                            opacity: checked ? 1 : 0.35,
                                            border: `1px solid ${legendBorder}`,
                                        }}
                                    />
                                    <span
                                        style={{
                                            opacity: checked ? 1 : 0.5,
                                        }}
                                    >
                                        {stage}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ==========================
   VISÃO 2: Projetos (barras agrupadas)
   ========================== */

function ProjectViewChart({ data, dark }) {
    const { weeks, projectKeys } = useMemo(
        () => getOperacoesPorSemanaPorProjeto(data),
        [data]
    );

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isDark = dark ?? theme.palette.mode === "dark";

    const axisColor = colors.primary[100];
    const gridColor = colors.primary[100];
    const textColor = colors.textColor[100];
    const tooltipBg = isDark ? colors.primary[500] : colors.blueOrigin[800];
    const tooltipBorder = isDark ? colors.blueAccent[400] : colors.grey[300];

    const legendText = textColor;
    const legendSub = isDark ? colors.grey[400] : colors.grey[600];
    const legendBorder = isDark ? colors.grey[700] : colors.grey[300];
    const legendBg = isDark ? colors.primary[600] : colors.blueOrigin[800];

    const [accordionOpen, setAccordionOpen] = useState(true);
    const [hiddenProjects, setHiddenProjects] = useState([]);

    const paperShadowLight = isDark
        ? '0px 4px 10px rgba(0,0,0,0.55)'
        : '0px 2px 6px rgba(15,23,42,0.16)';

    const projectColorMap = useMemo(() => {
        const map = {};
        projectKeys.forEach((proj, index) => {
            map[proj] = getStageColor(proj, index, isDark);
        });
        return map;
    }, [projectKeys, isDark]);

    if (!weeks.length) {
        return <p>Nenhum dado de operações para exibir o gráfico.</p>;
    }

    const today = new Date();
    const { weekKey: currentWeekKey } = getWeekRange(today);

    const currentWeekLabel = (() => {
        const current = weeks.find((w) => w.weekKey === currentWeekKey);
        if (!current) return null;
        return formatWeekLabel(current.weekStart, current.weekEnd);
    })();

    const visibleProjectKeys = projectKeys.filter(
        (proj) => !hiddenProjects.includes(proj)
    );

    const chartData = weeks.map((item) => {
        const weekLabel = formatWeekLabel(item.weekStart, item.weekEnd);
        const row = { ...item, weekLabel };

        const totalVisible = visibleProjectKeys.reduce(
            (sum, key) => sum + (item[key] || 0),
            0
        );
        row.totalVisible = totalVisible;

        return row;
    });

    const handleToggleProject = (proj) => {
        setHiddenProjects((prev) =>
            prev.includes(proj)
                ? prev.filter((p) => p !== proj)
                : [...prev, proj]
        );
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;

        const total = payload.reduce((acc, entry) => {
            const v = entry?.value ?? 0;
            return acc + (isNaN(v) ? 0 : v);
        }, 0);

        return (
            <div
                style={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: 8,
                    padding: 8,
                    fontSize: 12,
                    minWidth: 200,
                    boxShadow: paperShadowLight,
                }}
            >
                <div
                    style={{
                        fontWeight: 600,
                        marginBottom: 4,
                        color: textColor,
                    }}
                >
                    {label}
                </div>

                <div
                    style={{
                        fontWeight: 700,
                        fontSize: 12,
                        color: isDark ? colors.yellow[550] : '#000',
                        marginBottom: 6,
                    }}
                >
                    Total (projetos visíveis){' '}
                    {total.toLocaleString('pt-BR', {
                        maximumFractionDigits: 0,
                    })}{' '}
                    ha
                </div>

                <div
                    style={{
                        borderTop: `1px solid ${tooltipBorder}`,
                        margin: '4px 0 6px',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    {payload.map((entry) => {
                        const { name, value, color } = entry;
                        if (!name) return null;

                        return (
                            <div
                                key={name}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 8,
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 2,
                                            backgroundColor: color || projectColorMap[name],
                                        }}
                                    />
                                    <span
                                        style={{
                                            color: textColor,
                                        }}
                                    >
                                        {name}
                                    </span>
                                </div>
                                <span
                                    style={{
                                        fontVariantNumeric: 'tabular-nums',
                                        color: textColor,
                                    }}
                                >
                                    {value?.toLocaleString('pt-BR', {
                                        maximumFractionDigits: 0,
                                    })}{' '}
                                    ha
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', width: '100%', gap: 24, alignItems: 'stretch' }}>
            <div style={{ flex: 1, height: 450 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
                    >
                        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="weekLabel"
                            angle={-35}
                            textAnchor="end"
                            interval={0}
                            tick={{ fill: axisColor, fontSize: 11 }}
                            stroke={axisColor}
                        />
                        <YAxis
                            tick={{ fill: axisColor, fontSize: 11 }}
                            stroke={axisColor}
                            tickFormatter={(value) =>
                                Number(value).toLocaleString('pt-BR', {
                                    maximumFractionDigits: 0,
                                })
                            }
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {currentWeekLabel && (
                            <ReferenceArea
                                x1={currentWeekLabel}
                                x2={currentWeekLabel}
                                ifOverflow="extendDomain"
                                fill={
                                    dark
                                        ? 'rgba(104, 112, 250, 0.40)'
                                        : 'rgba(18, 117, 181, 0.46)'
                                }
                            />
                        )}

                        {visibleProjectKeys.map((proj) => (
                            <Bar
                                key={proj}
                                dataKey={proj}
                                name={proj}
                                fill={projectColorMap[proj]}
                            // agrupado (sem stackId)
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div
                style={{
                    width: 220,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    paddingTop: 4,
                    height: '100%',
                    marginTop: -24,
                }}
            >
                <button
                    type="button"
                    onClick={() => setAccordionOpen((open) => !open)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                        padding: '6px 10px',
                        borderRadius: 8,
                        border: `1px solid ${legendBorder}`,
                        backgroundColor: legendBg,
                        cursor: 'pointer',
                        fontSize: 13,
                        color: legendText,
                        boxShadow: paperShadowLight,
                    }}
                >
                    <span style={{ fontWeight: 600 }}>Projetos</span>
                    <span
                        style={{
                            fontSize: 16,
                            lineHeight: 1,
                            transform: accordionOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.15s ease-out',
                        }}
                    >
                        ▶
                    </span>
                </button>

                {accordionOpen && (
                    <div
                        style={{
                            marginTop: 6,
                            borderRadius: 8,
                            border: `1px solid ${legendBorder}`,
                            backgroundColor: legendBg,
                            padding: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6,
                            maxHeight: 450,
                            overflowY: 'auto',
                            scrollbarWidth: 'thin',
                            boxShadow: paperShadowLight,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 11,
                                color: legendSub,
                                marginBottom: 4,
                            }}
                        >
                            Marque/desmarque para mostrar/ocultar projetos:
                        </div>

                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: 13,
                                cursor: 'pointer',
                                paddingBottom: 6,
                                borderBottom: `1px solid ${legendBorder}`,
                                marginBottom: 6,
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={hiddenProjects.length === 0}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setHiddenProjects([]);
                                    } else {
                                        setHiddenProjects(projectKeys);
                                    }
                                }}
                                style={{
                                    width: 14,
                                    height: 14,
                                    cursor: 'pointer',
                                }}
                            />
                            <span style={{ fontWeight: 600 }}>
                                Selecionar / Desmarcar todos
                            </span>
                        </label>

                        {projectKeys.map((proj) => {
                            const checked = !hiddenProjects.includes(proj);
                            return (
                                <label
                                    key={proj}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        fontSize: 13,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleToggleProject(proj)}
                                        style={{
                                            width: 14,
                                            height: 14,
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: 4,
                                            backgroundColor: projectColorMap[proj],
                                            opacity: checked ? 1 : 0.35,
                                            border: `1px solid ${legendBorder}`,
                                        }}
                                    />
                                    <span
                                        style={{
                                            opacity: checked ? 1 : 0.5,
                                        }}
                                    >
                                        {proj}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ==========================
   VISÃO 3: Fazendas (barras agrupadas)
   ========================== */

function FarmViewChart({ data, dark }) {
    const { weeks, farmKeys } = useMemo(
        () => getOperacoesPorSemanaPorFazenda(data),
        [data]
    );

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isDark = dark ?? theme.palette.mode === "dark";

    const axisColor = colors.primary[100];
    const gridColor = colors.primary[100];
    const textColor = colors.textColor[100];
    const tooltipBg = isDark ? colors.primary[500] : colors.blueOrigin[800];
    const tooltipBorder = isDark ? colors.blueAccent[400] : colors.grey[300];

    const legendText = textColor;
    const legendSub = isDark ? colors.grey[400] : colors.grey[600];
    const legendBorder = isDark ? colors.grey[700] : colors.grey[300];
    const legendBg = isDark ? colors.primary[600] : colors.blueOrigin[800];

    const [accordionOpen, setAccordionOpen] = useState(true);
    const [hiddenFarms, setHiddenFarms] = useState([]);

    const paperShadowLight = isDark
        ? '0px 4px 10px rgba(0,0,0,0.55)'
        : '0px 2px 6px rgba(15,23,42,0.16)';

    const farmColorMap = useMemo(() => {
        const map = {};
        farmKeys.forEach((farm, index) => {
            map[farm] = getStageColor(farm, index, isDark);
        });
        return map;
    }, [farmKeys, isDark]);

    if (!weeks.length) {
        return <p>Nenhum dado de operações para exibir o gráfico.</p>;
    }

    const today = new Date();
    const { weekKey: currentWeekKey } = getWeekRange(today);

    const currentWeekLabel = (() => {
        const current = weeks.find((w) => w.weekKey === currentWeekKey);
        if (!current) return null;
        return formatWeekLabel(current.weekStart, current.weekEnd);
    })();

    const visibleFarmKeys = farmKeys.filter(
        (farm) => !hiddenFarms.includes(farm)
    );

    const chartData = weeks.map((item) => {
        const weekLabel = formatWeekLabel(item.weekStart, item.weekEnd);
        const row = { ...item, weekLabel };

        const totalVisible = visibleFarmKeys.reduce(
            (sum, key) => sum + (item[key] || 0),
            0
        );
        row.totalVisible = totalVisible;

        return row;
    });

    const handleToggleFarm = (farm) => {
        setHiddenFarms((prev) =>
            prev.includes(farm)
                ? prev.filter((f) => f !== farm)
                : [...prev, farm]
        );
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;

        const total = payload.reduce((acc, entry) => {
            const v = entry?.value ?? 0;
            return acc + (isNaN(v) ? 0 : v);
        }, 0);

        return (
            <div
                style={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: 8,
                    padding: 8,
                    fontSize: 12,
                    minWidth: 200,
                    boxShadow: paperShadowLight,
                }}
            >
                <div
                    style={{
                        fontWeight: 600,
                        marginBottom: 4,
                        color: textColor,
                    }}
                >
                    {label}
                </div>

                <div
                    style={{
                        fontWeight: 700,
                        fontSize: 12,
                        color: isDark ? colors.yellow[550] : '#000',
                        marginBottom: 6,
                    }}
                >
                    Total (fazendas visíveis){' '}
                    {total.toLocaleString('pt-BR', {
                        maximumFractionDigits: 0,
                    })}{' '}
                    ha
                </div>

                <div
                    style={{
                        borderTop: `1px solid ${tooltipBorder}`,
                        margin: '4px 0 6px',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    {payload.map((entry) => {
                        const { name, value, color } = entry;
                        if (!name) return null;

                        return (
                            <div
                                key={name}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 8,
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 2,
                                            backgroundColor: color || farmColorMap[name],
                                        }}
                                    />
                                    <span
                                        style={{
                                            color: textColor,
                                        }}
                                    >
                                        {name}
                                    </span>
                                </div>
                                <span
                                    style={{
                                        fontVariantNumeric: 'tabular-nums',
                                        color: textColor,
                                    }}
                                >
                                    {value?.toLocaleString('pt-BR', {
                                        maximumFractionDigits: 0,
                                    })}{' '}
                                    ha
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', width: '100%', gap: 24, alignItems: 'stretch' }}>
            <div style={{ flex: 1, height: 450 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
                    >
                        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="weekLabel"
                            angle={-35}
                            textAnchor="end"
                            interval={0}
                            tick={{ fill: axisColor, fontSize: 11 }}
                            stroke={axisColor}
                        />
                        <YAxis
                            tick={{ fill: axisColor, fontSize: 11 }}
                            stroke={axisColor}
                            tickFormatter={(value) =>
                                Number(value).toLocaleString('pt-BR', {
                                    maximumFractionDigits: 0,
                                })
                            }
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {currentWeekLabel && (
                            <ReferenceArea
                                x1={currentWeekLabel}
                                x2={currentWeekLabel}
                                ifOverflow="extendDomain"
                                fill={
                                    dark
                                        ? 'rgba(104, 112, 250, 0.40)'
                                        : 'rgba(18, 117, 181, 0.46)'
                                }
                            />
                        )}

                        {visibleFarmKeys.map((farm) => (
                            <Bar
                                key={farm}
                                dataKey={farm}
                                name={farm}
                                fill={farmColorMap[farm]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div
                style={{
                    // width: 220,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    // paddingTop: 4,
                    height: '100%',
                    marginTop: -64,
                }}
            >
                <button
                    type="button"
                    onClick={() => setAccordionOpen((open) => !open)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                        padding: '6px 10px',
                        borderRadius: 8,
                        border: `1px solid ${legendBorder}`,
                        backgroundColor: legendBg,
                        cursor: 'pointer',
                        fontSize: 13,
                        color: legendText,
                        boxShadow: paperShadowLight,
                    }}
                >
                    <span style={{ fontWeight: 600 }}>Fazendas</span>
                    <span
                        style={{
                            fontSize: 16,
                            lineHeight: 1,
                            transform: accordionOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.15s ease-out',
                        }}
                    >
                        ▶
                    </span>
                </button>

                {accordionOpen && (
                    <div
                        style={{
                            marginTop: 6,
                            borderRadius: 8,
                            border: `1px solid ${legendBorder}`,
                            backgroundColor: legendBg,
                            padding: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6,
                            maxHeight: 450,
                            overflowY: 'auto',
                            scrollbarWidth: 'thin',
                            boxShadow: paperShadowLight,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 11,
                                color: legendSub,
                                marginBottom: 4,
                            }}
                        >
                            Marque/desmarque para mostrar/ocultar fazendas:
                        </div>

                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: 13,
                                cursor: 'pointer',
                                paddingBottom: 6,
                                borderBottom: `1px solid ${legendBorder}`,
                                marginBottom: 6,
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={hiddenFarms.length === 0}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setHiddenFarms([]);
                                    } else {
                                        setHiddenFarms(farmKeys);
                                    }
                                }}
                                style={{
                                    width: 14,
                                    height: 14,
                                    cursor: 'pointer',
                                }}
                            />
                            <span style={{ fontWeight: 600 }}>
                                Selecionar / Desmarcar todos
                            </span>
                        </label>

                        {farmKeys.map((farm) => {
                            const checked = !hiddenFarms.includes(farm);
                            return (
                                <label
                                    key={farm}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        fontSize: 13,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleToggleFarm(farm)}
                                        style={{
                                            width: 14,
                                            height: 14,
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: 4,
                                            backgroundColor: farmColorMap[farm],
                                            opacity: checked ? 1 : 0.35,
                                            border: `1px solid ${legendBorder}`,
                                        }}
                                    />
                                    <span
                                        style={{
                                            opacity: checked ? 1 : 0.5,
                                        }}
                                    >
                                        {farm}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProdutosSemanaChart;
