// PlanejamentoProdutosDashboard.jsx
// Requer: npm install recharts

import React, { useMemo, useState } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Switch, FormControlLabel } from '@mui/material';


/* ==========================
   Helpers de normalização
   ========================== */

function parsePtNumber(str) {
    if (str == null) return 0;
    return Number(
        String(str)
            .replace(/\./g, '')
            .replace(',', '.')
    );
}

function normalizeItem(raw) {
    const area = parsePtNumber(raw.area);
    const dose = parsePtNumber(raw.dose);
    const quantidadeAplicar = parsePtNumber(raw.quantidadeAplicar);

    // regra: quantidade = dose x área (fallback para quantidadeAplicar caso necessário)
    let quantidadeCalculada = 0;
    if (area && dose) {
        quantidadeCalculada = area * dose;
    } else if (quantidadeAplicar) {
        quantidadeCalculada = quantidadeAplicar;
    }

    return {
        ...raw,
        area,
        dose,
        quantidadeAplicar,
        quantidadeCalculada,
        ciclo: raw.ciclo != null ? Number(raw.ciclo) : null,
        dap: raw.dap != null ? Number(raw.dap) : null,
        capacidadePlantioDia:
            raw.capacidadePlantioDia != null
                ? Number(raw.capacidadePlantioDia)
                : 0,
        dataPlantio: raw.dataPlantio ? new Date(raw.dataPlantio) : null,
        dataPrevista: raw.dataPrevista ? new Date(raw.dataPrevista) : null,
        programaStartDate: raw.programaStartDate
            ? new Date(raw.programaStartDate)
            : null,
        programaEndDate: raw.programaEndDate
            ? new Date(raw.programaEndDate)
            : null,
    };
}

/* ==========================
   Helpers de datas / semanas
   ========================== */

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

function formatDateBR(date) {
    if (!date) return '—';
    return date.toLocaleDateString('pt-BR');
}

function formatWeekLabel(start, end) {
    if (!start || !end) return 'sem data';
    return `${formatDateBR(start)} - ${formatDateBR(end)}`;
}

/* ==========================
   Helpers de estágio
   ========================== */

function getStageKey(estagio) {
    if (!estagio) return 'Sem estágio';
    return String(estagio).split('|')[0].trim() || 'Sem estágio';
}

/* ==========================
   Agregações para PRODUTOS (calendário)
   ========================== */

// Totais de produtos por semana (dataPrevista, dose x área)
function getProdutosPorSemana(data) {
    const map = new Map();

    data.forEach((item) => {
        if (!item.dataPrevista) return;
        const { weekKey, start, end } = getWeekRange(item.dataPrevista);
        const produto = item.produto || 'Sem produto';
        const key = `${weekKey}|${produto}`;

        if (!map.has(key)) {
            map.set(key, {
                weekKey,
                weekStart: start,
                weekEnd: end,
                produto,
                tipo: item.tipo,
                safra: item.safra,
                cultura: item.cultura,
                programa: item.programa,
                quantidadeTotal: 0,
                areaTotal: 0,
            });
        }

        const ref = map.get(key);
        // quantidade = dose x área (já calculado na normalização)
        ref.quantidadeTotal += item.quantidadeCalculada || 0;
        // soma de hectares = soma das operações de cada talhão
        ref.areaTotal += item.area || 0;
    });

    const list = Array.from(map.values()).sort((a, b) =>
        a.weekKey.localeCompare(b.weekKey)
    );

    return list;
}

function groupByWeek(list) {
    const map = new Map();
    list.forEach((item) => {
        if (!map.has(item.weekKey)) {
            map.set(item.weekKey, {
                weekKey: item.weekKey,
                weekStart: item.weekStart,
                weekEnd: item.weekEnd,
                produtos: [],
            });
        }
        map.get(item.weekKey).produtos.push(item);
    });

    return Array.from(map.values()).sort((a, b) =>
        a.weekKey.localeCompare(b.weekKey)
    );
}

/* ==========================
   Agregação para OPERAÇÕES (gráfico)
   ========================== */

function isOperacao(item) {
    return item.tipo === 'operacao';
}

