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

// rgb(...) -> rgba(..., a)
const rgbaFromRgb = (rgb, alpha = 0.28) => {
  const s = String(rgb || "").trim();
  const m = s.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (!m) return `rgba(255,255,255,${alpha})`;
  return `rgba(${m[1]},${m[2]},${m[3]},${alpha})`;
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

const resolveUnidade = (ins) => {
  const raw =
    ins?.insumo_unit ||
    ins?.unidade_medida ||
    ins?.unidadeMedida ||
    ins?.um ||
    "";

  if (raw) {
    return String(raw).replace("/ha", "").replace("l", "L").trim();
  }

  const tipo = String(ins?.insumo_unit ?? "").toLowerCase();

  if (tipo.includes("liquid") || tipo.includes("óleo") || tipo.trim() === "l") return "L";
  if (tipo.includes("solido") || tipo.includes("fert")) return "kg";

  return "";
};

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

      const saldoHa = typeof getSaldoHa === "function" ? toNumber(getSaldoHa(app)) : 0;
      if (!saldoHa || saldoHa <= 0) continue;

      for (const ins of insumos) {
        const nome = String(ins?.insumo ?? "").trim();
        if (!nome) continue;

        const tipo = normTipo(ins?.tipo);

        // remover Operação
        if (normTxt(tipo) === "operacao" || normTxt(tipo) === "operação") continue;

        // pendente = dose/ha * saldoHa
        const doseHa = toNumber(ins?.dose);
        const qtdPendente = doseHa > 0 ? doseHa * saldoHa : 0;
        if (!qtdPendente) continue;

        const key = `${tipo}__${nome}`;

        if (!acc.has(key)) {
          acc.set(key, {
            key,
            nome,
            tipo,
            total: 0,
            unidade: resolveUnidade(ins),
          });
        }

        acc.get(key).total += qtdPendente;
      }
    }

    return Array.from(acc.values())
      .map((p) => ({
        ...p,
        total: Math.ceil(p.total), // ✅ sempre arredonda pra cima
      }))
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
          produtos.map((p, idx) => {
            const chipColor = getColorChip(p.tipo);
            const borderColor = rgbaFromRgb(chipColor, 0.78); // bem transparente
            const shadowColor = rgbaFromRgb(chipColor, 0.04); // ainda mais suave

            return (
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

                  // ✅ borda no tom do chip (transparente)
                  borderBottom: `1px solid ${borderColor}`,
                //   borderTop: `1px solid ${borderColor}`,
                  borderRight: `1px solid ${borderColor}`,
                  // opcional: brilho suave combinando
                  boxShadow: `0 0 0 1px ${shadowColor}`,

                  // stripes
                  backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.06)",

                  // hover leve (opcional)
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.14)",
                  },
                }}
              >
                <Chip
                  label={p.tipo}
                  size="small"
                  sx={{
                    backgroundColor: chipColor,
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

                <Box
                  sx={{
                    minWidth: 0,
                    overflowX: "auto",
                    overflowY: "hidden",
                    whiteSpace: "nowrap",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": { height: 6 },
                    marginLeft: "15px",
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
                  {p.total.toLocaleString("pt-BR")}
                  {p.unidade ? ` ${p.unidade}` : ""}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}
