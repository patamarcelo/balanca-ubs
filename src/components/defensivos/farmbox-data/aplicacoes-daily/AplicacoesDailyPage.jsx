import { useMemo, useState, useCallback, useEffect } from "react";
import {
    Box,
    Stack,
    Typography,
    Modal,
    Paper,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Divider,
    Button,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { LabelList } from "recharts";


import { tokens } from "../../../../theme";
import { buildDashboardData, buildExportRows } from "./dailyApplications.handler";

// Recharts
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RTooltip,
    CartesianGrid,
} from "recharts";

// DatePicker (MUI X)
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// ---------- export helpers ----------
const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

const rowsToCsv = (rows) => {
    if (!rows.length) return "";
    const headers = Object.keys(rows[0]);
    const esc = (v) => {
        const s = String(v ?? "");
        const needs = /[",\n;]/.test(s);
        const safe = s.replace(/"/g, '""');
        return needs ? `"${safe}"` : safe;
    };
    return [headers.join(";"), ...rows.map((r) => headers.map((h) => esc(r[h])).join(";"))].join("\n");
};

const fmtHa = (n, finalNumber = 2) =>
    (Number(n) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: finalNumber });

const ymd = (djs) => (djs ? djs.format("YYYY-MM-DD") : "");

// ---------- normalize helpers ----------
const normalizeTxt = (v) =>
    (v ?? "")
        .toString()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim();

const normalizeFarmKey = (name) => {
    const s = normalizeTxt(name);
    return s.replace(/^fazenda\s+/i, "").replace(/\s+/g, " ").trim();
};

const displayFarm = (name) => String(name || "").replace(/^Fazenda\s+/i, "").trim();

// ---------- group helpers ----------
const groupParcelasByDay = (parcelas = []) =>
    parcelas.reduce((acc, p) => {
        const d = p.day || "Sem data";
        (acc[d] ||= []).push(p);
        return acc;
    }, {});

const groupByAppId = (rows = []) =>
    rows.reduce((acc, r) => {
        const k = String(r.applicationId);
        (acc[k] ||= []).push(r);
        return acc;
    }, {});

const fmtDateBR = (v, year = false) => {
    // v vem como YYYY-MM-DD
    const [y, m, d] = String(v).split("-");
    if (year) {
        return `${d}/${m}/${y}`;
    }
    return `${d}/${m}`;
};

// --- helper: split "Talhão (Variedade)" em duas colunas ---
const splitTalhaoVariedade = (s) => {
    const raw = String(s ?? "").trim();
    if (!raw) {
        return { talhao: "", variedade: "" };
    }

    // ✅ padrão principal: A29 (IRGA 424 RI)
    const parenMatch = raw.match(/^(.+?)\s*\(([^()]+)\)\s*$/);
    if (parenMatch) {
        return {
            talhao: parenMatch[1].trim(),
            variedade: parenMatch[2].trim(),
        };
    }

    // ✅ fallback: "A29 - IRGA 424 RI"
    const dashMatch = raw.match(/^(.+?)\s*[-–]\s*(.+)$/);
    if (dashMatch) {
        return {
            talhao: dashMatch[1].trim(),
            variedade: dashMatch[2].trim(),
        };
    }

    // ✅ fallback final: só talhão
    return {
        talhao: raw,
        variedade: "",
    };
};


// --- transforma exportRows para o formato desejado ---
const buildExportRowsV2 = (rows) => {
    const out = [];
    for (const r of rows || []) {
        // Talhoes_Variedade pode vir com vários: "T1 (V1) | T2 (V2)"
        const parts = String(r.Talhoes_Variedade ?? "")
            .split("|")
            .map((x) => x.trim())
            .filter(Boolean);

        // se tiver vários talhões, gera múltiplas linhas (melhor pra Excel)
        if (parts.length > 0) {
            for (const part of parts) {
                const { talhao, variedade } = splitTalhaoVariedade(part);
                out.push({
                    Dia: r.Dia,
                    AP: r.AP,
                    Operacao: r.Operacao,
                    Status: r.Status,
                    Equipamento: r.Equipamento,
                    Area_ha: r.Area_ha,
                    Fazendas: r.Fazendas,
                    Talhao: talhao,
                    Variedade: variedade,
                });
            }
        } else {
            // sem talhão: mantém uma linha
            const { talhao, variedade } = splitTalhaoVariedade(r?.Talhao);
            out.push({
                Dia: r.Dia,
                AP: r.AP,
                Operacao: r.Operacao,
                Status: r.Status,
                Equipamento: r.Equipamento,
                Area_ha: r.Area_ha,
                Fazendas: r.Fazendas,
                Talhao: talhao,
                Variedade: variedade,
            });
        }
    }
    return out;
};


// ---------- derive views from parcelas ----------
const deriveViewsFromParcelas = (parcelas = []) => {
    // series daily
    const byDay = parcelas.reduce((acc, p) => {
        const d = p.day || "Sem data";
        (acc[d] ||= []).push(p);
        return acc;
    }, {});
    const daysAsc = Object.keys(byDay).sort();
    const seriesDaily = daysAsc.map((day) => ({
        day,
        area: byDay[day].reduce((acc, r) => acc + (Number(r.areaHa) || 0), 0),
    }));

    // apps
    const byApp = parcelas.reduce((acc, p) => {
        const k = String(p.applicationId);
        (acc[k] ||= []).push(p);
        return acc;
    }, {});

    const apps = Object.values(byApp).map((rows) => {
        const first = rows[0];
        const totalAreaHa = rows.reduce((acc, r) => acc + (Number(r.areaHa) || 0), 0);

        const parcelasSorted = rows
            .slice()
            .sort((a, b) => (a.day > b.day ? -1 : a.day < b.day ? 1 : 0));

        // farms agregadas (como texto original, mas únicas por chave normalizada)
        const farmMap = new Map();
        for (const r of rows) {
            for (const fn of r.farmNames || []) {
                const key = normalizeFarmKey(fn);
                if (!key) continue;
                if (!farmMap.has(key)) farmMap.set(key, fn);
            }
        }
        const farms = Array.from(farmMap.values());

        // chips (talhões)
        const plants = rows
            .filter((r) => r.plantationId != null)
            .map((r) => ({
                key: String(r.plantationId),
                label: `${r.plantationName || "Talhão " + r.plantationId}${r.variety_name ? ` — ${r.variety_name}` : ""}`,
            }));
        const chipMap = new Map();
        for (const p of plants) {
            if (!chipMap.has(p.key)) chipMap.set(p.key, p);
        }
        const chips = Array.from(chipMap.values());

        return {
            applicationId: first.applicationId,
            code: first.code,
            status: first.status,
            operationLabel: first.operationLabel,
            equipmentName: first.equipmentName,
            totalAreaHa,
            parcelas: parcelasSorted,
            farms,
            chips,
        };
    });

    // ops ranking (para select)
    const byOp = parcelas.reduce((acc, p) => {
        const k = normalizeTxt(p.operationLabel || "sem operacao");
        (acc[k] ||= []).push(p);
        return acc;
    }, {});
    const ops = Object.entries(byOp)
        .map(([operationKey, rows]) => ({
            operationKey,
            operationLabel: rows[0]?.operationLabel || "Sem operação",
            area: rows.reduce((acc, r) => acc + (Number(r.areaHa) || 0), 0),
            countParcelas: rows.length,
        }))
        .sort((a, b) => b.area - a.area);

    return { parcelas, seriesDaily, apps, ops };
};

function KpiCard({ title, value, colors }) {
    return (
        <Paper
            sx={{
                p: 1.5,
                minWidth: 240,
                backgroundColor: colors.blueOrigin[800],
                border: `1px solid ${colors.grey[700]}`,
                borderRadius: 2,
            }}
        >
            <Typography variant="caption" sx={{ opacity: 0.85, color: colors.grey[200] }}>
                {title}
            </Typography>
            <Typography variant="h4" fontWeight={900} sx={{ color: colors.textColor?.[100] || colors.grey[100] }}>
                {value}
            </Typography>
        </Paper>
    );
}

function DailyRecharts({ data, colors }) {
    const tooltipStyle = {
        background: colors.blueOrigin[900],
        border: `1px solid ${colors.grey[700]}`,
        borderRadius: 10,
        color: colors.grey[100],
    };
    const BarLabel = ({ x, y, width, value }) => {
        if (!value) return null;

        return (
            <text
                x={x + width / 2}
                y={y - 6}
                textAnchor="middle"
                fill="#fff"
                fontSize={11}
                fontWeight={900}
            >
                {fmtHa(value, 0)}
            </text>
        );
    };


    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${colors.grey[700]}`,
                backgroundColor: colors.blueOrigin[800],
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" mb={1}>
                <Typography variant="h5" fontWeight={900} sx={{ color: colors.grey[100] }}>
                    Área aplicada por dia
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85, color: colors.grey[200] }}>
                    {data.length} dias
                </Typography>
            </Stack>

            <Box sx={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 8, right: 16, left: 6, bottom: 8 }}>
                        <CartesianGrid
                            stroke={colors.grey[500]}
                            strokeDasharray="3 3"
                        // vertical={false}
                        />
                        <XAxis
                            dataKey="day"
                            tick={{ fill: colors.grey[200], fontSize: 11 }}
                            tickFormatter={fmtDateBR}
                        />
                        <YAxis tick={{ fill: colors.grey[200], fontSize: 11 }} />
                        <RTooltip
                            cursor={{ fill: "rgba(255,255,255,0.06)" }}
                            contentStyle={tooltipStyle}
                            formatter={(value) => [`${fmtHa(value)} ha`, "Área"]}
                            labelFormatter={(label) => {
                                const [y, m, d] = String(label).split("-");
                                return `${d}/${m}/${y}`;
                            }}
                        />
                        <Bar
                            dataKey="area"
                            fill={colors.greenSuccess?.[100] || colors.greenAccent?.[600] || "#2e7d32"}
                            radius={[8, 8, 0, 0]}
                            label={<BarLabel />}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
}

export default function AplicacoesDailyPage({
    open,
    onClose,
    applications,
    onlyFarms = [],
    initialFarms = [],
    theme,
    colors: colorsProp,
}) {
    const colors = colorsProp || tokens(theme?.palette?.mode || "dark");

    // --- base
    const base = useMemo(() => buildDashboardData(applications || []), [applications]);

    // --- farms options: prefer onlyFarms, fallback do base.parcelas (sempre “limpo” no value)
    const farmOptions = useMemo(() => {
        const src = (onlyFarms && onlyFarms.length ? onlyFarms : [])
            .map((f) => String(f || ""))
            .filter(Boolean);

        const m = new Map();

        if (src.length) {
            for (const f of src) {
                const key = normalizeFarmKey(f);
                if (!key) continue;
                if (!m.has(key)) m.set(key, displayFarm(f));
            }
        } else {
            for (const p of base.parcelas || []) {
                for (const fn of p.farmNames || []) {
                    const key = normalizeFarmKey(fn);
                    if (!key) continue;
                    if (!m.has(key)) m.set(key, displayFarm(fn));
                }
            }
        }

        return Array.from(m.entries())
            .map(([key, label]) => ({ key, label }))
            .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
    }, [onlyFarms, base.parcelas]);

    // --- filtros (STATE)
    const [q, setQ] = useState("");
    const [farms, setFarms] = useState(
        Array.isArray(initialFarms) ? initialFarms.map((f) => normalizeFarmKey(f)).filter(Boolean) : []
    );
    console.log('farms: ', farms)
    const [operation, setOperation] = useState("");
    const [dStart, setDStart] = useState(null);
    const [dEnd, setDEnd] = useState(null);
    const [exportBusy, setExportBusy] = useState(false);

    // no topo do componente (junto dos estados), adicione:
    const [openAppIds, setOpenAppIds] = useState(() => ({}));

    const toggleAppOpen = useCallback((key) => {
        setOpenAppIds((prev) => ({ ...prev, [key]: !prev[key] }));
    }, []);


    // reseta farms ao abrir (evita estado sujo quando reabre modal)
    useEffect(() => {
        if (!open) return;
        if (Array.isArray(initialFarms) && initialFarms.length) {
            setFarms(initialFarms.map((f) => normalizeFarmKey(f)).filter(Boolean));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // ---------- FILTRAGEM GARANTIDA ----------
    const filteredParcelas = useMemo(() => {
        const dateStart = ymd(dStart);
        const dateEnd = ymd(dEnd);

        const nq = normalizeTxt(q);
        const farmSet = new Set((farms || []).map((k) => normalizeFarmKey(k)).filter(Boolean));
        const opKey = normalizeTxt(operation);

        return (base.parcelas || [])
            .filter((p) => (!dateStart || p.day >= dateStart) && (!dateEnd || p.day <= dateEnd))
            .filter((p) => {
                if (!farmSet.size) return true;
                const pKeys = (p.farmNames || []).map((fn) => normalizeFarmKey(fn)).filter(Boolean);
                return pKeys.some((k) => farmSet.has(k));
            })
            .filter((p) => {
                if (!opKey) return true;
                return normalizeTxt(p.operationLabel || "") === opKey;
            })
            .filter((p) => {
                if (!nq) return true;
                const hay = normalizeTxt(`${p.code} ${p.operationLabel} ${p.equipmentName} ${(p.farmNames || []).join(" ")}`);
                return hay.includes(nq);
            });
    }, [base.parcelas, q, farms, operation, dStart, dEnd]);

    // (opcional) logs de sanity
    useEffect(() => {
        console.log("farms state:", farms);
        console.log("filteredParcelas:", filteredParcelas.length);
    }, [farms, filteredParcelas.length]);

    // Deriva tudo a partir de parcelas filtradas
    const filtered = useMemo(() => deriveViewsFromParcelas(filteredParcelas), [filteredParcelas]);

    const kpis = useMemo(() => {
        const total = filtered.parcelas.reduce((acc, p) => acc + (Number(p.areaHa) || 0), 0);
        const days = filtered.seriesDaily.length || 0;
        const avg = days > 0 ? total / days : 0;
        return {
            total,
            days,
            avg,
            appsCount: filtered.apps.length || 0,
            parcelasCount: filtered.parcelas.length || 0,
        };
    }, [filtered]);

    const operationOptions = useMemo(() => filtered.ops.slice(0, 120), [filtered.ops]);
    const exportRows = useMemo(() => buildExportRows(filtered.parcelas), [filtered.parcelas]);

    const dailyTimeline = useMemo(() => {
        const byDay = groupParcelasByDay(filtered.parcelas);
        const days = Object.keys(byDay).sort((a, b) => (a > b ? -1 : 1));

        return days.map((day) => {
            const rows = byDay[day] || [];
            const totalDayHa = rows.reduce((acc, r) => acc + (Number(r.areaHa) || 0), 0);

            const byApp = groupByAppId(rows);

            const apps = Object.entries(byApp)
                .map(([appId, items]) => {
                    const first = items[0];
                    const areaDayHa = items.reduce((acc, r) => acc + (Number(r.areaHa) || 0), 0);

                    // total da aplicação no recorte atual
                    const appAgg = filtered.apps.find((x) => String(x.applicationId) === String(appId));

                    const farmName =
                        (first.farmNames && first.farmNames[0]) || "";
                    return {
                        applicationId: appId,
                        code: first.code,
                        operationLabel: first.operationLabel,
                        status: first.status,
                        equipmentName: first.equipmentName,
                        farms: first.farmNames || [],
                        areaDayHa,
                        totalAreaHa: appAgg?.totalAreaHa ?? areaDayHa,
                        parcelas: items.slice(), // mesmo dia
                        chips: appAgg?.chips || [],
                        parcelasCountDay: items.length,
                        farmName
                    };
                })
                .sort((a, b) => b.areaDayHa - a.areaDayHa);

            return {
                day,
                totalDayHa,
                appsCount: apps.length,
                parcelasCount: rows.length,
                apps,
            };
        });
    }, [filtered.parcelas, filtered.apps]);



    const handleExport = useCallback(async () => {
        if (!exportRows.length) return;

        setExportBusy(true);
        try {
            let xlsx;
            try {
                xlsx = await import("xlsx");
            } catch (e) {
                xlsx = null;
            }

            const stamp = new Date()
                .toLocaleString("pt-BR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                })
                .replace(/\//g, "-")
                .replace(/,?\s/g, "-")
                .replace(/:/g, "-");

            if (xlsx) {
                const wb = xlsx.utils.book_new();

                const exportRowsV2 = buildExportRowsV2(exportRows);
                const ws1 = xlsx.utils.json_to_sheet(exportRowsV2);
                xlsx.utils.book_append_sheet(wb, ws1, "Registros");

                const ws2 = xlsx.utils.json_to_sheet(
                    filtered.seriesDaily.map((d) => ({ Dia: d.day, Area_ha: d.area }))
                );
                xlsx.utils.book_append_sheet(wb, ws2, "Resumo_Dia");

                const ws3 = xlsx.utils.json_to_sheet(
                    filtered.apps
                        .slice()
                        .sort((a, b) => b.totalAreaHa - a.totalAreaHa)
                        .map((a) => ({
                            AP: a.code,
                            Operacao: a.operationLabel,
                            Status: a.status,
                            Area_total_ha: a.totalAreaHa,
                            Parcelas: a.parcelas.length,
                            Fazendas: (a.farms || []).join(" | "),
                        }))
                );
                xlsx.utils.book_append_sheet(wb, ws3, "Resumo_AP");

                const out = xlsx.write(wb, { bookType: "xlsx", type: "array" });
                downloadBlob(
                    new Blob([out], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    }),
                    `aplicacoes-${stamp}.xlsx`
                );
            } else {
                const csv = rowsToCsv(exportRows);
                downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `aplicacoes-${stamp}.csv`);
            }
        } finally {
            setExportBusy(false);
        }
    }, [exportRows, filtered.seriesDaily, filtered.apps]);

    const modalStyle = {
        position: "absolute",
        top: "3%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(1500px, 97vw)",
        maxHeight: "94vh",
        overflow: "auto",
        borderRadius: 2,
        outline: "none",
        backgroundColor: colors.blueOrigin[900],
        color: colors.grey[100],
    };

    const fieldSx = {
        "& .MuiInputBase-root": { backgroundColor: colors.blueOrigin[800], color: colors.grey[100] },
        "& .MuiInputLabel-root": { color: colors.grey[200] },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[700] },
    };



    return (
        <Modal open={open} onClose={onClose}>
            <Paper sx={modalStyle} elevation={12}>
                {/* HEADER STICKY */}
                <Box
                    sx={{
                        p: 2,
                        position: "sticky",
                        top: 0,
                        zIndex: 20,
                        backgroundColor: colors.blueOrigin[900],
                        borderBottom: `1px solid ${colors.grey[700]}`,
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                        <Stack spacing={0.2}>
                            <Typography variant="h4" fontWeight={900}>
                                Dashboard de Aplicações
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                Área por dia • Resumo por aplicação • Parcelas • Export
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button
                                startIcon={<DownloadIcon />}
                                onClick={handleExport}
                                disabled={exportBusy || exportRows.length === 0}
                                color="success"
                                variant="contained"
                            >
                                {exportBusy ? "Exportando…" : "Exportar"}
                            </Button>

                            <IconButton onClick={onClose} sx={{ color: colors.grey[100] }}>
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                    </Stack>

                    <Divider sx={{ my: 1.5, borderColor: colors.grey[700] }} />

                    {/* FILTROS */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                            <TextField
                                label="Buscar (AP / Operação / Equipamento)"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                size="small"
                                sx={{ ...fieldSx, minWidth: 320 }}
                            />

                            <FormControl size="small" sx={{ ...fieldSx, minWidth: 320 }}>
                                <InputLabel id="farm-daily-label">Fazendas</InputLabel>
                                <Select
                                    labelId="farm-daily-label"
                                    label="Fazendas"
                                    multiple
                                    value={farms}
                                    onChange={(e) =>
                                        setFarms(
                                            (typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value)
                                                .map((k) => normalizeFarmKey(k))
                                                .filter(Boolean)
                                        )
                                    }
                                    renderValue={(selected) => (
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {selected.map((farmKey) => {
                                                const opt = farmOptions.find((x) => x.key === farmKey);
                                                const label = opt?.label || farmKey;
                                                return (
                                                    <Chip
                                                        key={farmKey}
                                                        size="small"
                                                        label={label}
                                                        sx={{
                                                            backgroundColor: colors.blueOrigin[700],
                                                            color: colors.grey[100],
                                                            border: `1px solid ${colors.grey[600]}`,
                                                        }}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                >
                                    {farmOptions.map((f) => (
                                        <MenuItem key={f.key} value={f.key}>
                                            {f.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl size="small" sx={{ ...fieldSx, minWidth: 320 }}>
                                <InputLabel id="op-filter-label">Operação</InputLabel>
                                <Select
                                    labelId="op-filter-label"
                                    label="Operação"
                                    value={operation}
                                    onChange={(e) => setOperation(e.target.value)}
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {operationOptions.map((op) => (
                                        <MenuItem key={op.operationKey} value={op.operationLabel}>
                                            {op.operationLabel} — {fmtHa(op.area)} ha ({op.countParcelas})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <DatePicker
                                label="De"
                                value={dStart}
                                onChange={(v) => setDStart(v)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        sx={{ ...fieldSx, width: 170 }}
                                    />
                                )}
                            />

                            <DatePicker
                                label="Até"
                                value={dEnd}
                                onChange={(v) => setDEnd(v)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        sx={{ ...fieldSx, width: 170 }}
                                    />
                                )}
                            />


                            <Chip
                                label={`Apps: ${kpis.appsCount} • Parcelas: ${kpis.parcelasCount}`}
                                sx={{
                                    ml: "auto",
                                    backgroundColor: colors.blueOrigin[800],
                                    color: colors.grey[100],
                                    border: `1px solid ${colors.grey[700]}`,
                                }}
                            />
                        </Stack>
                    </LocalizationProvider>
                </Box>

                {/* BODY */}
                <Box sx={{ p: 2 }}>
                    {/* KPIs */}
                    <Stack direction="row" spacing={2} flexWrap="wrap" mb={2}>
                        <KpiCard title="Área total aplicada (filtros)" value={`${fmtHa(kpis.total)} ha`} colors={colors} />
                        <KpiCard title="Dias com aplicação" value={`${kpis.days}`} colors={colors} />
                        <KpiCard title="Média por dia" value={`${fmtHa(kpis.avg)} ha/dia`} colors={colors} />
                    </Stack>

                    {/* GRÁFICO */}
                    {filtered.seriesDaily.length === 0 ? (
                        <Typography sx={{ opacity: 0.8 }}>Nenhuma aplicação encontrada com os filtros atuais.</Typography>
                    ) : (
                        <DailyRecharts data={filtered.seriesDaily} colors={colors} />
                    )}

                    {/* TIMELINE POR DIA */}
                    <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 1.5, borderColor: colors.grey[700] }}>
                            <Typography sx={{ fontWeight: 900, opacity: 0.9 }}>Timeline por dia</Typography>
                        </Divider>

                        {dailyTimeline.length === 0 ? (
                            <Typography sx={{ opacity: 0.8 }}>Nenhum registro no período selecionado.</Typography>
                        ) : (
                            <Stack spacing={1.5}>
                                {dailyTimeline.map((d) => (
                                    <Paper
                                        key={d.day}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            backgroundColor: colors.blueOrigin[800],
                                            border: `1px solid ${colors.grey[700]}`,
                                        }}
                                    >
                                        {/* Header do DIA */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: 2,
                                                flexWrap: "wrap",
                                                px: 1.2,
                                                py: 1,
                                                borderRadius: 2,
                                                backgroundColor: colors.blueOrigin[900],
                                                border: `1px solid ${colors.grey[700]}`,
                                                position: "sticky",
                                                top: 132,
                                                zIndex: 5,
                                            }}
                                        >
                                            <Typography variant="h6" fontWeight={900}>
                                                {fmtDateBR(d.day, true)}
                                            </Typography>

                                            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end" alignItems="center">
                                                <Chip
                                                    size="small"
                                                    label={`Total: ${fmtHa(d.totalDayHa)} ha`}
                                                    sx={{
                                                        backgroundColor: colors.greenSuccess?.[100] || colors.greenAccent?.[600],
                                                        color: colors.grey[900],
                                                        fontWeight: 900,
                                                    }}
                                                />
                                                <Chip
                                                    size="small"
                                                    label={`APs: ${d.appsCount}`}
                                                    sx={{
                                                        backgroundColor: colors.blueOrigin[700],
                                                        color: colors.grey[100],
                                                        border: `1px solid ${colors.grey[600]}`,
                                                    }}
                                                />
                                                <Chip
                                                    size="small"
                                                    label={`Parcelas: ${d.parcelasCount}`}
                                                    sx={{
                                                        backgroundColor: colors.blueOrigin[700],
                                                        color: colors.grey[100],
                                                        border: `1px solid ${colors.grey[600]}`,
                                                    }}
                                                />
                                            </Stack>
                                        </Box>

                                        <Stack spacing={1.2} sx={{ mt: 1.2 }}>
                                            {d.apps.map((a) => {
                                                const rowKey = `${d.day}-${a.applicationId}`;
                                                const isOpen = !!openAppIds[rowKey];

                                                const parcelasArea = a.parcelas.reduce((acc, p) => acc + (Number(p.areaHa) || 0), 0);

                                                return (
                                                    <Box
                                                        key={rowKey}
                                                        sx={{
                                                            borderRadius: 2,
                                                            border: `1px solid ${colors.grey[700]}`,
                                                            backgroundColor: colors.blueOrigin[900],
                                                            transition: "all .15s ease",
                                                            "&:hover": {
                                                                backgroundColor: colors.blueOrigin[700],
                                                                transform: "translateY(-1px)",
                                                            },
                                                        }}
                                                    >
                                                        {/* HEADER DA APLICAÇÃO (clicável + seta) */}
                                                        <Box
                                                            onClick={() => toggleAppOpen(rowKey)}
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter" || e.key === " ") toggleAppOpen(rowKey);
                                                            }}
                                                            sx={{
                                                                p: 1.2,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "space-between",
                                                                gap: 1.5,
                                                                flexWrap: "wrap",
                                                                cursor: "pointer",
                                                                borderBottom: isOpen ? `1px solid ${colors.grey[800]}` : "none",
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    minWidth: "70%",
                                                                    display: "grid",
                                                                    alignItems: "center",
                                                                    columnGap: 7,
                                                                    rowGap: 1,
                                                                    gridTemplateColumns: {
                                                                        xs: "1fr",                 // mobile
                                                                        sm: "100px 180px 140px 140px 140px" // ajuste conforme seus chips
                                                                    },
                                                                }}
                                                            >
                                                                {/* AP + Fazenda no mesmo “bloco” */}
                                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 140, pr: 1 }}>
                                                                    {a.farmName ? (
                                                                        <Chip
                                                                            size="small"
                                                                            label={String(a.farmName).replace(/^Fazenda\s+/i, "")}
                                                                            sx={{
                                                                                backgroundColor: colors.blueOrigin[500],
                                                                                color: colors.grey[100],
                                                                                border: `1px solid ${colors.grey[700]}`,
                                                                                fontWeight: 700,
                                                                            }}
                                                                        />
                                                                    ) : null}

                                                                    <Typography fontWeight={900} sx={{ whiteSpace: "nowrap" }}>
                                                                        {a.code}
                                                                    </Typography>
                                                                </Box>

                                                                <Chip
                                                                    size="small"
                                                                    label={a.operationLabel || "Sem operação"}
                                                                    sx={{
                                                                        backgroundColor: colors.grey[200],
                                                                        color: colors.grey[900],
                                                                        border: `1px solid ${colors.grey[600]}`,
                                                                        fontWeight: 800,
                                                                    }}
                                                                />

                                                                <Chip
                                                                    size="small"
                                                                    label={`Hoje: ${fmtHa(a.areaDayHa)} ha`}
                                                                    sx={{
                                                                        backgroundColor: colors.greenSuccess?.[100] || colors.greenAccent?.[600],
                                                                        color: colors.grey[900],
                                                                        fontWeight: 900,
                                                                    }}
                                                                />

                                                                <Chip
                                                                    size="small"
                                                                    label={`Total AP: ${fmtHa(a.totalAreaHa)} ha`}
                                                                    sx={{
                                                                        backgroundColor: colors.blueOrigin[800],
                                                                        color: colors.grey[100],
                                                                        border: `1px solid ${colors.grey[600]}`,
                                                                    }}
                                                                />

                                                                <Chip
                                                                    size="small"
                                                                    label={`Parcelas hoje: ${a.parcelasCountDay}`}
                                                                    sx={{
                                                                        backgroundColor: colors.blueOrigin[800],
                                                                        color: colors.grey[100],
                                                                        border: `1px solid ${colors.grey[600]}`,
                                                                    }}
                                                                />
                                                            </Box>

                                                            {/* Coluna direita: Equip/Status + seta */}
                                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: "auto" }}>
                                                                <Typography variant="body2" sx={{ opacity: 0.85, textAlign: "right" }}>
                                                                    {a.equipmentName ? `Equip: ${a.equipmentName}` : ""}
                                                                    {a.status ? ` • Status: ${a.status}` : ""}
                                                                </Typography>

                                                                {/* seta: só ela “parece” accordion */}
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // não dispara o click do header duas vezes
                                                                        toggleAppOpen(rowKey);
                                                                    }}
                                                                    sx={{
                                                                        color: colors.grey[100],
                                                                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                                                        transition: "transform .15s ease",
                                                                    }}
                                                                >
                                                                    <ExpandMoreIcon />
                                                                </IconButton>
                                                            </Stack>
                                                        </Box>

                                                        {/* CONTEÚDO COLAPSÁVEL */}
                                                        {isOpen && (
                                                            <Box sx={{ p: 1.2, backgroundColor: colors.blueOrigin[900] }}>
                                                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
                                                                    <Chip
                                                                        size="small"
                                                                        label={`Qtd: ${a.parcelas.length}`}
                                                                        sx={{
                                                                            backgroundColor: colors.blueOrigin[900],
                                                                            color: colors.grey[100],
                                                                            border: `1px solid ${colors.grey[700]}`,
                                                                            fontWeight: 800,
                                                                        }}
                                                                    />
                                                                    <Chip
                                                                        size="small"
                                                                        label={`Área: ${fmtHa(parcelasArea)} ha`}
                                                                        sx={{
                                                                            backgroundColor: colors.greenSuccess?.[100] || colors.greenAccent?.[600],
                                                                            color: colors.grey[900],
                                                                            fontWeight: 900,
                                                                        }}
                                                                    />
                                                                </Stack>

                                                                <Stack spacing={1}>
                                                                    {a.parcelas.map((p, idx) => (
                                                                        <Box
                                                                            key={`${a.applicationId}-${d.day}-${idx}`}
                                                                            sx={{
                                                                                px: 1,
                                                                                py: 0.9,
                                                                                borderRadius: 1.5,
                                                                                border: `1px solid ${colors.grey[700]}`,
                                                                                backgroundColor: colors.blueOrigin[800],
                                                                                transition: "all .15s ease",
                                                                                "&:hover": {
                                                                                    backgroundColor: colors.blueOrigin[700],
                                                                                    transform: "translateY(-1px)",
                                                                                },
                                                                            }}
                                                                        >
                                                                            <Box
                                                                                sx={{
                                                                                    display: "grid",
                                                                                    gridTemplateColumns: "120px 150px 120px 120px 120px",
                                                                                    gap: 1,
                                                                                    alignItems: "center",
                                                                                }}
                                                                            >
                                                                                <Box>
                                                                                    <Typography variant="caption" sx={{ opacity: 0.75 }}>
                                                                                        Parcela
                                                                                    </Typography>
                                                                                    <Typography variant="body2" fontWeight={900}>
                                                                                        {p.plantationName}
                                                                                    </Typography>
                                                                                </Box>
                                                                                <Box>
                                                                                    <Typography variant="caption" sx={{ opacity: 0.75 }}>
                                                                                        Variedade
                                                                                    </Typography>
                                                                                    <Typography variant="body2" fontWeight={900}>
                                                                                        {p.variety_name}
                                                                                    </Typography>
                                                                                </Box>
                                                                                <Box>
                                                                                    <Typography variant="caption" sx={{ opacity: 0.75 }}>
                                                                                        Área (ha)
                                                                                    </Typography>
                                                                                    <Typography variant="body2" fontWeight={900}>
                                                                                        {fmtHa(p.areaHa)}
                                                                                    </Typography>
                                                                                </Box>
                                                                                <Box>
                                                                                    <Typography variant="caption" sx={{ opacity: 0.75 }}>
                                                                                        Velocidade
                                                                                    </Typography>
                                                                                    <Typography variant="body2" fontWeight={900}>
                                                                                        {fmtHa(p.velocity)} Km/h
                                                                                    </Typography>
                                                                                </Box>
                                                                                <Box>
                                                                                    <Typography variant="caption" sx={{ opacity: 0.75 }}>
                                                                                        Equipamento
                                                                                    </Typography>
                                                                                    <Typography variant="body2" fontWeight={900}>
                                                                                        {p.equipmentName}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        </Box>
                                                                    ))}
                                                                </Stack>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                );
                                            })}
                                        </Stack>

                                    </Paper>
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Modal>
    );
}