// Soma da área por semana (dataPrevista) apenas para operações,
// separado por estágio (barra empilhada)
function getOperacoesPorSemanaComEstagio(data) {
    const weekMap = new Map();
    const stageStats = new Map(); // guarda info de DAP por estágio

    data.forEach((item) => {
        const stageKey = getStageKey(item.estagio);

        // 1) Atualiza DAP por estágio (independente de ser operação ou não)
        if (stageKey) {
            const dapRaw = item.dap ?? item.dapAplicacao;
            const dap = dapRaw != null ? Number(dapRaw) : null;

            const current = stageStats.get(stageKey) || { minDap: null };
            if (dap != null && !Number.isNaN(dap)) {
                if (current.minDap == null || dap < current.minDap) {
                    current.minDap = dap;
                }
            }
            stageStats.set(stageKey, current);
        }

        // 2) A partir daqui, só tratamos OPERAÇÕES para o gráfico
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
            const dapA = a[1].minDap;
            const dapB = b[1].minDap;

            const normA = dapA == null ? Number.POSITIVE_INFINITY : dapA;
            const normB = dapB == null ? Number.POSITIVE_INFINITY : dapB;

            if (normA !== normB) {
                return normA - normB;
            }

            return a[0].localeCompare(b[0]);
        })
        .map(([stageKey]) => stageKey);

    return {
        weeks,
        stageKeys,
    };
}


/* ==========================
   Cores por estágio
   ========================== */

