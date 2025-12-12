// PlanejamentoProdutosDashboard.jsx
// Requer: npm install recharts

import React, { useMemo, useState } from 'react';

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Switch,
    FormControlLabel,
    Box,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
} from '@mui/material';

import { useTheme } from "@mui/material/styles";
import { tokens } from '../../../theme';

import ProdutosSemanaChart from './dashboard/GeneralChart';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';

import * as XLSX from 'xlsx';


/* ==========================
   Helpers de normalização
   ========================== */

function isCurrentWeek(date) {
    if (!date) return false;
    const now = new Date();

    // início da semana atual (segunda-feira)
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(now.getDate() - ((now.getDay() + 6) % 7));

    // fim da semana atual (domingo)
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return date >= start && date <= end;
}


function parsePtNumber(str) {
    if (str == null) return 0;
    return Number(
        String(str)
            .replace(/\./g, '')
            .replace(',', '.')
    );
}

function parseDateLocal(value) {
    if (!value) return null;
    if (value instanceof Date) return value;

    const str = String(value).trim();

    // Formato ISO simples: 2025-11-01
    let m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
        const [, y, mo, d] = m;
        return new Date(Number(y), Number(mo) - 1, Number(d));
    }

    // Formato brasileiro: 01/11/2025 (dia/mês/ano)
    m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m) {
        const [, d, mo, y] = m;
        return new Date(Number(y), Number(mo) - 1, Number(d));
    }

    // fallback: tenta parser padrão, mas se der NaN, retorna null
    const parsed = new Date(str);
    return isNaN(parsed.getTime()) ? null : parsed;
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

    // ========================
    // DAP: usar SEMPRE dapAplicacao do objeto original
    // ========================
    const dapAplicacaoRaw =
        raw.dapAplicacao !== undefined &&
            raw.dapAplicacao !== null &&
            raw.dapAplicacao !== ''
            ? raw.dapAplicacao
            : null;

    const dap =
        dapAplicacaoRaw !== null && dapAplicacaoRaw !== ''
            ? Number(dapAplicacaoRaw)
            : null;

    return {
        ...raw,
        area,
        dose,
        quantidadeAplicar,
        quantidadeCalculada,

        ciclo: raw.ciclo != null ? Number(raw.ciclo) : null,

        // valor normalizado que TODO o resto do código vai usar
        dap,

        // opcional: pra debug, se quiser ver o original
        dapAplicacaoOriginal: raw.dapAplicacao ?? null,

        capacidadePlantioDia:
            raw.capacidadePlantioDia != null
                ? Number(raw.capacidadePlantioDia)
                : 0,
        dataPlantio: parseDateLocal(raw.dataPlantio),
        dataPrevista: parseDateLocal(raw.dataPrevista),
        programaStartDate: parseDateLocal(raw.programaStartDate),
        programaEndDate: parseDateLocal(raw.programaEndDate),
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

// Agrupa produtos por período (semana / quinzena / mês)
// agora também guarda quebra por fazenda / projeto dentro de cada produto
function groupProdutosPorPeriodo(data, view) {
    const map = new Map();

    data.forEach((item) => {
        const date = item.dataPrevista;
        if (!(date instanceof Date) || isNaN(date)) return;

        const year = date.getFullYear();
        const month = date.getMonth(); // 0-11

        let key;
        let start;
        let end;
        let label;

        if (view === 'semana') {
            const { weekKey, start: s, end: e } = getWeekRange(date);
            key = weekKey;
            start = s;
            end = e;
            label = formatWeekLabel(start, end);
        } else if (view === 'quinzena') {
            const day = date.getDate();
            const firstHalf = day <= 15;
            const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

            start = new Date(year, month, firstHalf ? 1 : 16);
            end = new Date(year, month, firstHalf ? 15 : lastDayOfMonth);

            const mes = String(month + 1).padStart(2, '0');
            const faixa = firstHalf ? `01-15` : `16-${String(lastDayOfMonth).padStart(2, '0')}`;
            key = `${year}-${mes}-${faixa}`;
            label = `${formatDateBR(start)} - ${formatDateBR(end)}`;
        } else {
            // 'mes'
            const first = new Date(year, month, 1);
            const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
            const last = new Date(year, month, lastDayOfMonth);

            const mes = String(month + 1).padStart(2, '0');
            key = `${year}-${mes}`;
            start = first;
            end = last;
            label = `${mes}/${year}`;
        }

        if (!map.has(key)) {
            map.set(key, {
                periodKey: key,
                periodStart: start,
                periodEnd: end,
                periodLabel: label,
                // OBS: aqui continua sendo um Map de produtos
                produtos: new Map(),
            });
        }

        const bucket = map.get(key);
        const prodName = item.produto || 'Sem produto';

        // cria o “bucket” do produto dentro do período
        if (!bucket.produtos.has(prodName)) {
            bucket.produtos.set(prodName, {
                produto: prodName,
                tipo: item.tipo || '-',
                quantidadeTotal: 0,
                areaTotal: 0,
                // 👉 novo: quebra interna por fazenda / projeto
                porProjeto: new Map(),
            });
        }

        const ref = bucket.produtos.get(prodName);

        // consolidação geral do produto no período (como já era)
        ref.quantidadeTotal += item.quantidadeCalculada || 0;
        ref.areaTotal += item.area || 0;

        // ================================
        //   QUEBRA POR FAZENDA / PROJETO
        // ================================
        const fazenda = item.fazendaGrupo || 'Sem fazenda';
        const projeto = item.projeto || 'Sem projeto';
        const projKey = `${fazenda}||${projeto}`;

        if (!ref.porProjeto.has(projKey)) {
            ref.porProjeto.set(projKey, {
                fazenda,
                projeto,
                quantidadeTotal: 0,
                areaTotal: 0,
                // 👉 novo: quebra por estágio dentro do projeto
                porEstagio: new Map(),
            });
        }

        const det = ref.porProjeto.get(projKey);
        det.quantidadeTotal += item.quantidadeCalculada || 0;
        det.areaTotal += item.area || 0;

        const stageKey = getStageKey(item.estagio); // já existe no seu arquivo

        // 👉 acumula por estágio
        if (!det.porEstagio.has(stageKey)) {
            det.porEstagio.set(stageKey, {
                estagio: stageKey,
                quantidadeTotal: 0,
                areaTotal: 0,
            });
        }

        const st = det.porEstagio.get(stageKey);
        st.quantidadeTotal += item.quantidadeCalculada || 0;
        st.areaTotal += item.area || 0;
    });

    // converte os Maps para arrays “limpos” para uso na UI/export
    return Array.from(map.values())
        .map((periodo) => {
            const produtosArr = Array.from(periodo.produtos.values()).map((prod) => ({
                produto: prod.produto,
                tipo: prod.tipo,
                quantidadeTotal: prod.quantidadeTotal,
                areaTotal: prod.areaTotal,
                // porProjeto agora é um array [{fazenda, projeto, quantidadeTotal, areaTotal}, ...]
                porProjeto: Array.from(prod.porProjeto.values()).map((pp) => ({
                    fazenda: pp.fazenda,
                    projeto: pp.projeto,
                    quantidadeTotal: pp.quantidadeTotal,
                    areaTotal: pp.areaTotal,
                    // 👉 novo: array de estágios
                    porEstagio: Array.from(pp.porEstagio.values()).sort((a, b) =>
                        String(a.estagio).localeCompare(String(b.estagio))
                    ),
                }))
            }));

            return {
                periodKey: periodo.periodKey,
                periodStart: periodo.periodStart,
                periodEnd: periodo.periodEnd,
                periodLabel: periodo.periodLabel,
                produtos: produtosArr.sort((a, b) =>
                    a.produto.localeCompare(b.produto)
                ),
            };
        })
        .sort((a, b) => {
            if (!a.periodStart || !b.periodStart) return 0;
            return a.periodStart - b.periodStart;
        });
}


/* ==========================
   Helpers de estágio
   ========================== */

function getStageKey(estagio) {
    if (!estagio) return 'Sem estágio';
    return String(estagio).split('|')[0].trim() || 'Sem estágio';
}

// Lê o primeiro número (com sinal) do label para ordenar
// e, se não tiver número, usa um mapa manual por nome.
// Retorna um número (pode ser negativo, zero, positivo) ou null.
function getStageOrderFromLabel(stageKey) {
    if (!stageKey) return null;

    const text = String(stageKey).trim();

    // normaliza traço unicode "−" pra "-" normal
    const normalizedNumText = text.replace(/\u2212/g, "-");

    // 1) tenta extrair número com sinal (ex.: "-5", "0", "14", "2")
    const match = normalizedNumText.match(/[-+]?\d+/);
    if (match) {
        const num = Number.parseInt(match[0], 10);
        if (!Number.isNaN(num)) {
            return num; // negativos < 0 < positivos
        }
    }

    // 2) sem número -> usa mapa de prioridades por NOME
    // normaliza removendo acentos e deixando maiúsculo
    const normName = text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

    const stageOrderMapByName = {
        // muito cedo
        "TRATAMENTO SEMENTE": -50,
        "ROLO COMPACTADOR": -45,

        // adubações iniciais
        "ADUBACAO FOSFATADA": -40,
        "ADUBACAO KCL": -38,
        "SULFATO": -36,
        "ADUBACAO BORO": -34,

        // pré emergente antes dos “dias”
        "PRE EMERGENTE": -30,
        "PRE-EMERGENTE": -30,
        "PRE EMERGENCIA": -30,

        // se tiver PLANTIO isolado
        "PLANTIO": -10,

        // primórdio bem no fim (ajusta se quiser)
        "APLICACAO PRIMORDIO": 80,

        // dessecação geral / colheita lá no final
        "DESSECACAO": 900,
        "DESSECAO": 900,
        "DESSECACAO COLHEITA": 999,
        "DESSECAO COLHEITA": 999,
    };

    if (normName in stageOrderMapByName) {
        return stageOrderMapByName[normName];
    }

    // 3) fallback: sem ordem definida -> fica no fim, mas a gente ainda ordena por nome depois
    return null;
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
        ref.quantidadeTotal += item.quantidadeCalculada || 0;
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
   Subcomponente: Gráfico semanal (operações empilhadas por estágio)
   ========================== */




/* ==========================
   Subcomponente: "Calendário" semanal (produtos)
   ========================== */

const ProdutosSemanaCalendar = ({ data, dark }) => {
    const produtosSemana = useMemo(() => getProdutosPorSemana(data), [data]);
    const semanas = useMemo(
        () => groupByWeek(produtosSemana),
        [produtosSemana]
    );

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isDark = dark ?? theme.palette.mode === "dark";

    const cardBg = isDark ? colors.primary[600] : colors.blueOrigin[800];
    const border = isDark ? colors.grey[700] : colors.grey[300];
    const titleColor = isDark ? colors.textColor[100] : colors.textColor[100];
    const textColor = isDark ? colors.grey[100] : colors.grey[700];
    const subText = isDark ? colors.grey[400] : colors.grey[600];

    const paperShadow = isDark
        ? '0px 8px 18px rgba(0,0,0,0.55)'
        : '0px 6px 12px rgba(15,23,42,0.16)';

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
                            boxShadow: paperShadow,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                        }}
                    >
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
                                const rowBg = isDark
                                    ? (isEven ? colors.primary[500] : colors.primary[600])
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
                                            borderBottom: isDark
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
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isDark = dark ?? theme.palette.mode === "dark";

    const cardBg = isDark ? colors.primary[600] : colors.blueOrigin[800];
    const border = isDark ? colors.grey[700] : colors.grey[300];
    const textColor = isDark ? colors.grey[100] : colors.grey[700];
    const subText = isDark ? colors.grey[400] : colors.grey[600];

    const paperShadow = isDark
        ? '0px 8px 18px rgba(0,0,0,0.55)'
        : '0px 6px 12px rgba(15,23,42,0.16)';

    const paperShadowLight = isDark
        ? '0px 4px 10px rgba(0,0,0,0.5)'
        : '0px 2px 6px rgba(15,23,42,0.14)';

    if (!data.length) {
        return <p>Nenhum dado de produtos para exibir.</p>;
    }

    let columnCount = 3;

    if (data.length > 10) columnCount = 4;
    if (data.length > 20) columnCount = 5;

    const sorted = [...data].sort((a, b) => a.produto.localeCompare(b.produto));
    const itemsPerColumn = Math.ceil(sorted.length / columnCount);

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
            <div
                style={{
                    borderRadius: 12,
                    padding: 12,
                    border: `1px solid ${border}`,
                    backgroundColor: cardBg,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    boxShadow: paperShadowLight,
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
                            boxShadow: paperShadowLight,
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
                                const rowBg = isDark
                                    ? (isEven ? colors.primary[500] : colors.primary[600])
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
                                            borderBottom: isDark
                                                ? '1px solid rgba(15,23,42,0.7)'
                                                : '1px solid rgba(209,213,219,0.6)',
                                            marginBottom: idx === colItems.length - 1 ? 0 : 2,
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
                                                    fontWeight: 'bold',
                                                    letterSpacing: 0.2,
                                                }}
                                                title={p.produto}
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
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isDark = dark ?? theme.palette.mode === "dark";

    const safeData = Array.isArray(data) ? data : [];

    const normalizedData = useMemo(
        () => safeData.map(normalizeItem),
        [safeData]
    );

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

    const culturaOptions = useMemo(() => {
        const set = new Set();
        normalizedData.forEach((item) => {
            if (item.cultura) set.add(item.cultura);
        });
        return Array.from(set).sort();
    }, [normalizedData]);

    const programaOptions = useMemo(() => {
        const set = new Set();
        normalizedData.forEach((item) => {
            if (item.programa) set.add(item.programa);
        });
        return Array.from(set).sort();
    }, [normalizedData]);

    const [selectedFazendas, setSelectedFazendas] = useState([]);
    const [selectedProjetos, setSelectedProjetos] = useState([]);
    const [selectedCulturas, setSelectedCulturas] = useState([]);
    const [selectedProgramas, setSelectedProgramas] = useState([]);

    const [hiddenStages, setHiddenStages] = useState([]);
    const [onlyPendentes, setOnlyPendentes] = useState(true);
    const [onlyInicializadoPlantio, setOnlyInicializadoPlantio] = useState(true);

    // Visão de produtos por período (apenas para o novo card)
    const [showVisaoProdutosPeriodo, setShowVisaoProdutosPeriodo] = useState(false);

    const [produtoViewMode, setProdutoViewMode] = useState('semana'); // 'semana' | 'quinzena' | 'mes'
    const [filtroTiposVisao, setFiltroTiposVisao] = useState([]);
    const [filtroProdutosVisao, setFiltroProdutosVisao] = useState([]);

    // logo depois dos outros useState de filtros
    const tipoAplicacaoOptions = ["Operacao", "Solido", "Liquido"];

    const [selectedTiposAplicacao, setSelectedTiposAplicacao] = useState([
        "Operacao",
        "Solido",
        "Liquido",
    ]);


    const handleToggleTipoAplicacao = (value) => {
        setSelectedTiposAplicacao((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };


    const handleToggleFazenda = (value, disabled) => {
        if (disabled) return;
        setSelectedFazendas((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    const handleToggleProjeto = (value, disabled) => {
        if (disabled) return;
        setSelectedProjetos((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    const handleToggleCultura = (value, disabled) => {
        if (disabled) return;
        setSelectedCulturas((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    const handleTogglePrograma = (value, disabled) => {
        if (disabled) return;
        setSelectedProgramas((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    const [showProdutosSemana, setShowProdutosSemana] = useState(false);
    const [showTotaisGerais, setShowTotaisGerais] = useState(false);

    const toggleShowProdutosSemana = () => {
        setShowProdutosSemana((prev) => !prev);
    };

    const toggleShowTotaisGerais = () => {
        setShowTotaisGerais((prev) => !prev);
    };

    // Exporta um período em Excel com 2 abas:
    // 1) produtos_projeto_fazenda (detalhado)
    // 2) totais_produtos (somente total por produto)
    const handleDownloadPeriodo = (periodo) => {
        if (!periodo || !periodo.produtos?.length) return;

        // Helper: força número com 2 casas decimais
        const to2 = (v) => Number(parseFloat(v ?? 0).toFixed(2));

        // ============================
        // 1) Aba DETALHADO (produto × fazenda × projeto)
        // ============================
        const detalhadoRows = [];

        periodo.produtos.forEach((p) => {
            if (p.porProjeto && p.porProjeto.length) {
                p.porProjeto.forEach((fp) => {
                    // Se tiver estágios, explode em linhas por estágio
                    if (fp.porEstagio && fp.porEstagio.length) {
                        fp.porEstagio.forEach((st) => {
                            detalhadoRows.push({
                                Período: periodo.periodLabel,
                                Fazenda: fp.fazenda || '',
                                Projeto: fp.projeto || '',
                                Produto: p.produto,
                                Tipo: p.tipo,
                                Estágio: st.estagio || 'Sem estágio',
                                Quantidade: to2(st.quantidadeTotal),
                                "Área (ha)": to2(st.areaTotal),
                            });
                        });
                    } else {
                        // fallback: sem estágios, vai no total do projeto
                        detalhadoRows.push({
                            Período: periodo.periodLabel,
                            Fazenda: fp.fazenda || '',
                            Projeto: fp.projeto || '',
                            Produto: p.produto,
                            Tipo: p.tipo,
                            Estágio: 'Sem estágio',
                            Quantidade: to2(fp.quantidadeTotal),
                            "Área (ha)": to2(fp.areaTotal),
                        });
                    }
                });
            } else {
                // Caso TOTAL_GERAL ou ausência de porProjeto
                detalhadoRows.push({
                    Período: periodo.periodLabel,
                    Fazenda: '',
                    Projeto: '',
                    Produto: p.produto,
                    Tipo: p.tipo,
                    Estágio: '—',
                    Quantidade: to2(p.quantidadeTotal),
                    "Área (ha)": to2(p.areaTotal),
                });
            }
        });

        const wsDetalhado = XLSX.utils.json_to_sheet(detalhadoRows);

        // ============================
        // 2) Aba TOTAIS por produto
        // ============================
        const totaisRows = periodo.produtos.map((p) => ({
            Período: periodo.periodLabel,
            Produto: p.produto,
            Tipo: p.tipo,
            "Quantidade Total": to2(p.quantidadeTotal),
            "Área Total (ha)": to2(p.areaTotal),
        }));

        const wsTotais = XLSX.utils.json_to_sheet(totaisRows);

        // ============================
        // 3) Criar workbook e salvar XLSX
        // ============================
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, wsDetalhado, "produtos_projeto_fazenda");
        XLSX.utils.book_append_sheet(wb, wsTotais, "totais_produtos");

        const safeLabel = (periodo.periodLabel || periodo.periodKey || "periodo")
            .replace(/[^\w\-]+/g, "_");

        XLSX.writeFile(wb, `produtos_${safeLabel}.xlsx`);
    };



    // === Sets de opções disponíveis dado o estado atual (desabilitar combinações inválidas) ===
    const availableCulturas = useMemo(() => {
        const set = new Set();
        normalizedData.forEach((item) => {

            // 👉 novos filtros
            const passSituacao =
                !onlyPendentes || item.situacaoApp === false;

            const passInicializadoPlantio =
                !onlyInicializadoPlantio || item.plantioIniciado === true;

            if (!passSituacao || !passInicializadoPlantio) return;


            if (onlyPendentes && item.situacaoApp !== false) return;

            if (
                selectedFazendas.length &&
                (!item.fazendaGrupo || !selectedFazendas.includes(item.fazendaGrupo))
            ) {
                return;
            }

            if (
                selectedProjetos.length &&
                (!item.projeto || !selectedProjetos.includes(item.projeto))
            ) {
                return;
            }

            if (
                selectedProgramas.length &&
                (!item.programa || !selectedProgramas.includes(item.programa))
            ) {
                return;
            }

            if (item.cultura) {
                set.add(item.cultura);
            }
        });
        return set;
    }, [
        normalizedData,
        selectedFazendas,
        selectedProjetos,
        selectedProgramas,
        onlyPendentes,
        onlyInicializadoPlantio
    ]);

    const availableProgramas = useMemo(() => {
        const set = new Set();
        normalizedData.forEach((item) => {

            // 👉 novos filtros
            const passSituacao =
                !onlyPendentes || item.situacaoApp === false;

            const passInicializadoPlantio =
                !onlyInicializadoPlantio || item.plantioIniciado === true;

            if (!passSituacao || !passInicializadoPlantio) return;


            if (onlyPendentes && item.situacaoApp !== false) return;

            if (
                selectedFazendas.length &&
                (!item.fazendaGrupo || !selectedFazendas.includes(item.fazendaGrupo))
            ) {
                return;
            }

            if (
                selectedProjetos.length &&
                (!item.projeto || !selectedProjetos.includes(item.projeto))
            ) {
                return;
            }

            if (
                selectedCulturas.length &&
                (!item.cultura || !selectedCulturas.includes(item.cultura))
            ) {
                return;
            }

            if (item.programa) {
                set.add(item.programa);
            }
        });
        return set;
    }, [
        normalizedData,
        selectedFazendas,
        selectedProjetos,
        selectedCulturas,
        onlyPendentes,
        onlyInicializadoPlantio
    ]);

    const availableFazendas = useMemo(() => {
        const set = new Set();
        normalizedData.forEach((item) => {
            // 👉 novos filtros
            const passSituacao =
                !onlyPendentes || item.situacaoApp === false;

            const passInicializadoPlantio =
                !onlyInicializadoPlantio || item.plantioIniciado === true;

            if (!passSituacao || !passInicializadoPlantio) return;


            if (onlyPendentes && item.situacaoApp !== false) return;

            if (
                selectedProjetos.length &&
                (!item.projeto || !selectedProjetos.includes(item.projeto))
            ) {
                return;
            }

            if (
                selectedCulturas.length &&
                (!item.cultura || !selectedCulturas.includes(item.cultura))
            ) {
                return;
            }

            if (
                selectedProgramas.length &&
                (!item.programa || !selectedProgramas.includes(item.programa))
            ) {
                return;
            }

            if (item.fazendaGrupo) {
                set.add(item.fazendaGrupo);
            }
        });
        return set;
    }, [
        normalizedData,
        selectedProjetos,
        selectedCulturas,
        selectedProgramas,
        onlyPendentes,
        onlyInicializadoPlantio
    ]);

    const availableProjetos = useMemo(() => {
        const set = new Set();
        normalizedData.forEach((item) => {

            // 👉 novos filtros
            const passSituacao =
                !onlyPendentes || item.situacaoApp === false;

            const passInicializadoPlantio =
                !onlyInicializadoPlantio || item.plantioIniciado === true;

            if (!passSituacao || !passInicializadoPlantio) return;

            if (onlyPendentes && item.situacaoApp !== false) return;

            if (
                selectedFazendas.length &&
                (!item.fazendaGrupo || !selectedFazendas.includes(item.fazendaGrupo))
            ) {
                return;
            }

            if (
                selectedCulturas.length &&
                (!item.cultura || !selectedCulturas.includes(item.cultura))
            ) {
                return;
            }

            if (
                selectedProgramas.length &&
                (!item.programa || !selectedProgramas.includes(item.programa))
            ) {
                return;
            }

            if (item.projeto) {
                set.add(item.projeto);
            }
        });
        return set;
    }, [
        normalizedData,
        selectedFazendas,
        selectedCulturas,
        selectedProgramas,
        onlyPendentes,
        onlyInicializadoPlantio
    ]);

    // === Data final filtrado (usando seleções) ===
    const filteredData = useMemo(() => {
        return normalizedData.filter((item) => {
            const passFazenda =
                !selectedFazendas.length ||
                (item.fazendaGrupo && selectedFazendas.includes(item.fazendaGrupo));

            const passProjeto =
                !selectedProjetos.length ||
                (item.projeto && selectedProjetos.includes(item.projeto));

            const passCultura =
                !selectedCulturas.length ||
                (item.cultura && selectedCulturas.includes(item.cultura));

            const passPrograma =
                !selectedProgramas.length ||
                (item.programa && selectedProgramas.includes(item.programa));

            const passSituacao =
                !onlyPendentes || item.situacaoApp === false;

            const passInicializadoPlantio =
                !onlyInicializadoPlantio || item.plantioIniciado === true;

            const passTipoAplicacao =
                !selectedTiposAplicacao.length ||
                (item.tipoAplicacao && selectedTiposAplicacao.includes(item.tipoAplicacao));

            return (
                passFazenda &&
                passProjeto &&
                passCultura &&
                passPrograma &&
                passSituacao &&
                passInicializadoPlantio &&
                passTipoAplicacao
            );
        });
    }, [
        normalizedData,
        selectedFazendas,
        selectedProjetos,
        selectedCulturas,
        selectedProgramas,
        onlyPendentes,
        onlyInicializadoPlantio,
        selectedTiposAplicacao
    ]);

    const dataFiltradaPorEstagio = useMemo(() => {
        if (!hiddenStages.length) return filteredData;

        return filteredData.filter((item) => {
            const stageKey = getStageKey(item.estagio);
            return !hiddenStages.includes(stageKey);
        });
    }, [filteredData, hiddenStages]);

    const dataProdutosCalendario = useMemo(() => {
        return dataFiltradaPorEstagio
            .filter((item) => item.tipo !== 'operacao')
            .sort((a, b) => {
                const pa = a.produto || '';
                const pb = b.produto || '';
                return pa.localeCompare(pb);
            });
    }, [dataFiltradaPorEstagio]);

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

    const dataProdutosVisaoPeriodo = useMemo(() => {
        let base = dataFiltradaPorEstagio.filter(
            (item) =>
                item.tipo !== 'operacao' &&
                item.dataPrevista instanceof Date &&
                !isNaN(item.dataPrevista)
        );

        if (filtroTiposVisao.length) {
            base = base.filter(i => filtroTiposVisao.includes(i.tipo));
        }

        if (filtroProdutosVisao.length) {
            base = base.filter(i => filtroProdutosVisao.includes(i.produto));
        }

        const periodos = groupProdutosPorPeriodo(base, produtoViewMode);

        // TOTAL GERAL
        const totalMap = new Map();

        base.forEach((item) => {
            const prod = item.produto || "Sem produto";

            if (!totalMap.has(prod)) {
                totalMap.set(prod, {
                    produto: prod,
                    tipo: item.tipo || "-",
                    quantidadeTotal: 0,
                    areaTotal: 0,
                });
            }

            const ref = totalMap.get(prod);
            ref.quantidadeTotal += item.quantidadeCalculada || 0;
            ref.areaTotal += item.area || 0;
        });

        const totalCard = {
            periodKey: "TOTAL_GERAL",
            periodLabel: "TOTAL GERAL",
            produtos: Array.from(totalMap.values()).sort((a, b) =>
                a.produto.localeCompare(b.produto)
            ),
        };

        return [...periodos, totalCard];
    }, [
        dataFiltradaPorEstagio,
        filtroTiposVisao,
        filtroProdutosVisao,
        produtoViewMode,
    ]);

    const tipoOptionsVisao = useMemo(() => {
        const set = new Set();
        dataFiltradaPorEstagio.forEach((item) => {
            if (item.tipo && item.tipo !== 'operacao') {
                set.add(item.tipo);
            }
        });
        return Array.from(set).sort();
    }, [dataFiltradaPorEstagio]);

    const produtoOptionsVisao = useMemo(() => {
        let base = dataFiltradaPorEstagio.filter(i => i.tipo !== 'operacao');

        // se tipo está selecionado → restringe os produtos disponíveis
        if (filtroTiposVisao.length) {
            base = base.filter(i => filtroTiposVisao.includes(i.tipo));
        }

        const set = new Set();
        base.forEach((item) => {
            if (item.produto) set.add(item.produto);
        });

        return Array.from(set).sort();
    }, [dataFiltradaPorEstagio, filtroTiposVisao]);

    const bg = isDark ? colors.primary[600] : colors.blueOrigin[800];
    const text = colors.textColor[100];
    const subText = isDark ? colors.grey[400] : colors.grey[600];
    const sectionBorder = isDark ? colors.grey[700] : colors.grey[300];
    const chipBg = isDark ? colors.primary[500] : colors.blueOrigin[900];
    const chipBorder = isDark ? colors.grey[600] : colors.grey[400];
    const chipSelectedBg = isDark ? colors.greenAccent[570] : colors.blueAccent[500];
    const chipSelectedText = "#ffffff";

    const paperShadow = isDark
        ? '0px 10px 24px rgba(0,0,0,0.55)'
        : '0px 6px 12px rgba(15,23,42,0.16)';

    // Estilos base/hover para cards usando a paleta do projeto
    const getCardBaseVisual = (darkMode, palette) => ({
        backgroundColor: darkMode ? palette.primary[600] : palette.blueOrigin[800],
        borderColor: darkMode ? palette.grey[700] : palette.grey[300],
        boxShadow: darkMode
            ? "0px 8px 16px rgba(0,0,0,0.55)"
            : "0px 6px 12px rgba(15,23,42,0.16)",
        transition:
            "background-color 0.15s ease-out, transform 0.15s ease-out, box-shadow 0.15s ease-out, border-color 0.15s ease-out",
        cursor: "pointer",
    });

    const getCardHoverVisual = (darkMode, palette) => ({
        transform: "scale(1.015)",
        backgroundColor: darkMode ? palette.primary[400] : palette.blueOrigin[900],
        borderColor: darkMode ? palette.blueAccent[400] : palette.blueAccent[300],
        boxShadow: darkMode
            ? "0px 14px 26px rgba(0,0,0,0.75)"
            : "0px 10px 22px rgba(15,23,42,0.22)",
    });

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

            {/* CARD DE FILTROS */}
            <div
                style={{
                    borderRadius: 12,
                    padding: 16,
                    border: `1px solid ${sectionBorder}`,
                    backgroundColor: isDark ? colors.blueOrigin[700] : colors.blueOrigin[800],
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    boxShadow: paperShadow,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginBottom: 4,
                        flexWrap: 'wrap',
                        gap: 30,
                    }}
                >
                    <FormControlLabel
                        control={
                            <Switch
                                checked={onlyPendentes}
                                onChange={(e) => setOnlyPendentes(e.target.checked)}
                                color="warning"
                            />
                        }
                        label="Considerar Somente Aplicações Pendentes"
                        sx={{
                            '.MuiFormControlLabel-label': {
                                fontSize: 13,
                                color: colors.primary[100],
                            },
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={onlyInicializadoPlantio}
                                onChange={(e) => setOnlyInicializadoPlantio(e.target.checked)}
                                color="success"
                            />
                        }
                        label="Considerar Somente o que está Plantado"
                        sx={{
                            '.MuiFormControlLabel-label': {
                                fontSize: 13,
                                color: colors.primary[100],
                            },
                        }}
                    />

                </div>

                <div style={{ fontSize: 13, color: subText, marginBottom: 4 }}>
                    Filtros (multiSeleção) — opções incompatíveis com os filtros atuais
                    ficam desabilitadas.
                </div>

                {culturaOptions.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>Cultura</span>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 8,
                            }}
                        >
                            {culturaOptions.map((cult) => {
                                const selected = selectedCulturas.includes(cult);
                                const disabled =
                                    !availableCulturas.has(cult) &&
                                    !selectedCulturas.includes(cult);

                                return (
                                    <button
                                        key={cult}
                                        type="button"
                                        onClick={() => handleToggleCultura(cult, disabled)}
                                        style={{
                                            borderRadius: 999,
                                            padding: '4px 10px',
                                            border: `1px solid ${selected ? chipSelectedBg : chipBorder
                                                }`,
                                            backgroundColor: selected ? chipSelectedBg : chipBg,
                                            color: selected ? chipSelectedText : text,
                                            fontSize: 12,
                                            cursor: disabled ? 'not-allowed' : 'pointer',
                                            opacity: disabled ? 0.4 : 1,
                                        }}
                                        disabled={disabled}
                                    >
                                        {cult}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {programaOptions.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>Programa</span>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 8,
                            }}
                        >
                            {programaOptions.map((prog) => {
                                const selected = selectedProgramas.includes(prog);
                                const disabled =
                                    !availableProgramas.has(prog) &&
                                    !selectedProgramas.includes(prog);

                                return (
                                    <button
                                        key={prog}
                                        type="button"
                                        onClick={() => handleTogglePrograma(prog, disabled)}
                                        style={{
                                            borderRadius: 999,
                                            padding: '4px 10px',
                                            border: `1px solid ${selected ? chipSelectedBg : chipBorder
                                                }`,
                                            backgroundColor: selected ? chipSelectedBg : chipBg,
                                            color: selected ? chipSelectedText : text,
                                            fontSize: 12,
                                            cursor: disabled ? 'not-allowed' : 'pointer',
                                            opacity: disabled ? 0.4 : 1,
                                        }}
                                        disabled={disabled}
                                    >
                                        {prog}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

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
                                const disabled =
                                    !availableFazendas.has(fz) &&
                                    !selectedFazendas.includes(fz);

                                return (
                                    <button
                                        key={fz}
                                        type="button"
                                        onClick={() => handleToggleFazenda(fz, disabled)}
                                        style={{
                                            borderRadius: 999,
                                            padding: '4px 10px',
                                            border: `1px solid ${selected ? chipSelectedBg : chipBorder
                                                }`,
                                            backgroundColor: selected ? chipSelectedBg : chipBg,
                                            color: selected ? chipSelectedText : text,
                                            fontSize: 12,
                                            cursor: disabled ? 'not-allowed' : 'pointer',
                                            opacity: disabled ? 0.4 : 1,
                                        }}
                                        disabled={disabled}
                                    >
                                        {fz}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

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
                                const disabled =
                                    !availableProjetos.has(proj) &&
                                    !selectedProjetos.includes(proj);

                                return (
                                    <button
                                        key={proj}
                                        type="button"
                                        onClick={() => handleToggleProjeto(proj, disabled)}
                                        style={{
                                            borderRadius: 999,
                                            padding: '4px 10px',
                                            border: `1px solid ${selected ? chipSelectedBg : chipBorder
                                                }`,
                                            backgroundColor: selected ? chipSelectedBg : chipBg,
                                            color: selected ? chipSelectedText : text,
                                            fontSize: 12,
                                            cursor: disabled ? 'not-allowed' : 'pointer',
                                            opacity: disabled ? 0.4 : 1,
                                        }}
                                        disabled={disabled}
                                    >
                                        {proj}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>Tipo de aplicação</span>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 8,
                        }}
                    >
                        {tipoAplicacaoOptions.map((tipo) => {
                            const selected = selectedTiposAplicacao.includes(tipo);

                            const label =
                                tipo === "Operacao"
                                    ? "Operação"
                                    : tipo === "Solido"
                                        ? "Sólido"
                                        : "Líquido";

                            return (
                                <button
                                    key={tipo}
                                    type="button"
                                    onClick={() => handleToggleTipoAplicacao(tipo)}
                                    style={{
                                        borderRadius: 999,
                                        padding: '4px 10px',
                                        border: `1px solid ${selected ? chipSelectedBg : chipBorder
                                            }`,
                                        backgroundColor: selected ? chipSelectedBg : chipBg,
                                        color: selected ? chipSelectedText : text,
                                        fontSize: 12,
                                        cursor: 'pointer',
                                        opacity: selected ? 1 : 0.8,
                                    }}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>
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
                        backgroundColor: isDark ? colors.blueOrigin[700] : colors.blueOrigin[800],
                        boxShadow: paperShadow,
                    }}
                >
                    <div style={{ fontSize: 12, color: colors.primary[100] }}>
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
                        backgroundColor: isDark ? colors.blueOrigin[700] : colors.blueOrigin[800],
                        boxShadow: paperShadow,
                    }}
                >
                    <div style={{ fontSize: 12, color: colors.primary[100] }}>
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
                        backgroundColor: isDark ? colors.blueOrigin[700] : colors.blueOrigin[800],
                        boxShadow: paperShadow,
                    }}
                >
                    <div style={{ fontSize: 12, color: colors.primary[100] }}>
                        Período das aplicações previstas
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 600, paddingTop: 3 }}>
                        {kpis.periodoAplicacoes}
                    </div>
                </div>
            </div>

            {/* SECTION GRÁFICO */}
            <section
                style={{
                    marginTop: 8,
                    borderRadius: 12,
                    padding: 16,
                    border: `1px solid ${sectionBorder}`,
                    backgroundColor: isDark ? colors.blueOrigin[700] : colors.blueOrigin[800],
                    boxShadow: paperShadow,
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
                    dark={isDark}
                    hiddenStages={hiddenStages}
                    setHiddenStages={setHiddenStages}
                />
            </section>

            {/* SECTION CALENDÁRIO PRODUTOS */}
            <section
                style={{
                    marginTop: 8,
                    borderRadius: 12,
                    padding: 16,
                    border: `1px solid ${sectionBorder}`,
                    backgroundColor: isDark ? showProdutosSemana ? colors.blueOrigin[600] : colors.blueOrigin[700] : colors.blueOrigin[800],
                    boxShadow: paperShadow,
                }}
            >
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
                            transform: showProdutosSemana ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.15s ease-out',
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
                        dark={isDark}
                    />
                )}
            </section>

            {/* SECTION TOTAIS GERAIS */}
            <section
                style={{
                    marginTop: 8,
                    borderRadius: 12,
                    padding: 16,
                    border: `1px solid ${sectionBorder}`,
                    backgroundColor: isDark ? showTotaisGerais ? colors.blueOrigin[600] : colors.blueOrigin[700] : colors.blueOrigin[800],
                    boxShadow: paperShadow,
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
                            transform: showTotaisGerais ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.15s ease-out',
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
                    considerando os mesmos filtros de fazenda, projeto, cultura, programa,
                    pendências e estágios.
                </p>

                {showTotaisGerais && (
                    <ProdutosTotaisGerais
                        data={dataProdutosTotaisGerais}
                        dark={isDark}
                    />
                )}
            </section>

            {/* ============================================================
                VISÃO CONSOLIDADA POR PERÍODO (PRODUTOS)
            ============================================================ */}
            <section
                style={{
                    marginTop: 8,
                    borderRadius: 12,
                    padding: 16,
                    border: `1px solid ${sectionBorder}`,
                    backgroundColor: isDark ? showVisaoProdutosPeriodo ? colors.blueOrigin[700] : colors.blueOrigin[700] : colors.blueOrigin[800],
                    boxShadow: paperShadow,
                }}
            >
                {/* HEADER EXPAND/COLLAPSE */}
                <div
                    onClick={() => setShowVisaoProdutosPeriodo((prev) => !prev)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        gap: 8,
                    }}
                >
                    <h3 style={{ marginBottom: 4, fontSize: 16 }}>
                        Visão consolidada de produtos por período
                    </h3>

                    <ExpandMoreIcon
                        sx={{
                            fontSize: 24,
                            color: subText,
                            transform: showVisaoProdutosPeriodo
                                ? 'rotate(180deg)'
                                : 'rotate(0deg)',
                            transition: 'transform 0.15s ease-out',
                        }}
                    />
                </div>

                <p
                    style={{
                        marginTop: 0,
                        marginBottom: 12,
                        fontSize: 12,
                        color: subText,
                    }}
                >
                    Totais de produto agregados por semana / quinzena / mês.
                    Obedece todos os filtros globais + filtros locais de tipo e produto.
                </p>

                {showVisaoProdutosPeriodo && (
                    <div style={{ marginTop: 12 }}>
                        {/* Tabs de período */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                            <Tabs
                                value={produtoViewMode}
                                onChange={(_, v) => setProdutoViewMode(v)}
                                textColor="primary"
                                indicatorColor="primary"
                            >
                                <Tab label="Semanal" value="semana" />
                                <Tab label="Quinzenal" value="quinzena" />
                                <Tab label="Mensal" value="mes" />
                            </Tabs>
                        </Box>

                        {/* FILTROS LOCAIS */}
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 12,
                                marginBottom: 12,
                            }}
                        >
                            {/* filtro de tipos */}
                            <FormControl size="small" sx={{ minWidth: 180 }}>
                                <InputLabel id="tipo-label">Tipo</InputLabel>
                                <Select
                                    labelId="tipo-label"
                                    multiple
                                    value={filtroTiposVisao}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFiltroTiposVisao(val);

                                        // limpar produtos incompatíveis
                                        setFiltroProdutosVisao((prev) =>
                                            prev.filter((p) =>
                                                produtoOptionsVisao.includes(p)
                                            )
                                        );
                                    }}
                                    input={<OutlinedInput label="Tipo" />}
                                    renderValue={(selected) =>
                                        selected.length ? selected.join(', ') : 'Todos'
                                    }
                                >
                                    {tipoOptionsVisao.map((t) => (
                                        <MenuItem key={t} value={t}>
                                            {t}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* filtro de produtos */}
                            <FormControl size="small" sx={{ minWidth: 240, flexGrow: 1 }}>
                                <InputLabel id="produto-label">Produto</InputLabel>
                                <Select
                                    labelId="produto-label"
                                    multiple
                                    value={filtroProdutosVisao}
                                    onChange={(e) =>
                                        setFiltroProdutosVisao(e.target.value)
                                    }
                                    input={<OutlinedInput label="Produto" />}
                                    renderValue={(selected) =>
                                        selected.length ? selected.join(', ') : 'Todos'
                                    }
                                >
                                    {produtoOptionsVisao.map((p) => (
                                        <MenuItem key={p} value={p}>
                                            {p}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {/* GRID DE PERÍODOS */}
                        {!dataProdutosVisaoPeriodo.length ? (
                            <p style={{ marginTop: 12, color: subText, fontSize: 12 }}>
                                Nenhum dado para os filtros atuais.
                            </p>
                        ) : (
                            <div
                                style={{
                                    display: 'grid',
                                    gap: 12,
                                    gridTemplateColumns:
                                        'repeat(auto-fit, minmax(260px, 1fr))',
                                }}
                            >
                                {dataProdutosVisaoPeriodo.map((periodo) => (
                                    <div
                                        key={periodo.periodKey}
                                        style={{
                                            borderRadius: 12,
                                            padding: 12,
                                            border: `1px solid ${sectionBorder}`,
                                            ...getCardBaseVisual(isDark, colors),
                                        }}
                                        onMouseEnter={(e) => {
                                            Object.assign(
                                                e.currentTarget.style,
                                                getCardHoverVisual(isDark, colors)
                                            );
                                        }}
                                        onMouseLeave={(e) => {
                                            Object.assign(e.currentTarget.style, {
                                                ...getCardBaseVisual(isDark, colors),
                                                borderRadius: "12px",
                                                padding: "12px",
                                                border: `1px solid ${sectionBorder}`,
                                                transform: "scale(1)",
                                            });
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                paddingBottom: 6,
                                                borderBottom: `1px dashed ${sectionBorder}`,
                                            }}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <strong>{periodo.periodLabel}</strong>
                                                <span style={{ fontSize: 11, color: subText }}>
                                                    {periodo.produtos.length} prod.
                                                </span>
                                            </div>

                                            <IconButton
                                                size="small"
                                                onClick={() => handleDownloadPeriodo(periodo)}
                                                title="Baixar quadro em CSV"
                                            >
                                                <DownloadIcon fontSize="small" />
                                            </IconButton>
                                        </div>

                                        <ul
                                            style={{
                                                listStyle: 'none',
                                                margin: 0,
                                                padding: 0,
                                                marginTop: 8,
                                            }}
                                        >
                                            {periodo.produtos.map((p, idx) => (
                                                <li
                                                    key={`${periodo.periodKey}-${p.produto}-${idx}`}
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        padding: '6px 4px',
                                                        borderBottom:
                                                            idx === periodo.produtos.length - 1
                                                                ? 'none'
                                                                : `1px solid ${sectionBorder}`,
                                                    }}
                                                >
                                                    <div>
                                                        <strong>{p.produto}</strong>
                                                        <div
                                                            style={{
                                                                fontSize: 11,
                                                                color: subText,
                                                            }}
                                                        >
                                                            {p.tipo}
                                                        </div>
                                                    </div>

                                                    <div
                                                        style={{
                                                            textAlign: 'right',
                                                            minWidth: 70,
                                                        }}
                                                    >
                                                        <div>
                                                            {p.quantidadeTotal.toLocaleString(
                                                                'pt-BR',
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: 11,
                                                                color: subText,
                                                            }}
                                                        >
                                                            {p.areaTotal.toLocaleString(
                                                                'pt-BR',
                                                                {
                                                                    maximumFractionDigits: 1,
                                                                }
                                                            )}{' '}
                                                            ha
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default PlanejamentoProdutosDashboard;
