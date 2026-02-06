import { useMemo } from "react";
import { Box, Divider, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";

// mesma paleta do DetailAppData
const colorDict = [
    { tipo: "Inseticida", color: "rgb(218,78,75)" },
    { tipo: "Herbicida", color: "rgb(166,166,54)" },
    { tipo: "Adjuvante", color: "rgb(136,171,172)" },
    { tipo: "Óleo", color: "rgb(120,161,144)" },
    { tipo: "Micronutrientes", color: "rgb(118,192,226)" },
    { tipo: "Fungicida", color: "rgb(238,165,56)" },
    { tipo: "Fertilizante", color: "rgb(76,180,211)" },
    { tipo: "Nutrição ", color: "rgb(87,77,109)" },
    { tipo: "Biológico", color: "rgb(69,133,255)" },
];

const getColorChip = (tipo) => {
    const found = colorDict.find((t) => t.tipo === tipo);
    return found ? found.color : "rgb(255,255,255,0.1)";
};

const toNumber = (v) => {
    if (v == null) return 0;
    if (typeof v === "number") return Number.isFinite(v) ? v : 0;
    const s = String(v).replace(",", ".").replace(/[^\d.-]/g, "");
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
};

const normTipo = (tipo) => {
    const t = String(tipo ?? "").trim();
    if (t.includes("Óleo Mineral")) return "Óleo";
    return t || "—";
};

// normaliza pra ordenar (sem acento)
const normTxt = (v) =>
    (v ?? "")
        .toString()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim();

export default function ResumoProdutosConsolidados({
    rows = [], // aplicações filtradas
    title = "Produtos consolidados (filtro atual)",
    colors,
    getSaldoHa, // (app) => saldo em ha
}) {
    const produtos = useMemo(() => {
        const acc = new Map();

        for (const app of rows || []) {
            const insumos = Array.isArray(app?.insumos) ? app.insumos : [];

            // saldo a aplicar (Ha) da aplicação
            const saldoHa =
                typeof getSaldoHa === "function" ? toNumber(getSaldoHa(app)) : 0;

            // se não tem saldo, não tem pendência
            if (!saldoHa || saldoHa <= 0) continue;

            for (const ins of insumos) {
                const nome = String(ins?.insumo ?? "").trim();
                if (!nome) continue;

                const tipo = normTipo(ins?.tipo);

                // 1) remover Operação
                if (normTxt(tipo) === "operacao" || normTxt(tipo) === "operação") continue;

                // 2) pendente = dose/ha * saldoHa
                const doseHa = toNumber(ins?.dose);
                const qtdPendente = doseHa > 0 ? doseHa * saldoHa : 0;

                if (!qtdPendente) continue;

                const key = `${tipo}__${nome}`;

                if (!acc.has(key)) {
                    acc.set(key, { key, nome, tipo, total: 0 });
                }

                acc.get(key).total += qtdPendente;
            }
        }

        // REGRA DE NEGÓCIO:
        // total por produto deve ser SEMPRE arredondado para cima
        return Array.from(acc.values())
            .map((p) => ({
                ...p,
                total: Math.ceil(p.total),
            }))
            // ordenar por tipo (alfabética) e depois por nome
            .sort((a, b) => {
                const ta = normTxt(a.tipo);
                const tb = normTxt(b.tipo);
                if (ta !== tb) return ta.localeCompare(tb, "pt-BR");
                return normTxt(a.nome).localeCompare(normTxt(b.nome), "pt-BR");
            });
    }, [rows, getSaldoHa]);

    if (!rows?.length) return null;

    return (
        <Box sx={{ width: "100%", mt: 2 }}>
            <Divider sx={{ mb: 1 }}>
                <h3 style={{ margin: 0 }}>{title}</h3>
            </Divider>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    p: 0.75,
                    borderRadius: 2,
                    backgroundColor: colors?.blueOrigin?.[700] || "rgba(255,255,255,0.06)",
                }}
            >
                {produtos.length === 0 ? (
                    <Typography variant="body2" sx={{ opacity: 0.85, color: "whitesmoke" }}>
                        Nenhum insumo pendente nos filtros atuais.
                    </Typography>
                ) : (
                    produtos.map((p, idx) => (
                        <Box
                            key={p.key}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "max-content minmax(0, 1fr) max-content",
                                alignItems: "center",
                                columnGap: 0.75,
                                px: 0.75,
                                py: 0.35,
                                borderRadius: 1.25,
                                border: "1px solid rgba(255,255,255,0.14)",
                                backgroundColor:
                                    idx % 2 === 0
                                        ? "rgba(255,255,255,0.20)"
                                        : "rgba(255,255,255,0.06)",
                            }}
                        >
                            <Chip
                                label={p.tipo}
                                size="small"
                                sx={{
                                    backgroundColor: getColorChip(p.tipo),
                                    fontWeight: 900,
                                    border: "0.1em solid black",
                                    borderRadius: "6px",
                                    height: 20,
                                    "& .MuiChip-label": { px: 0.6, fontSize: "0.70rem" },
                                    justifySelf: "start",
                                    width: "max-content",
                                    maxWidth: 160,
                                    minWidth: 75,
                                }}
                            />

                            {/* NOME: ocupa o meio, sem empurrar total; scroll quando necessário */}
                            <Box
                                sx={{
                                    minWidth: 0,
                                    overflowX: "auto",
                                    overflowY: "hidden",
                                    whiteSpace: "nowrap",
                                    WebkitOverflowScrolling: "touch",
                                    scrollbarWidth: "thin",
                                    "&::-webkit-scrollbar": { height: 6 },
                                    marginLeft: '15px'
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: "0.80rem",
                                        color: "whitesmoke",
                                        whiteSpace: "nowrap",
                                    }}
                                    title={p.nome}
                                >
                                    {p.nome}
                                </Typography>
                            </Box>

                            {/* TOTAL: só o tamanho do conteúdo */}
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 900,
                                    fontSize: "0.80rem",
                                    color: "whitesmoke",
                                    textAlign: "right",
                                    justifySelf: "end",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {p.total.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                })}
                            </Typography>
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
}