function getStageColor(stage, index, dark) {
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

/* ==========================
   Subcomponente: Gráfico semanal (operações empilhadas por estágio)
   ========================== */

const ProdutosSemanaChart = ({ data, dark, hiddenStages, setHiddenStages }) => {
    const { weeks, stageKeys } = useMemo(
        () => getOperacoesPorSemanaComEstagio(data),
        [data]
    );

    const axisColor = dark ? '#e5e7eb' : '#374151';
    const gridColor = dark ? '#374151' : '#e5e7eb';
    const textColor = dark ? '#f9fafb' : '#111827';
    const tooltipBg = dark ? '#111827' : '#ffffff';
    const tooltipBorder = dark ? '#4b5563' : '#e5e7eb';

    const legendText = dark ? '#e5e7eb' : '#1f2937';
    const legendSub = dark ? '#9ca3af' : '#6b7280';
    const legendBorder = dark ? '#1f2937' : '#e5e7eb';
    const legendBg = dark ? '#020617' : '#ffffff';

    const [accordionOpen, setAccordionOpen] = useState(true);

    // mapa fixo de cores por estágio
    const stageColorMap = useMemo(() => {
        const map = {};
        stageKeys.forEach((stage, index) => {
            map[stage] = getStageColor(stage, index, dark);
        });
        return map;
    }, [stageKeys, dark]);

    if (!weeks.length) {
        return <p>Nenhum dado de operações para exibir o gráfico.</p>;
    }

    const chartData = weeks.map((item) => ({
        ...item,
        weekLabel: formatWeekLabel(item.weekStart, item.weekEnd),
    }));

    const handleToggleStage = (stage) => {
        setHiddenStages((prev) =>
            prev.includes(stage)
                ? prev.filter((s) => s !== stage)
                : [...prev, stage]
        );
    };

    const visibleStageKeys = stageKeys.filter(
        (stage) => !hiddenStages.includes(stage)
    );

    // ==========================
    // Tooltip customizado
    // ==========================
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;

        // soma de todos os segmentos da barra
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
                }}
            >
                {/* label = intervalo de datas */}
                <div
                    style={{
                        fontWeight: 600,
                        marginBottom: 4,
                        color: textColor,
                    }}
                >
                    {label}
                </div>

                {/* total consolidado da barra */}
                <div
                    style={{
                        fontWeight: 700,
                        fontSize: 12,
                        color: '#000', // preto
                        marginBottom: 6,
                    }}
                >
                    Total:{" "}
                    {total.toLocaleString('pt-BR', {
                        maximumFractionDigits: 0,
                    })}{" "}
                    ha
                </div>

                <div
                    style={{
                        borderTop: `1px solid ${tooltipBorder}`,
                        margin: '4px 0 6px',
                    }}
                />

                {/* lista dos segmentos (estágios) */}
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
                                    })}{" "}
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
            {/* Gráfico à esquerda */}
            <div style={{ flex: 1, height: 360 }}>
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
                        />
                        {/* Tooltip agora usa o CustomTooltip */}
                        <Tooltip content={<CustomTooltip />} />

                        {/* Barras empilhadas apenas para estágios visíveis */}
                        {visibleStageKeys.map((stage) => (
                            <Bar
                                key={stage}
                                dataKey={stage}
                                name={stage}
                                stackId="total"
                                fill={stageColorMap[stage]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legenda externa à direita - Accordion + Checkboxes */}
            <div
                style={{
                    width: 220,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    paddingTop: 4,
                    height: '100%',
                    marginTop: -64
                }}
            >
                {/* Cabeçalho do accordion */}
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

                {/* Corpo do accordion */}
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
                            maxHeight: 400,
                            overflowY: 'auto',
                            scrollbarWidth: 'thin',
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

                        {/* CHECKBOX MASTER (select all) */}
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

                        {/* LISTA DOS ESTÁGIOS */}
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
};



/* ==========================
   Subcomponente: "Calendário" semanal (produtos)
   ========================== */

const ProdutosSemanaCalendar = ({ data, dark }) => {
    const produtosSemana = useMemo(() => getProdutosPorSemana(data), [data]);
    const semanas = useMemo(
        () => groupByWeek(produtosSemana),
        [produtosSemana]
    );

    const cardBg = dark ? '#111827' : '#ffffff';
    const border = dark ? '#374151' : '#e5e7eb';
    const titleColor = dark ? '#f9fafb' : '#111827';
    const textColor = dark ? '#e5e7eb' : '#374151';
    const subText = dark ? '#9ca3af' : '#6b7280';

    if (!semanas.length) {
        return <p>Nenhum dado de produtos para exibir.</p>;
    }

    return (
        <div
            style={{
                display: 'grid',
                gap: 16,
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            }}
        >
            {semanas.map((week, ind) => {
                const label = formatWeekLabel(week.weekStart, week.weekEnd);
                return (
                    <div
                        key={week.weekKey}
                        style={{
                            borderRadius: 12,
                            padding: 12,
                            border: `1px solid ${border}`,
                            backgroundColor: cardBg,
                            boxShadow: dark
                                ? '0 10px 25px rgba(0,0,0,0.35)'
                                : '0 4px 12px rgba(15,23,42,0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                        }}
                    >
                        {/* Cabeçalho da semana */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                paddingBottom: 6,
                                borderBottom: `1px dashed ${border}`,
                                marginBottom: 4,
                            }}
                        >
                            <div>
                                <h3
                                    style={{
                                        marginBottom: 0,
                                        marginTop: 0,
                                        fontSize: 14,
                                        color: titleColor,
                                    }}
                                >
                                    Semana ({ind + 1})
                                </h3>
                                <div
                                    style={{
                                        fontSize: 12,
                                        color: subText,
                                    }}
                                >
                                    {label} (Dom - Sáb)
                                </div>
                            </div>

                            {/* total de itens na semana – opcional */}
                            <div
                                style={{
                                    fontSize: 11,
                                    color: subText,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {week.produtos.length} prod.
                            </div>
                        </div>

                        {/* Lista striped */}
                        <ul
                            style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {week.produtos.map((p, idx) => {
                                const isEven = idx % 2 === 0;
                                const rowBg = dark
                                    ? (isEven ? '#020617' : '#0b1120')
                                    : (isEven ? '#f9fafb' : '#eef2ff');

                                return (
                                    <li
                                        key={p.produto}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            fontSize: 12,
                                            color: textColor,
                                            padding: '6px 8px',
                                            backgroundColor: rowBg,
                                            borderRadius: 6,
                                            borderBottom: dark
                                                ? '1px solid rgba(15,23,42,0.7)'
                                                : '1px solid rgba(209,213,219,0.6)',
                                            marginBottom: idx === week.produtos.length - 1 ? 0 : 2,
                                        }}
                                    >
                                        <div
                                            style={{
                                                maxWidth: '60%',
                                                paddingRight: 8,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontWeight: 500,
                                                    letterSpacing: 0.2,
                                                }}
                                            >
                                                {p.produto}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                textAlign: 'right',
                                                maxWidth: '40%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-end',
                                                gap: 2,
                                                fontFamily:
                                                    'system-ui, -apple-system, BlinkMacSystemFont, "SF Mono", monospace',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {p.quantidadeTotal.toLocaleString('pt-BR', {
                                                    maximumFractionDigits: 2,
                                                    minimumFractionDigits: 2,
                                                })}{' '}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}
        </div>
    );

};

/* ==========================
   Subcomponente: Totais gerais por produto
   ========================== */

const ProdutosTotaisGerais = ({ data, dark }) => {
    const cardBg = dark ? '#111827' : '#ffffff';
    const border = dark ? '#374151' : '#e5e7eb';
    const textColor = dark ? '#e5e7eb' : '#374151';
    const subText = dark ? '#9ca3af' : '#6b7280';

    if (!data.length) {
        return <p>Nenhum dado de produtos para exibir.</p>;
    }

    // define quantas colunas usar (ajusta conforme o volume)
    let columnCount = 3;

    if (data.length > 10) columnCount = 4;
    if (data.length > 20) columnCount = 5;

    // ordena alfabeticamente primeiro
    const sorted = [...data].sort((a, b) => a.produto.localeCompare(b.produto));

    // calcula quantos itens por coluna (de cima para baixo)
    const itemsPerColumn = Math.ceil(sorted.length / columnCount);

    // distribui verticalmente (ordem correta: cima → baixo, esquerda → direita)
    const columns = Array.from({ length: columnCount }, (_, colIndex) =>
        sorted.slice(
            colIndex * itemsPerColumn,
            colIndex * itemsPerColumn + itemsPerColumn
        )
    );

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
            }}
        >
            {/* Cabeçalho geral */}
            <div
                style={{
                    borderRadius: 12,
                    padding: 12,
                    border: `1px solid ${border}`,
                    backgroundColor: cardBg,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                }}
            >
                <div>
                    <h3
                        style={{
                            marginBottom: 0,
                            marginTop: 0,
                            fontSize: 14,
                            color: textColor,
                        }}
                    >
                        Totais gerais de produtos
                    </h3>
                    <div
                        style={{
                            fontSize: 12,
                            color: subText,
                        }}
                    >
                        Soma de todas as semanas, considerando os filtros atuais.
                    </div>
                </div>

                <div
                    style={{
                        fontSize: 11,
                        color: subText,
                        whiteSpace: 'nowrap',
                    }}
                >
                    {data.length} produtos
                </div>
            </div>

            {/* Container das colunas */}
            <div
                style={{
                    display: 'grid',
                    gap: 12,
                    gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                }}
            >
                {columns.map((colItems, colIdx) => (
                    <div
                        key={colIdx}
                        style={{
                            borderRadius: 12,
                            padding: 8,
                            border: `1px solid ${border}`,
                            backgroundColor: cardBg,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                        }}
                    >
                        <ul
                            style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {colItems.map((p, idx) => {
                                const isEven = idx % 2 === 0;
                                const rowBg = dark
                                    ? (isEven ? '#020617' : '#0b1120')
                                    : (isEven ? '#f9fafb' : '#eef2ff');

                                return (
                                    <li
                                        key={`${p.produto}-${colIdx}-${idx}`}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            fontSize: 12,
                                            fontWeight: 'bold',
                                            color: textColor,
                                            padding: '6px 8px',
                                            backgroundColor: rowBg,
                                            borderRadius: 6,
                                            borderBottom: dark
                                                ? '1px solid rgba(15,23,42,0.7)'
                                                : '1px solid rgba(209,213,219,0.6)',
                                            marginBottom: idx === colItems.length - 1 ? 0 : 2,
                                        }}
                                    >
                                        {/* Nome do produto */}
                                        <div
                                            style={{
                                                maxWidth: '60%',
                                                paddingRight: 8,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontWeight: 'bold',
                                                    letterSpacing: 0.2,
                                                }}
                                                title={p.produto}
                                            >
                                                {p.produto}
                                            </div>
                                        </div>

                                        {/* Quantidade + área (como no estilo anterior comentado) */}
                                        <div
                                            style={{
                                                textAlign: 'right',
                                                maxWidth: '40%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-end',
                                                gap: 2,
                                                fontFamily:
                                                    'system-ui, -apple-system, BlinkMacSystemFont, "SF Mono", monospace',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {p.quantidadeTotal.toLocaleString('pt-BR', {
                                                    maximumFractionDigits: 2,
                                                    minimumFractionDigits: 2,
                                                })}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    color: subText,
                                                }}
                                            >
                                                área:{' '}
                                                {p.areaTotal.toLocaleString('pt-BR', {
                                                    maximumFractionDigits: 1,
                                                })}{' '}
                                                ha
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};




/* ==========================
   Componente principal ÚNICO
   ========================== */

const PlanejamentoProdutosDashboard = ({ data, dark = false }) => {
    const safeData = Array.isArray(data) ? data : [];

    const normalizedData = useMemo(
        () => safeData.map(normalizeItem),
        [safeData]
    );

    // opções de filtro (multiSelect simples por "chips")
    const fazendaOptions = useMemo(() => {
        const set = new Set();
        normalizedData.forEach((item) => {
            if (item.fazendaGrupo) set.add(item.fazendaGrupo);
        });
        return Array.from(set).sort();
    }, [normalizedData]);

    const projetoOptions = useMemo(() => {
        const set = new Set();
        normalizedData.forEach((item) => {
            if (item.projeto) set.add(item.projeto);
        });
        return Array.from(set).sort();
    }, [normalizedData]);

    const [selectedFazendas, setSelectedFazendas] = useState([]);
    const [selectedProjetos, setSelectedProjetos] = useState([]);

    // estágios ocultos (compartilhado entre gráfico, KPIs e cards)
    const [hiddenStages, setHiddenStages] = useState([]);

    // switch: considerar apenas aplicações pendentes (situacaoApp === false)
    const [onlyPendentes, setOnlyPendentes] = useState(false);

    const handleToggleFazenda = (value) => {
        setSelectedFazendas((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    const handleToggleProjeto = (value) => {
        setSelectedProjetos((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    // controla se o "Detalhamento por produto e semana" está aberto
    const [showProdutosSemana, setShowProdutosSemana] = useState(false);

    // controla se o "Totais gerais por produto" está aberto
    const [showTotaisGerais, setShowTotaisGerais] = useState(false);

    const toggleShowProdutosSemana = () => {
        setShowProdutosSemana((prev) => !prev);
    };

    const toggleShowTotaisGerais = () => {
        setShowTotaisGerais((prev) => !prev);
    };

    // 1) filtros básicos: fazenda, projeto, situação (pendente ou não)
    const filteredData = useMemo(() => {
        return normalizedData.filter((item) => {
            const passFazenda =
                !selectedFazendas.length ||
                (item.fazendaGrupo && selectedFazendas.includes(item.fazendaGrupo));

            const passProjeto =
                !selectedProjetos.length ||
                (item.projeto && selectedProjetos.includes(item.projeto));

            const passSituacao =
                !onlyPendentes || item.situacaoApp === false;

            return passFazenda && passProjeto && passSituacao;
        });
    }, [normalizedData, selectedFazendas, selectedProjetos, onlyPendentes]);

    // 2) aplica também o filtro de estágio (checkboxes) para KPIs + cards
    const dataFiltradaPorEstagio = useMemo(() => {
        if (!hiddenStages.length) return filteredData;

        return filteredData.filter((item) => {
            const stageKey = getStageKey(item.estagio);
            return !hiddenStages.includes(stageKey);
        });
    }, [filteredData, hiddenStages]);

    // dados para o calendário, baseados em dataFiltradaPorEstagio
    const dataProdutosCalendario = useMemo(() => {
        return dataFiltradaPorEstagio
            .filter((item) => item.tipo !== 'operacao')
            .sort((a, b) => {
                const pa = a.produto || '';
                const pb = b.produto || '';
                return pa.localeCompare(pb);
            });
    }, [dataFiltradaPorEstagio]);

    // dados de TOTAIS GERAIS por produto (soma todas as semanas)
    const dataProdutosTotaisGerais = useMemo(() => {
        const map = new Map();

        dataProdutosCalendario.forEach((item) => {
            const produto = item.produto || 'Sem produto';
            if (!map.has(produto)) {
                map.set(produto, {
                    produto,
                    quantidadeTotal: 0,
                    areaTotal: 0,
                });
            }
            const ref = map.get(produto);
            ref.quantidadeTotal += item.quantidadeCalculada || 0;
            ref.areaTotal += item.area || 0;
        });

        return Array.from(map.values()).sort((a, b) =>
            a.produto.localeCompare(b.produto)
        );
    }, [dataProdutosCalendario]);

    const bg = dark ? '#020617' : '#f9fafb';
    const text = dark ? '#f9fafb' : '#0f172a';
    const subText = dark ? '#9ca3af' : '#6b7280';
    const sectionBorder = dark ? '#1f2937' : '#e5e7eb';
    const chipBg = dark ? '#111827' : '#e5e7eb';
    const chipBorder = dark ? '#4b5563' : '#d1d5db';
    const chipSelectedBg = dark ? '#1d4ed8' : '#2563eb';
    const chipSelectedText = '#f9fafb';

    // KPIs agora baseados em dataFiltradaPorEstagio (inclui filtro de estágio)
    const kpis = useMemo(() => {
        let areaTotal = 0;
        let quantidadeTotal = 0;
        let primeiraData = null;
        let ultimaData = null;

        dataFiltradaPorEstagio.forEach((item) => {
            if (item.tipo === 'operacao') {
                areaTotal += item.area || 0;
            }
            quantidadeTotal += item.quantidadeCalculada || 0;

            if (item.dataPrevista instanceof Date && !isNaN(item.dataPrevista)) {
                if (!primeiraData || item.dataPrevista < primeiraData) {
                    primeiraData = item.dataPrevista;
                }
                if (!ultimaData || item.dataPrevista > ultimaData) {
                    ultimaData = item.dataPrevista;
                }
            }
        });

        const periodo =
            primeiraData && ultimaData
                ? `${formatDateBR(primeiraData)} - ${formatDateBR(ultimaData)}`
                : '—';

        return {
            areaTotal,
            quantidadeTotal,
            periodoAplicacoes: periodo,
        };
    }, [dataFiltradaPorEstagio]);

    return (
        <div
            style={{
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                backgroundColor: bg,
                color: text,
                borderRadius: 16,
            }}
        >
            {/* Título */}
            <div>
                <h2
                    style={{
                        margin: 0,
                        marginBottom: 4,
                        fontSize: 20,
                    }}
                >
                    Planejamento de Produtos por Semana
                </h2>
                <p
                    style={{
                        margin: 0,
                        fontSize: 13,
                        color: subText,
                    }}
                >
                    Baseado na data prevista de aplicação agrupado em semanas de domingo a
                    sábado. O gráfico mostra a área total de operações por semana
                    empilhada por estágio; os cards detalham produtos (dose × área).
                </p>
            </div>

            {/* Filtros */}
            <div
                style={{
                    borderRadius: 12,
                    padding: 16,
                    border: `1px solid ${sectionBorder}`,
                    backgroundColor: dark ? '#020617' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                }}
            >
                {/* Switch de aplicações pendentes */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 4,
                    }}
                >
                    <FormControlLabel
                        control={
                            <Switch
                                checked={onlyPendentes}
                                onChange={(e) => setOnlyPendentes(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Considerar Somente Aplicações Pendentes"
                        sx={{
                            '.MuiFormControlLabel-label': {
                                fontSize: 13,
                                color: subText,
                            },
                        }}
                    />
                </div>

                <div style={{ fontSize: 13, color: subText, marginBottom: 4 }}>
                    Filtros (multiSeleção) — todos os gráficos e cards são afetados.
                </div>

                {/* Filtro por Fazenda */}
                {fazendaOptions.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>
                            Fazenda / Grupo
                        </span>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 8,
                            }}
                        >
                            {fazendaOptions.map((fz) => {
                                const selected = selectedFazendas.includes(fz);
                                return (
                                    <button
                                        key={fz}
                                        type="button"
                                        onClick={() => handleToggleFazenda(fz)}
                                        style={{
                                            borderRadius: 999,
                                            padding: '4px 10px',
                                            border: `1px solid ${selected ? chipSelectedBg : chipBorder
                                                }`,
                                            backgroundColor: selected ? chipSelectedBg : chipBg,
                                            color: selected ? chipSelectedText : text,
                                            fontSize: 12,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {fz}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Filtro por Projeto */}
                {projetoOptions.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>Projeto</span>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 8,
                            }}
                        >
                            {projetoOptions.map((proj) => {
                                const selected = selectedProjetos.includes(proj);
                                return (
                                    <button
                                        key={proj}
                                        type="button"
                                        onClick={() => handleToggleProjeto(proj)}
                                        style={{
                                            borderRadius: 999,
                                            padding: '4px 10px',
                                            border: `1px solid ${selected ? chipSelectedBg : chipBorder
                                                }`,
                                            backgroundColor: selected ? chipSelectedBg : chipBg,
                                            color: selected ? chipSelectedText : text,
                                            fontSize: 12,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {proj}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* KPIs */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 16,
                }}
            >
                <div
                    style={{
                        borderRadius: 12,
                        padding: 16,
                        border: `1px solid ${sectionBorder}`,
                        backgroundColor: dark ? '#020617' : '#ffffff',
                    }}
                >
                    <div style={{ fontSize: 12, color: subText }}>
                        Área total (soma operações)
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 600 }}>
                        {kpis.areaTotal.toLocaleString('pt-BR', {
                            maximumFractionDigits: 0,
                        })}{' '}
                        ha
                    </div>
                </div>

                <div
                    style={{
                        borderRadius: 12,
                        padding: 16,
                        border: `1px solid ${sectionBorder}`,
                        backgroundColor: dark ? '#020617' : '#ffffff',
                    }}
                >
                    <div style={{ fontSize: 12, color: subText }}>
                        Qtd. total de produto (dose × ha)
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 600 }}>
                        {kpis.quantidadeTotal.toLocaleString('pt-BR', {
                            maximumFractionDigits: 0,
                        })}
                    </div>
                </div>

                <div
                    style={{
                        borderRadius: 12,
                        padding: 16,
                        border: `1px solid ${sectionBorder}`,
                        backgroundColor: dark ? '#020617' : '#ffffff',
                    }}
                >
                    <div style={{ fontSize: 12, color: subText }}>
                        Período das aplicações previstas
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 600, paddingTop: 3 }}>
                        {kpis.periodoAplicacoes}
                    </div>
                </div>
            </div>

            {/* Gráfico semanal (operações empilhadas por estágio) */}
            <section
                style={{
                    paddingTop: 8,
                    borderTop: `1px solid ${sectionBorder}`,
                }}
            >
                <h3 style={{ marginBottom: 4, fontSize: 16 }}>
                    Quantidade semanal de operações (área total por estágio)
                </h3>
                <p
                    style={{
                        marginTop: 0,
                        marginBottom: 8,
                        fontSize: 12,
                        color: subText,
                    }}
                >
                    Para cada semana (domingo a sábado), soma a área de todas as
                    operações (tipo = &quot;operacao&quot;), empilhando por estágio da
                    operação. A altura total da barra é igual ao total de área da semana.
                </p>
                <ProdutosSemanaChart
                    data={filteredData}
                    dark={dark}
                    hiddenStages={hiddenStages}
                    setHiddenStages={setHiddenStages}
                />
            </section>

            {/* Calendário semanal (produtos) */}
            <section
                style={{
                    paddingTop: 8,
                    borderTop: `1px solid ${sectionBorder}`,
                }}
            >
                {/* Header: título + seta */}
                <div
                    onClick={toggleShowProdutosSemana}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        gap: 8,
                    }}
                >
                    <h3 style={{ marginBottom: 4, fontSize: 16 }}>
                        Detalhamento por produto e semana
                    </h3>

                    <ExpandMoreIcon
                        sx={{
                            fontSize: 24,
                            color: subText,
                            transform: showProdutosSemana ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.15s ease-out",
                        }}
                    />
                </div>

                <p
                    style={{
                        marginTop: 0,
                        marginBottom: 8,
                        fontSize: 12,
                        color: subText,
                    }}
                >
                    Em cada card, são mostradas a data inicial (domingo) e a data final
                    (sábado) e os produtos com suas quantidades totais (dose × área) e
                    área aplicada.
                </p>

                {showProdutosSemana && (
                    <ProdutosSemanaCalendar
                        data={dataProdutosCalendario}
                        dark={dark}
                    />
                )}

            </section>

            {/* Totais gerais por produto (NOVO ACCORDION) */}
            <section
                style={{
                    paddingTop: 8,
                    borderTop: `1px solid ${sectionBorder}`,
                }}
            >
                <div
                    onClick={toggleShowTotaisGerais}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        gap: 8,
                    }}
                >
                    <h3 style={{ marginBottom: 4, fontSize: 16 }}>
                        Totais gerais por produto
                    </h3>

                    <ExpandMoreIcon
                        sx={{
                            fontSize: 24,
                            color: subText,
                            transform: showTotaisGerais ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.15s ease-out",
                        }}
                    />
                </div>

                <p
                    style={{
                        marginTop: 0,
                        marginBottom: 8,
                        fontSize: 12,
                        color: subText,
                    }}
                >
                    Soma de todas as semanas para cada produto (dose × área e área total),
                    considerando os mesmos filtros de fazenda, projeto, pendências e estágios.
                </p>

                {showTotaisGerais && (
                    <ProdutosTotaisGerais
                        data={dataProdutosTotaisGerais}
                        dark={dark}
                    />
                )}
            </section>

        </div>
    );
};

export default PlanejamentoProdutosDashboard;
