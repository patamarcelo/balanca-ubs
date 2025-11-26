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
    Legend,
    CartesianGrid,
} from 'recharts';

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


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

// função de operação (conforme pedido)
function isOperacao(item) {
    // Por enquanto, considera que todo item é uma operação válida
    // return true;
    // console.log('item', item)
    return item.tipo === 'operacao'; // exemplo
}

// Soma da área por semana (dataPrevista) apenas para operações,
// separado por estágio (barra empilhada)
function getOperacoesPorSemanaComEstagio(data) {
    const weekMap = new Map();
    const stageStats = new Map(); // guarda info de DAP por estágio

    data.forEach((item) => {
        if (!item.dataPrevista) return;
        if (!isOperacao(item)) return;

        const { weekKey, start, end } = getWeekRange(item.dataPrevista);
        const stageKey = getStageKey(item.estagio);
        const area = item.area || 0;
        const dap = item.dap != null ? Number(item.dap) : null;

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
        week[stageKey] = (week[stageKey] || 0) + area;

        // acumula estatística de DAP por estágio (menor DAP)
        if (!stageStats.has(stageKey)) {
            stageStats.set(stageKey, { minDap: dap });
        } else if (dap != null) {
            const current = stageStats.get(stageKey);
            if (current.minDap == null || dap < current.minDap) {
                current.minDap = dap;
                stageStats.set(stageKey, current);
            }
        }
    });

    const weeks = Array.from(weekMap.values()).sort((a, b) =>
        a.weekKey.localeCompare(b.weekKey)
    );

    const stageKeys = Array.from(stageStats.entries())
        .sort((a, b) => {
            const dapA = a[1].minDap;
            const dapB = b[1].minDap;

            // primeiro ordena por DAP (nulls por último)
            if (dapA == null && dapB == null) {
                return a[0].localeCompare(b[0]); // desempate alfabético
            }
            if (dapA == null) return 1;
            if (dapB == null) return -1;
            return dapA - dapB;
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

    // se quiser mapear por nome, dá pra fazer um switch aqui
    return palette[index % palette.length];
}

/* ==========================
   Subcomponente: Gráfico semanal (operações empilhadas por estágio)
   ========================== */

/* ==========================
   Subcomponente: Gráfico semanal (operações empilhadas por estágio)
   ========================== */

const ProdutosSemanaChart = ({ data, dark }) => {
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

    // controla quais estágios estão ocultos
    const [hiddenStages, setHiddenStages] = useState([]);
    const [accordionOpen, setAccordionOpen] = useState(true);

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
                        <Tooltip
                            contentStyle={{
                                backgroundColor: tooltipBg,
                                border: `1px solid ${tooltipBorder}`,
                                borderRadius: 8,
                                fontSize: 12,
                            }}
                            labelStyle={{ color: textColor }}
                            formatter={(value, name) => [
                                value.toLocaleString('pt-BR', {
                                    maximumFractionDigits: 1,
                                }),
                                `${name} (ha)`,
                            ]}
                        />

                        {/* Barras empilhadas apenas para estágios visíveis */}
                        {visibleStageKeys.map((stage, index) => (
                            <Bar
                                key={stage}
                                dataKey={stage}
                                name={stage}
                                stackId="total"
                                fill={getStageColor(stage, index, dark)}
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
                            scrollbarWidth: 'thin', // Firefox
                        }}
                    >
                        <div
                            style={{
                                fontSize: 11,
                                color: legendSub,
                                marginBottom: 2,
                            }}
                        >
                            Marque/desmarque para mostrar/ocultar estágios no gráfico:
                        </div>

                        {stageKeys.map((stage, index) => {
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
                                            backgroundColor: getStageColor(stage, index, dark),
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
                            padding: 16,
                            border: `1px solid ${border}`,
                            backgroundColor: cardBg,
                            boxShadow: dark
                                ? '0 10px 25px rgba(0,0,0,0.4)'
                                : '0 4px 12px rgba(15,23,42,0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                        }}
                    >
                        <div>
                            <h3
                                style={{
                                    marginBottom: 2,
                                    marginTop: 0,
                                    fontSize: 15,
                                    color: titleColor,
                                }}
                            >
                                Semana ({ind + 1})
                            </h3>
                            <div
                                style={{
                                    fontSize: 13,
                                    color: subText,
                                }}
                            >
                                {label} (Dom - Sáb)
                            </div>
                        </div>

                        <ul
                            style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4,
                            }}
                        >
                            {week.produtos.map((p) => (
                                <li
                                    key={p.produto}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        fontSize: 13,
                                        color: textColor,
                                    }}
                                >
                                    <div style={{ maxWidth: '60%' }}>
                                        <div style={{ fontWeight: 500 }}>{p.produto}</div>
                                        {p.tipo && (
                                            <div style={{ fontSize: 11, color: subText }}>
                                                {p.tipo}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right', maxWidth: '40%' }}>
                                        <div>
                                            {p.quantidadeTotal.toLocaleString('pt-BR', {
                                                maximumFractionDigits: 2,
                                            })}{' '}
                                        </div>
                                        <div style={{ fontSize: 11, color: subText }}>
                                            área:{' '}
                                            {p.areaTotal.toLocaleString('pt-BR', {
                                                maximumFractionDigits: 1,
                                            })}{' '}
                                            ha
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
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

    const toggleShowProdutosSemana = () => {
        setShowProdutosSemana((prev) => !prev);
    };

    // aplica filtros (fazendaGrupo e/ou projeto) em TODOS os dados
    const filteredData = useMemo(() => {
        return normalizedData.filter((item) => {
            const passFazenda =
                !selectedFazendas.length ||
                (item.fazendaGrupo && selectedFazendas.includes(item.fazendaGrupo));

            const passProjeto =
                !selectedProjetos.length ||
                (item.projeto && selectedProjetos.includes(item.projeto));

            return passFazenda && passProjeto;
        });
    }, [normalizedData, selectedFazendas, selectedProjetos]);

    const bg = dark ? '#020617' : '#f9fafb';
    const text = dark ? '#f9fafb' : '#0f172a';
    const subText = dark ? '#9ca3af' : '#6b7280';
    const sectionBorder = dark ? '#1f2937' : '#e5e7eb';
    const chipBg = dark ? '#111827' : '#e5e7eb';
    const chipBorder = dark ? '#4b5563' : '#d1d5db';
    const chipSelectedBg = dark ? '#1d4ed8' : '#2563eb';
    const chipSelectedText = '#f9fafb';

    // KPIs simples (com base nos dados filtrados)
    const kpis = useMemo(() => {
        let areaTotal = 0;
        let quantidadeTotal = 0;
        let primeiraData = null;
        let ultimaData = null;

        filteredData.forEach((item) => {
            // console.log('item here total: ', item)
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
    }, [filteredData]);

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
                <ProdutosSemanaChart data={filteredData} dark={dark} />
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

                    {/* Ícone Material UI — rotacionado */}
                    <ExpandMoreIcon
                        sx={{
                            fontSize: 24,
                            color: subText,
                            transform: showProdutosSemana ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.15s ease-out",
                        }}
                    />
                </div>

                {/* Texto sempre visível — exatamente como antes */}
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

                {/* Conteúdo condicional (abre/fecha) */}
                {showProdutosSemana && (
                    <ProdutosSemanaCalendar
                        data={filteredData
                            .filter((data) => data.tipo !== 'operacao')
                            .sort((a, b) => a.produto.localeCompare(b.produto))
                        }
                        dark={dark}
                    />
                )}

            </section>

        </div>
    );
};

export default PlanejamentoProdutosDashboard;
