import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Table from "react-bootstrap/Table";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { ColorModeContext, tokens } from "../../theme";
import {
  selectCurrentUser,
  selectIsAdminUser
} from "../../store/user/user.selector";
import {
  getClassifiableTruckMoves,
  saveTruckClassification,
  uploadTruckClassificationImage
} from "../../utils/firebase/firebase.datatable";
import beans from "../../utils/assets/icons/beans2.png";
import soy from "../../utils/assets/icons/soy.png";
import rice from "../../utils/assets/icons/rice.png";
import corn from "../../utils/assets/icons/corn.png";
import question from "../../utils/assets/icons/question.png";
import styles from "./classificacao-cargas.module.css";

const DECIMALS = 2;
const PENEIRAS = [
  { key: "pn_400", label: "PN 4,00" },
  { key: "pn_375", label: "PN 3,75" },
  { key: "pn_350", label: "PN 3,50" },
  { key: "pn_300", label: "PN 3,00" },
  { key: "pn_250", label: "PN 2,50" },
  { key: "pn_225_saida", label: "PN 2,25 / saída" }
];
const DEFEITOS = [
  { key: "impurezas", label: "Impurezas" },
  { key: "partidos", label: "Partidos" },
  { key: "descascados", label: "Descascados" },
  { key: "maturos", label: "Maturos" },
  { key: "torrados_pedras", label: "Torrados / pedras" },
  { key: "descoloridos", label: "Descoloridos" },
  { key: "descoloridos_leve", label: "Descoloridos leve" },
  { key: "outras_variedades", label: "Outras variedades" },
  { key: "mofados", label: "Mofados" },
  { key: "soja", label: "Soja" },
  { key: "atacados_insetos", label: "Atacados por insetos" },
  { key: "amassados", label: "Amassados" },
  { key: "germinados", label: "Germinados" },
  { key: "enrugados", label: "Enrugados" },
  { key: "fermentados", label: "Fermentados" },
  { key: "fedegoso", label: "Fedegoso" }
];
const selectSx = {
  minWidth: 180,
  "& .MuiInputBase-root": { height: 34, fontSize: "0.78rem" },
  "& .MuiSelect-select": {
    padding: "5px 28px 5px 10px",
    minHeight: "unset !important",
    display: "flex",
    alignItems: "center"
  },
  "& .MuiInputLabel-root": { fontSize: "0.78rem", top: "-2px" },
  "& .MuiChip-root": { height: 21, fontSize: "0.68rem" }
};

const normalized = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
const dateFrom = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (value.seconds) return new Date(value.seconds * 1000);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};
const loadDate = (load) =>
  dateFrom(load?.appDate) ||
  dateFrom(load?.createdAt) ||
  dateFrom(load?.entrada);
const dateKey = (value) => {
  const date = dateFrom(value);
  if (!date) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const today = () => dateKey(new Date());
const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return dateKey(date);
};
const dateLabel = (value, full = false) => {
  const date = dateFrom(value);
  if (!date) return "-";
  return full
    ? date.toLocaleString("pt-BR")
    : `${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
};
const ticket = (load) => load?.ticket || load?.codTicketPro || "-";
const project = (load) => load?.projeto || load?.fazendaOrigem || "-";
const destination = (load) => load?.fazendaDestino || load?.destino || "-";
const romaneio = (load) => load?.relatorioColheita || load?.romaneio || "-";
const feijao = (load) => normalized(load?.cultura).includes("feijao");
const plate = (value) => {
  const text = String(value || "").toUpperCase();
  return text.length > 3 ? `${text.slice(0, 3)}-${text.slice(3)}` : text || "-";
};
const weight = (value) =>
  Number(value) > 0 ? Number(value).toLocaleString("pt-BR") : "-";
const hasNumericValue = (value) =>
  value !== "" &&
  value !== null &&
  value !== undefined &&
  Number.isFinite(Number(value));
const metric = (value, unit = "") =>
  hasNumericValue(value)
    ? `${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}${unit}`
    : "-";
const photoUrl = (photo) =>
  typeof photo === "string" ? photo : photo?.url || photo?.downloadURL || "";
const iconForCulture = (culture) => {
  const value = normalized(culture);
  if (value.includes("feijao")) return beans;
  if (value.includes("soja")) return soy;
  if (value.includes("arroz")) return rice;
  if (value.includes("milho")) return corn;
  return question;
};
const cultureMeta = (culture) => {
  const value = normalized(culture);
  if (value.includes("soja"))
    return {
      label: "Soja",
      icon: soy,
      main: "#5e9360",
      soft: "#eaf4e7",
      text: "#315b37"
    };
  if (value.includes("arroz"))
    return {
      label: "Arroz",
      icon: rice,
      main: "#5b93b6",
      soft: "#e8f3f9",
      text: "#285b7d"
    };
  if (value.includes("milho"))
    return {
      label: "Milho",
      icon: corn,
      main: "#bd8a2d",
      soft: "#fbf1dc",
      text: "#76500a"
    };
  return {
    label: "Feijão",
    icon: beans,
    main: "#9b6a43",
    soft: "#f6ece2",
    text: "#704422"
  };
};
const numberToDigits = (value, places = DECIMALS) => {
  if (value === "" || value === null || value === undefined) return "";
  const number = Number(String(value).replace(",", "."));
  return Number.isFinite(number)
    ? String(Math.round(number * 10 ** places))
    : "";
};
const digitsToNumber = (value, places = DECIMALS) => {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits ? Number(digits) / 10 ** places : null;
};
const empty = (fields) =>
  Object.fromEntries(fields.map(({ key }) => [key, ""]));
const asDigits = (fields, values = {}) =>
  Object.fromEntries(
    fields.map(({ key }) => [key, numberToDigits(values[key])])
  );
const asNumbers = (values) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, digitsToNumber(value)])
  );
const createForm = (record) => {
  const data = record?.dados || {};
  return {
    pesoAmostraGramas: numberToDigits(data.pesoAmostraGramas),
    umidadePercentual: numberToDigits(data.umidadePercentual),
    impurezasPercentual: numberToDigits(data.impurezasPercentual),
    bandinhaPercentual: numberToDigits(data.bandinhaPercentual),
    peneiras: { ...empty(PENEIRAS), ...asDigits(PENEIRAS, data.peneiras) },
    defeitos: { ...empty(DEFEITOS), ...asDigits(DEFEITOS, data.defeitos) },
    classificacaoFinal: data.classificacaoFinal || "",
    observacoes: data.observacoes || ""
  };
};

const filledFieldSx = (value) => {
  const filled = String(value ?? "").trim() !== "";
  if (!filled) return {};
  return {
    "& .MuiOutlinedInput-root": { backgroundColor: "#edf9f0" },
    "& .MuiOutlinedInput-root.Mui-disabled": { backgroundColor: "#edf9f0" },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#4f9d69",
      borderWidth: 2
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#347d4d"
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#347d4d"
    },
    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
      borderColor: "#4f9d69",
      borderWidth: 2
    },
    "& .MuiInputLabel-root": { color: "#347d4d" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#347d4d" }
  };
};

const ShiftField = ({ value, onChange, places = DECIMALS, sx, ...props }) => {
  const digits = String(value || "").replace(/\D/g, "");
  const padded = digits.padStart(places + 1, "0");
  const display = digits
    ? `${Number(padded.slice(0, -places))},${padded.slice(-places)}`
    : "";
  return (
    <TextField
      {...props}
      sx={{ ...filledFieldSx(digits), ...sx }}
      type="text"
      inputMode="numeric"
      placeholder="-"
      value={display}
      onChange={(event) => {
        const next = event.target.value
          .replace(/\D/g, "")
          .replace(/^0+(?=\d)/, "");
        onChange(next);
      }}
      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
    />
  );
};
const Info = ({ label, value }) => (
  <Box
    sx={{
      border: "1px solid #d9e0e6",
      borderRadius: 1.5,
      p: 1,
      backgroundColor: "#f8fafc"
    }}
  >
    <Typography variant="caption" sx={{ color: "#64748b" }}>
      {label}
    </Typography>
    <Typography fontWeight={800} sx={{ color: "#172033" }}>
      {value}
    </Typography>
  </Box>
);
const CompactInfo = ({ label, value }) => (
  <Box sx={{ minWidth: 0, px: 1, py: 0.45, borderLeft: "1px solid #e2e8f0" }}>
    <Typography
      variant="caption"
      sx={{
        display: "block",
        color: "#64748b",
        fontSize: "0.62rem",
        fontWeight: 800,
        letterSpacing: 0.2,
        lineHeight: 1.15
      }}
    >
      {label.toUpperCase()}
    </Typography>
    <Typography
      variant="body2"
      noWrap
      fontWeight={800}
      sx={{ color: "#172033", fontSize: "0.74rem" }}
    >
      {value}
    </Typography>
  </Box>
);
const actorLabel = (actor) =>
  actor?.nome ||
  actor?.displayName ||
  actor?.email ||
  actor?.uid ||
  "Usuário não identificado";
const RecordInfo = ({ record }) => {
  if (!record) return null;
  const wasEdited =
    record?.updatedBy?.uid && record.updatedBy.uid !== record?.createdBy?.uid;
  return (
    <Box
      sx={{
        mb: 2,
        p: 1.25,
        border: "1px solid #d9e0e6",
        borderRadius: 1.5,
        backgroundColor: "#f8fafc"
      }}
    >
      <Typography variant="caption" sx={{ display: "block", color: "#64748b" }}>
        Salva por
      </Typography>
      <Typography variant="body2" fontWeight={800} sx={{ color: "#172033" }}>
        {actorLabel(record.createdBy)}
        {record.createdAt ? ` — ${dateLabel(record.createdAt, true)}` : ""}
      </Typography>
      {wasEdited && (
        <>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "#64748b", mt: 0.75 }}
          >
            Última edição
          </Typography>
          <Typography
            variant="body2"
            fontWeight={800}
            sx={{ color: "#172033" }}
          >
            {actorLabel(record.updatedBy)}
            {record.updatedAt ? ` — ${dateLabel(record.updatedAt, true)}` : ""}
          </Typography>
        </>
      )}
    </Box>
  );
};
const Photo = ({ photo, label }) => {
  const url = photoUrl(photo);
  if (!url) return null;
  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="subtitle2"
        fontWeight={800}
        sx={{ color: "#0e5e91", mb: 0.75 }}
      >
        {label}
      </Typography>
      <Box
        component="a"
        href={url}
        target="_blank"
        rel="noreferrer"
        sx={{
          display: "inline-flex",
          overflow: "hidden",
          border: "1px solid #d9e0e6",
          borderRadius: 1.5
        }}
      >
        <Box
          component="img"
          src={url}
          alt={label}
          crossOrigin="anonymous"
          sx={{
            display: "block",
            width: "100%",
            maxWidth: 420,
            maxHeight: 280,
            objectFit: "contain"
          }}
        />
      </Box>
    </Box>
  );
};
const ComparePhoto = ({ photo, label }) => {
  const url = photoUrl(photo);
  if (!url) return "-";
  return (
    <Box
      component="a"
      href={url}
      target="_blank"
      rel="noreferrer"
      sx={{
        display: "inline-flex",
        overflow: "hidden",
        maxWidth: "100%",
        border: "1px solid #d9e0e6",
        borderRadius: 1.25,
        backgroundColor: "#fff"
      }}
    >
      <Box
        component="img"
        src={url}
        alt={label}
        crossOrigin="anonymous"
        sx={{
          display: "block",
          width: "100%",
          maxWidth: 210,
          height: 128,
          objectFit: "cover"
        }}
      />
    </Box>
  );
};
const Fields = ({ title, fields, values, change, disabled }) => (
  <Paper variant="outlined" sx={{ mt: 2.25, p: 2, borderColor: "#d9e0e6" }}>
    <Typography
      variant="h5"
      fontWeight={900}
      sx={{ color: "#0e5e91", mb: 1.5 }}
    >
      {title}
    </Typography>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)"
        },
        gap: 1.25
      }}
    >
      {fields.map((field) => (
        <ShiftField
          key={field.key}
          size="small"
          disabled={disabled}
          label={`${field.label} (g)`}
          value={values[field.key]}
          onChange={(value) => change(field.key, value)}
        />
      ))}
    </Box>
  </Paper>
);

const ClassificationForm = ({
  record,
  form,
  setForm,
  imageFile,
  setImageFile,
  locked,
  label
}) => {
  const update = (group, key, value) =>
    setForm((previous) => ({
      ...previous,
      [group]: { ...previous[group], [key]: value }
    }));
  return (
    <Box>
      {locked && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.25,
            mb: 2,
            borderRadius: 1.5,
            backgroundColor: "#fef3c7",
            color: "#854d0e"
          }}
        >
          <LockRoundedIcon fontSize="small" />
          <Typography variant="body2" fontWeight={700}>
            {label} concluída e bloqueada.
          </Typography>
        </Box>
      )}
      <RecordInfo record={record} />
      <Paper variant="outlined" sx={{ p: 2, borderColor: "#d9e0e6" }}>
        <Typography
          variant="h5"
          fontWeight={900}
          sx={{ color: "#0e5e91", mb: 1.5 }}
        >
          Dados da amostra
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
            gap: 1.25
          }}
        >
          <ShiftField
            required
            size="small"
            disabled={locked}
            label="Peso da amostra (g)"
            value={form.pesoAmostraGramas}
            onChange={(value) =>
              setForm((previous) => ({ ...previous, pesoAmostraGramas: value }))
            }
          />
          <ShiftField
            size="small"
            disabled={locked}
            label="Umidade (%)"
            value={form.umidadePercentual}
            onChange={(value) =>
              setForm((previous) => ({ ...previous, umidadePercentual: value }))
            }
          />
          <ShiftField
            size="small"
            disabled={locked}
            label="Impureza (%)"
            value={form.impurezasPercentual}
            onChange={(value) =>
              setForm((previous) => ({
                ...previous,
                impurezasPercentual: value
              }))
            }
          />
          <ShiftField
            size="small"
            disabled={locked}
            label="Bandinha (%)"
            value={form.bandinhaPercentual}
            onChange={(value) =>
              setForm((previous) => ({
                ...previous,
                bandinhaPercentual: value
              }))
            }
          />
        </Box>
      </Paper>
      <Fields
        title="Peneiras"
        fields={PENEIRAS}
        values={form.peneiras}
        disabled={locked}
        change={(key, value) => update("peneiras", key, value)}
      />
      <Fields
        title="Defeitos"
        fields={DEFEITOS}
        values={form.defeitos}
        disabled={locked}
        change={(key, value) => update("defeitos", key, value)}
      />
      <Paper variant="outlined" sx={{ mt: 2.25, p: 2, borderColor: "#d9e0e6" }}>
        <Typography
          variant="h5"
          fontWeight={900}
          sx={{ color: "#0e5e91", mb: 1.5 }}
        >
          Conclusão da amostra
        </Typography>
        <Box sx={{ display: "grid", gap: 1.25 }}>
          <TextField
            fullWidth
            size="small"
            disabled={locked}
            sx={filledFieldSx(form.classificacaoFinal)}
            label="Classificação final"
            helperText="Ex.: Tipo 1, Tipo 2 ou fora de tipo."
            value={form.classificacaoFinal}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                classificacaoFinal: event.target.value
              }))
            }
          />
          <TextField
            fullWidth
            size="small"
            disabled={locked}
            sx={filledFieldSx(form.observacoes)}
            label="Observações"
            multiline
            minRows={3}
            value={form.observacoes}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                observacoes: event.target.value
              }))
            }
          />
        </Box>
        {!locked && (
          <Button
            component="label"
            variant="outlined"
            startIcon={<PhotoCameraRoundedIcon />}
            sx={{
              mt: 1.5,
              textTransform: "none",
              ...(imageFile || record?.foto
                ? {
                    borderColor: "#4f9d69",
                    borderWidth: 2,
                    color: "#347d4d",
                    backgroundColor: "#f0faf3",
                    "&:hover": {
                      borderColor: "#347d4d",
                      borderWidth: 2,
                      backgroundColor: "#e3f5e8"
                    }
                  }
                : {})
            }}
          >
            {imageFile
              ? imageFile.name
              : record?.foto
                ? "Substituir foto"
                : "Adicionar foto"}
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(event) =>
                setImageFile(event.target.files?.[0] || null)
              }
            />
          </Button>
        )}
        <Photo photo={record?.foto} label={`Foto da ${label.toLowerCase()}`} />
      </Paper>
    </Box>
  );
};

const Compare = ({ original, counterproof }) => {
  const originalData = original?.dados || {};
  const counterData = counterproof?.dados || {};
  const valueFor = (data, key, group) =>
    group ? data[group]?.[key] : data[key];
  const rows = [
    ["Peso da amostra", "pesoAmostraGramas", null, " g"],
    ["Umidade", "umidadePercentual", null, " %"],
    ["Impureza", "impurezasPercentual", null, " %"],
    ["Bandinha", "bandinhaPercentual", null, " %"],
    ...PENEIRAS.map((item) => [
      `${item.label} (g)`,
      item.key,
      "peneiras",
      " g"
    ]),
    ...DEFEITOS.map((item) => [`${item.label} (g)`, item.key, "defeitos", " g"])
  ];
  const variation = (originalValue, counterproofValue) => {
    const first = Number(originalValue);
    const second = Number(counterproofValue);
    if (
      !hasNumericValue(originalValue) ||
      !hasNumericValue(counterproofValue) ||
      first === 0
    )
      return "-";
    const percentage = ((second - first) / first) * 100;
    if (percentage === 0)
      return (
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          Sem variação
        </Typography>
      );
    const isUp = percentage > 0;
    const color = isUp ? "#23864a" : "#c0392b";
    const Icon = isUp ? TrendingUpRoundedIcon : TrendingDownRoundedIcon;
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.35,
          color,
          fontWeight: 900
        }}
      >
        <Icon fontSize="small" />
        {isUp ? "+" : ""}
        {percentage.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
        %
      </Box>
    );
  };
  const row = (label, a, b, change = "-") => (
    <Box
      key={label}
      sx={{
        display: "grid",
        gridTemplateColumns:
          "minmax(150px, 1fr) minmax(170px, 1fr) minmax(170px, 1fr) minmax(130px, 0.7fr)",
        borderBottom: "1px solid #e2e8f0"
      }}
    >
      <Typography sx={{ p: 1, fontWeight: 700, color: "#334155" }}>
        {label}
      </Typography>
      <Box
        sx={{
          p: 1,
          borderLeft: "1px solid #e2e8f0",
          backgroundColor:
            a !== "-" && a !== null && a !== undefined
              ? "rgba(79, 157, 105, 0.12)"
              : "#fff"
        }}
      >
        {a}
      </Box>
      <Box
        sx={{
          p: 1,
          borderLeft: "1px solid #e2e8f0",
          backgroundColor:
            b !== "-" && b !== null && b !== undefined
              ? "rgba(79, 157, 105, 0.12)"
              : "#fff"
        }}
      >
        {b}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          borderLeft: "1px solid #e2e8f0"
        }}
      >
        {change}
      </Box>
    </Box>
  );
  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{ p: 2, borderColor: "#d9e0e6", overflowX: "auto" }}
      >
        <Typography
          variant="h5"
          fontWeight={900}
          sx={{ color: "#0e5e91", mb: 1.5 }}
        >
          Comparação da classificação
        </Typography>
        <Box
          sx={{
            minWidth: 650,
            border: "1px solid #e2e8f0",
            borderRadius: 1.5,
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "minmax(150px, 1fr) minmax(170px, 1fr) minmax(170px, 1fr) minmax(130px, 0.7fr)",
              backgroundColor: "#0e5e91",
              color: "#fff"
            }}
          >
            <Typography sx={{ p: 1, fontWeight: 800 }}>Campo</Typography>
            <Typography sx={{ p: 1, fontWeight: 800 }}>
              Classificação
            </Typography>
            <Typography sx={{ p: 1, fontWeight: 800 }}>Contraprova</Typography>
            <Typography sx={{ p: 1, fontWeight: 800 }}>Variação</Typography>
          </Box>
          {rows.map(([label, key, group, unit]) => {
            const originalValue = valueFor(originalData, key, group);
            const counterproofValue = valueFor(counterData, key, group);
            return row(
              label,
              metric(originalValue, unit),
              metric(counterproofValue, unit),
              variation(originalValue, counterproofValue)
            );
          })}
          {row(
            "Classificado",
            originalData.classificacaoFinal || "-",
            counterData.classificacaoFinal || "-"
          )}
          {row(
            "Observações",
            originalData.observacoes || "-",
            counterData.observacoes || "-"
          )}
          {row(
            "Foto",
            <ComparePhoto
              photo={original?.foto}
              label="Foto da classificação"
            />,
            <ComparePhoto
              photo={counterproof?.foto}
              label="Foto da contraprova"
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

const ReportValue = ({ label, value, accent = false }) => (
  <Box
    sx={{
      p: 1,
      border: `1px solid ${accent ? "#4f9d69" : "#d9e0e6"}`,
      borderRadius: 1.25,
      backgroundColor: accent ? "rgba(79, 157, 105, 0.12)" : "#f8fafc"
    }}
  >
    <Typography
      variant="caption"
      sx={{
        display: "block",
        color: "#64748b",
        fontWeight: 800,
        fontSize: "0.62rem",
        letterSpacing: 0.2
      }}
    >
      {label.toUpperCase()}
    </Typography>
    <Typography variant="body2" fontWeight={900} sx={{ color: "#172033" }}>
      {value}
    </Typography>
  </Box>
);
const ReportMeasurements = ({ title, fields, values = {} }) => (
  <Box sx={{ mt: 2 }}>
    <Typography fontWeight={900} sx={{ color: "#0e5e91", mb: 0.75 }}>
      {title}
    </Typography>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 0.75
      }}
    >
      {fields.map((field) => (
        <ReportValue
          key={field.key}
          label={field.label}
          value={metric(values[field.key], " g")}
          accent={hasNumericValue(values[field.key])}
        />
      ))}
    </Box>
  </Box>
);
const ExportRecord = ({ record, title }) => {
  const data = record?.dados || {};
  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight={900}
        sx={{ color: "#0e5e91", mb: 1 }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 0.75
        }}
      >
        <ReportValue
          label="Peso da amostra"
          value={metric(data.pesoAmostraGramas, " g")}
          accent={hasNumericValue(data.pesoAmostraGramas)}
        />
        <ReportValue
          label="Umidade"
          value={metric(data.umidadePercentual, " %")}
          accent={hasNumericValue(data.umidadePercentual)}
        />
        <ReportValue
          label="Impureza"
          value={metric(data.impurezasPercentual, " %")}
          accent={hasNumericValue(data.impurezasPercentual)}
        />
        <ReportValue
          label="Bandinha"
          value={metric(data.bandinhaPercentual, " %")}
          accent={hasNumericValue(data.bandinhaPercentual)}
        />
      </Box>
      <ReportMeasurements
        title="Peneiras"
        fields={PENEIRAS}
        values={data.peneiras}
      />
      <ReportMeasurements
        title="Defeitos"
        fields={DEFEITOS}
        values={data.defeitos}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 0.75,
          mt: 2
        }}
      >
        <ReportValue
          label="Classificação final"
          value={data.classificacaoFinal || "-"}
          accent={Boolean(data.classificacaoFinal)}
        />
        <ReportValue
          label="Observações"
          value={data.observacoes || "-"}
          accent={Boolean(data.observacoes)}
        />
      </Box>
      {photoUrl(record?.foto) && (
        <Box sx={{ mt: 2 }}>
          <Typography fontWeight={900} sx={{ color: "#0e5e91", mb: 0.75 }}>
            Foto da amostra
          </Typography>
          <ComparePhoto photo={record.foto} label="Foto da amostra" />
        </Box>
      )}
    </Box>
  );
};
const ExportReport = ({
  load,
  culture,
  variety,
  tab,
  original,
  counterproof
}) => (
  <Box sx={{ width: 1050, p: 3, backgroundColor: "#fff", color: "#172033" }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        pb: 1.25,
        borderBottom: `3px solid ${culture.main}`
      }}
    >
      <Box>
        <Typography
          sx={{
            color: culture.text,
            fontSize: "0.72rem",
            fontWeight: 900,
            letterSpacing: 0.5
          }}
        >
          CLASSIFICAÇÃO DA CARGA
        </Typography>
        <Typography variant="h4" fontWeight={900} sx={{ color: culture.text }}>
          {culture.label}
          {variety ? ` — ${variety}` : ""}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 48,
          height: 48,
          display: "grid",
          placeItems: "center",
          borderRadius: 2,
          backgroundColor: culture.soft
        }}
      >
        <Box
          component="img"
          src={culture.icon}
          alt={culture.label}
          sx={{ width: 31, height: 31, objectFit: "contain" }}
        />
      </Box>
    </Box>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1.5fr 1fr 4fr",
        mt: 1.5,
        mb: 2,
        border: "1px solid #e2e8f0",
        borderLeft: 0,
        borderRadius: 1.25,
        overflow: "hidden",
        backgroundColor: "#f8fafc"
      }}
    >
      <CompactInfo label="Data" value={dateLabel(loadDate(load))} />
      <CompactInfo label="Ticket" value={ticket(load)} />
      <CompactInfo label="Romaneio" value={romaneio(load)} />
      <CompactInfo
        label="Projeto"
        value={project(load).replace("Projeto ", "")}
      />
      <CompactInfo label="Placa" value={plate(load.placa)} />
      <CompactInfo label="Motorista" value={load.motorista || "-"} />
    </Box>
    {tab === "compare" ? (
      <Compare original={original} counterproof={counterproof} />
    ) : (
      <ExportRecord
        record={tab === "counterproof" ? counterproof : original}
        title={
          tab === "counterproof" ? "Contraprova" : "Classificação principal"
        }
      />
    )}
  </Box>
);

const ClassificationDialog = ({ load, onClose, onSaved }) => {
  const user = useSelector(selectCurrentUser);
  // Neste projeto, selectIsAdminUser é a permissão do superUser operacional.
  const isSuperUser = useSelector(selectIsAdminUser);
  const [tab, setTab] = useState("original");
  const [editing, setEditing] = useState(false);
  const [originalForm, setOriginalForm] = useState(() =>
    createForm(load?.classificacao)
  );
  const [counterForm, setCounterForm] = useState(() =>
    createForm(load?.classificacao?.contraprova)
  );
  const [originalImage, setOriginalImage] = useState(null);
  const [counterImage, setCounterImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const reportRef = useRef(null);
  const classification = load?.classificacao || null;
  const original =
    classification?.status === "concluida" ? classification : null;
  const counterproof =
    classification?.contraprova?.status === "concluida"
      ? classification.contraprova
      : null;
  const isCounterproof = tab === "counterproof";
  const record = isCounterproof ? counterproof : original;
  const form = isCounterproof ? counterForm : originalForm;
  const setForm = isCounterproof ? setCounterForm : setOriginalForm;
  const image = isCounterproof ? counterImage : originalImage;
  const setImage = isCounterproof ? setCounterImage : setOriginalImage;
  const label = isCounterproof ? "Contraprova" : "Classificação";
  const locked = Boolean(record && !editing);
  const culture = cultureMeta(load.cultura);
  const variety = load?.variedade || load?.mercadoria || "";
  const canExport = Boolean(
    (tab === "original" && original) ||
    (tab === "counterproof" && counterproof) ||
    (tab === "compare" && original && counterproof)
  );
  useEffect(() => setEditing(false), [tab]);

  const saveRecord = async () => {
    const sampleWeight = digitsToNumber(form.pesoAmostraGramas);
    if (!sampleWeight || sampleWeight <= 0)
      throw new Error("Informe o peso da amostra para salvar a classificação.");
    let foto = record?.foto || null;
    if (image)
      foto = await uploadTruckClassificationImage(
        load.id,
        image,
        isCounterproof ? "contraprova" : "classificacao"
      );
    return {
      schemaVersion: 1,
      status: "concluida",
      bloqueada: true,
      cultura: "feijao",
      createdAt: record?.createdAt || new Date(),
      createdBy: record?.createdBy || {
        uid: user?.uid || "",
        email: user?.email || ""
      },
      updatedAt: new Date(),
      updatedBy: { uid: user?.uid || "", email: user?.email || "" },
      foto,
      dados: {
        pesoAmostraGramas: sampleWeight,
        umidadePercentual: digitsToNumber(form.umidadePercentual),
        impurezasPercentual: digitsToNumber(form.impurezasPercentual),
        bandinhaPercentual: digitsToNumber(form.bandinhaPercentual),
        peneiras: asNumbers(form.peneiras),
        defeitos: asNumbers(form.defeitos),
        classificacaoFinal: form.classificacaoFinal.trim(),
        observacoes: form.observacoes.trim()
      }
    };
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await saveRecord();
      const next = isCounterproof
        ? {
            ...classification,
            schemaVersion: 2,
            status: "concluida",
            bloqueada: true,
            contraprova: saved
          }
        : {
            ...saved,
            schemaVersion: 2,
            contraprova: classification?.contraprova || null
          };
      // Mantém o contrato legado na raiz da carga. A contraprova nunca altera esses campos.
      const legacySampleData = isCounterproof
        ? null
        : {
            umidade: String(digitsToNumber(form.umidadePercentual) ?? ""),
            impureza: String(digitsToNumber(form.impurezasPercentual) ?? ""),
            bandinha: String(digitsToNumber(form.bandinhaPercentual) ?? "")
          };
      await saveTruckClassification(load.id, next, legacySampleData);
      toast.success(`${label} salva e bloqueada com sucesso.`);
      onSaved(next);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar classificação", error);
      toast.error(error?.message || "Não foi possível salvar a classificação.");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    const target = isCounterproof
      ? "a contraprova"
      : "a classificação e sua contraprova";
    if (!window.confirm(`Excluir ${target}? Esta ação não pode ser desfeita.`))
      return;
    setSaving(true);
    try {
      if (isCounterproof) {
        const { contraprova, ...next } = classification;
        await saveTruckClassification(load.id, next);
        onSaved(next);
      } else {
        // updateDoc deve receber { classificacao: null }; os campos legados da carga não são tocados.
        await saveTruckClassification(load.id, null);
        onSaved(null);
      }
      toast.success(`${label} excluída com sucesso.`);
      onClose();
    } catch (error) {
      console.error("Erro ao excluir classificação", error);
      toast.error(
        error?.message || "Não foi possível excluir a classificação."
      );
    } finally {
      setSaving(false);
    }
  };
  const handleExport = async (format) => {
    if (!reportRef.current) return;
    setSaving(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#ffffff",
        scale: format === "pdf" ? 1.35 : 2,
        useCORS: true
      });
      const fileBase = `classificacao-${String(ticket(load)).replace(/[^a-zA-Z0-9_-]/g, "-") || load.id}-${tab === "compare" ? "comparacao" : "amostra"}`;
      if (format === "image") {
        const link = document.createElement("a");
        link.download = `${fileBase}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        const image = canvas.toDataURL("image/jpeg", 0.72);
        const landscape = canvas.width > canvas.height;
        const pdf = new jsPDF({
          orientation: landscape ? "landscape" : "portrait",
          unit: "mm",
          format: "a4"
        });
        const pageWidth = landscape ? 277 : 190;
        const pageHeight = landscape ? 190 : 277;
        const ratio = Math.min(
          pageWidth / canvas.width,
          pageHeight / canvas.height
        );
        const width = canvas.width * ratio;
        const height = canvas.height * ratio;
        pdf.addImage(
          image,
          "JPEG",
          (pageWidth - width) / 2,
          10,
          width,
          height,
          undefined,
          "FAST"
        );
        pdf.save(`${fileBase}.pdf`);
      }
    } catch (error) {
      console.error("Erro ao exportar classificação", error);
      toast.error("Não foi possível exportar o cartão.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog
      open
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: { borderRadius: 2, overflow: "hidden", backgroundColor: "#fff" }
      }}
    >
      <DialogTitle
        sx={{
          p: 0,
          color: culture.text,
          background: `linear-gradient(118deg, ${culture.soft} 0%, #ffffff 72%)`
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            px: { xs: 2, sm: 2.25 },
            py: 1.15
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: culture.text,
                opacity: 0.78,
                fontWeight: 800,
                letterSpacing: 0.35
              }}
            >
              CLASSIFICAÇÃO DA CARGA
            </Typography>
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{ color: culture.text, lineHeight: 1.2 }}
            >
              {culture.label}
              {variety ? ` — ${variety}` : ""}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              borderRadius: 2,
              border: `1px solid ${culture.main}35`,
              backgroundColor: "#ffffffc9"
            }}
          >
            <Box
              component="img"
              src={culture.icon}
              alt={culture.label}
              sx={{ width: 27, height: 27, objectFit: "contain" }}
            />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{ backgroundColor: "#f5f7fa", p: { xs: 1.5, sm: 2.5 } }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              md: "2fr 1fr 1fr 1.5fr 1fr 4fr"
            },
            mb: 1.25,
            border: "1px solid #e2e8f0",
            borderLeft: 0,
            borderRadius: 1.25,
            overflow: "hidden",
            backgroundColor: "#fff"
          }}
        >
          <CompactInfo label="Data" value={dateLabel(loadDate(load))} />
          <CompactInfo label="Ticket" value={ticket(load)} />
          <CompactInfo label="Romaneio" value={romaneio(load)} />
          <CompactInfo
            label="Projeto"
            value={project(load).replace("Projeto ", "")}
          />
          <CompactInfo label="Placa" value={plate(load.placa)} />
          <CompactInfo label="Motorista" value={load.motorista || "-"} />
        </Box>
        <Paper
          variant="outlined"
          sx={{ mb: 2, borderColor: "#d9e0e6", backgroundColor: "#fff" }}
        >
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 1.15,
              pt: 0.25,
              backgroundColor: "#ffffffa8",
              borderTop: `1px solid ${culture.main}24`,
              "& .MuiTabs-indicator": { display: "none" },
              "& .MuiTab-root": {
                minHeight: 42,
                px: 1.5,
                mr: 0.6,
                mb: 0.75,
                borderRadius: 1.5,
                color: culture.text,
                fontSize: "0.78rem",
                fontWeight: 800,
                textTransform: "none"
              },
              "& .MuiTab-root:hover:not(.Mui-disabled)": {
                backgroundColor: culture.soft
              },
              "& .MuiTab-root.Mui-selected": {
                color: "#fff",
                backgroundColor: culture.main,
                boxShadow: `0 3px 8px ${culture.main}4d`
              },
              "& .MuiTab-root.Mui-disabled": { color: "#94a3b8" }
            }}
          >
            <Tab
              value="original"
              icon={<AssignmentRoundedIcon fontSize="small" />}
              iconPosition="start"
              label={original ? "Amostra principal" : "Nova amostra"}
            />
            <Tab
              value="counterproof"
              disabled={!original}
              icon={<CheckCircleRoundedIcon fontSize="small" />}
              iconPosition="start"
              label={counterproof ? "Contraprova" : "Nova contraprova"}
            />
            <Tab
              value="compare"
              disabled={!original || !counterproof}
              icon={<CompareArrowsRoundedIcon fontSize="small" />}
              iconPosition="start"
              label="Comparar"
            />
          </Tabs>
        </Paper>
        {!original && (
          <Box
            sx={{
              mb: 2,
              p: 1.25,
              borderRadius: 1.5,
              color: culture.text,
              backgroundColor: culture.soft
            }}
          >
            <Typography variant="caption">
              A contraprova é liberada após salvar a classificação original.
            </Typography>
          </Box>
        )}
        {tab === "compare" ? (
          <Compare original={original} counterproof={counterproof} />
        ) : (
          <ClassificationForm
            record={record}
            form={form}
            setForm={setForm}
            imageFile={image}
            setImageFile={setImage}
            locked={locked}
            label={label}
          />
        )}
      </DialogContent>
      <Box
        ref={reportRef}
        aria-hidden="true"
        sx={{
          position: "fixed",
          left: "-12000px",
          top: 0,
          width: 1050,
          pointerEvents: "none"
        }}
      >
        <ExportReport
          load={load}
          culture={culture}
          variety={variety}
          tab={tab}
          original={original}
          counterproof={counterproof}
        />
      </Box>
      <DialogActions
        sx={{
          p: 1.75,
          backgroundColor: "#fff",
          justifyContent: "space-between"
        }}
      >
        <Box>
          {isSuperUser && record && tab !== "compare" && (
            <Button
              color="error"
              disabled={saving}
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={handleDelete}
              sx={{ textTransform: "none" }}
            >
              Excluir {label.toLowerCase()}
            </Button>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            color="error"
            variant="outlined"
            onClick={onClose}
            disabled={saving}
            sx={{ textTransform: "none" }}
          >
            Fechar
          </Button>
          {canExport && (
            <Button
              variant="outlined"
              disabled={saving}
              startIcon={<ImageRoundedIcon />}
              onClick={() => handleExport("image")}
              sx={{ textTransform: "none" }}
            >
              Imagem
            </Button>
          )}
          {canExport && (
            <Button
              variant="outlined"
              disabled={saving}
              startIcon={<PictureAsPdfRoundedIcon />}
              onClick={() => handleExport("pdf")}
              sx={{ textTransform: "none" }}
            >
              PDF
            </Button>
          )}
          {isSuperUser && record && locked && tab !== "compare" && (
            <Button
              variant="outlined"
              disabled={saving}
              startIcon={<EditRoundedIcon />}
              onClick={() => setEditing(true)}
              sx={{ textTransform: "none" }}
            >
              Editar {label.toLowerCase()}
            </Button>
          )}
          {!locked && tab !== "compare" && (
            <Button
              variant="contained"
              disabled={saving}
              startIcon={
                saving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <CheckCircleRoundedIcon />
                )
              }
              onClick={handleSave}
              sx={{
                backgroundColor: "#3da58a",
                textTransform: "none",
                fontWeight: 800
              }}
            >
              Salvar {label.toLowerCase()}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

const ClassificacaoCargasPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(daysAgo(6));
  const [endDate, setEndDate] = useState(today());
  const [projectsFilter, setProjectsFilter] = useState([]);
  const [ticketsFilter, setTicketsFilter] = useState([]);
  const [destinationsFilter, setDestinationsFilter] = useState([]);
  const [onlyUnclassified, setOnlyUnclassified] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);
  useEffect(() => {
    colorMode.setColorMode("light");
  }, [colorMode]);
  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setLoads(await getClassifiableTruckMoves());
    } catch (error) {
      console.error("Erro ao buscar cargas", error);
      toast.error("Não foi possível buscar as cargas.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    reload();
  }, [reload]);
  const options = (getter, numeric = false) =>
    [...new Set(loads.map(getter).filter((value) => value !== "-"))].sort(
      (a, b) => String(a).localeCompare(String(b), "pt-BR", { numeric })
    );
  const projects = useMemo(() => options(project), [loads]);
  const tickets = useMemo(() => options(ticket, true), [loads]);
  const destinations = useMemo(() => options(destination), [loads]);
  const filtered = useMemo(() => {
    const term = normalized(search);
    return loads.filter((load) => {
      const key = dateKey(loadDate(load));
      const matches =
        (!startDate || key >= startDate) &&
        (!endDate || key <= endDate) &&
        (!projectsFilter.length || projectsFilter.includes(project(load))) &&
        (!ticketsFilter.length || ticketsFilter.includes(ticket(load))) &&
        (!destinationsFilter.length ||
          destinationsFilter.includes(destination(load))) &&
        (!onlyUnclassified || !load?.classificacao?.status);
      const haystack = [load.placa, load.motorista, ticket(load), project(load)]
        .map(normalized)
        .join(" ");
      return matches && (!term || haystack.includes(term));
    });
  }, [
    loads,
    search,
    startDate,
    endDate,
    projectsFilter,
    ticketsFilter,
    destinationsFilter,
    onlyUnclassified
  ]);
  const clear = () => {
    setSearch("");
    setStartDate(daysAgo(6));
    setEndDate(today());
    setProjectsFilter([]);
    setTicketsFilter([]);
    setDestinationsFilter([]);
    setOnlyUnclassified(false);
  };
  const activeFilters =
    search ||
    projectsFilter.length ||
    ticketsFilter.length ||
    destinationsFilter.length ||
    onlyUnclassified ||
    startDate !== daysAgo(6) ||
    endDate !== today();
  const handleSaved = (classificacao) =>
    setLoads((current) =>
      current.map((load) =>
        load.id === selectedLoad?.id ? { ...load, classificacao } : load
      )
    );
  const multiSelect = (
    label,
    value,
    setValue,
    values,
    format = (item) => item
  ) => (
    <FormControl size="small" sx={{ ...selectSx, minWidth: 200 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        label={label}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", gap: 0.5, overflow: "hidden" }}>
            {selected.map((item) => (
              <Chip key={item} label={format(item)} />
            ))}
          </Box>
        )}
      >
        {values.map((item) => (
          <MenuItem key={item} value={item}>
            {format(item)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
  return (
    <Box
      width="100%"
      minHeight="100%"
      sx={{ backgroundColor: "#fff", color: "#172033", p: { xs: 0.5, sm: 1 } }}
    >
      <Box
        display="flex"
        justifyContent="center"
        p={1}
        mb={2}
        component={Paper}
        elevation={5}
        borderRadius="4px"
        sx={{ backgroundColor: colors.blueOrigin[400], color: "#fff" }}
      >
        <Typography variant="h2" sx={{ fontWeight: 800 }}>
          Classificação de Cargas
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{ textAlign: "center", color: "#475569", mb: 2 }}
      >
        Somente cargas criadas pelo Farm Truck nos últimos sete dias.
      </Typography>
      <Box display="flex" flexWrap="wrap" alignItems="center" gap={1} mb={2}>
        <TextField
          size="small"
          label="Buscar placa, motorista, ticket ou projeto"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{
            minWidth: { xs: "100%", md: 280 },
            "& .MuiInputBase-root": { height: 34, fontSize: "0.78rem" }
          }}
        />
        <TextField
          size="small"
          label="Data inicial"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ "& .MuiInputBase-root": { height: 34, fontSize: "0.78rem" } }}
        />
        <TextField
          size="small"
          label="Data final"
          type="date"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ "& .MuiInputBase-root": { height: 34, fontSize: "0.78rem" } }}
        />
        <Button
          color="warning"
          variant="outlined"
          size="small"
          onClick={() => {
            setStartDate(daysAgo(1));
            setEndDate(daysAgo(1));
          }}
        >
          Ontem
        </Button>
        <Button
          color="success"
          variant="outlined"
          size="small"
          onClick={() => {
            setStartDate(today());
            setEndDate(today());
          }}
        >
          Hoje
        </Button>
        {multiSelect(
          "Filtre por Projeto",
          projectsFilter,
          setProjectsFilter,
          projects,
          (value) => value.replace("Projeto ", "")
        )}
        {multiSelect(
          "Filtre por Ticket",
          ticketsFilter,
          setTicketsFilter,
          tickets,
          (value) => String(value).replace(/^0+/, "") || "0"
        )}
        {multiSelect(
          "Filtre por Destinatário",
          destinationsFilter,
          setDestinationsFilter,
          destinations,
          (value) => value.replace("Projeto ", "")
        )}
        <FormControlLabel
          control={
            <Switch
              checked={onlyUnclassified}
              onChange={(event) => setOnlyUnclassified(event.target.checked)}
              color="warning"
            />
          }
          label="Sem classificação"
          sx={{ whiteSpace: "nowrap", mr: 0 }}
        />
        {activeFilters && (
          <IconButton color="warning" onClick={clear}>
            <CancelIcon />
          </IconButton>
        )}
        <Tooltip title="Atualizar cargas">
          <span>
            <IconButton color="primary" onClick={reload} disabled={loading}>
              <RefreshRoundedIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <Box
        sx={{
          "--classification-table-header": colors.blueOrigin[400],
          maxHeight: "calc(100vh - 255px)",
          overflow: "auto",
          border: "1px solid #d5dce5",
          borderRadius: "4px"
        }}
      >
        <Table
          striped
          bordered
          hover
          className={styles.classificationTable}
          style={{ color: "#172033", marginBottom: 0 }}
        >
          <colgroup>
            {[
              "8.5%",
              "5.5%",
              "5%",
              "9%",
              "7%",
              "4%",
              "8%",
              "3%",
              "6%",
              "8%",
              "8%",
              "5%",
              "4.5%",
              "5%",
              "8.5%",
              "4.5%"
            ].map((width, index) => (
              <col key={index} style={{ width }} />
            ))}
          </colgroup>
          <thead
            style={{ backgroundColor: colors.blueOrigin[400], color: "#fff" }}
          >
            <tr>
              <th>Data</th>
              <th>Rom.</th>
              <th>Ticket</th>
              <th>Projeto</th>
              <th>Parcelas</th>
              <th>Cultura</th>
              <th>Variedade</th>
              <th>Obs</th>
              <th>Placa</th>
              <th>Motorista</th>
              <th>Destino</th>
              <th>Bruto</th>
              <th>Tara</th>
              <th>Líquido</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={16} style={{ textAlign: "center", padding: 18 }}>
                  <CircularProgress size={24} />
                </td>
              </tr>
            )}
            {!loading && !filtered.length && (
              <tr>
                <td colSpan={16} style={{ textAlign: "center", padding: 18 }}>
                  Nenhuma carga encontrada no período selecionado.
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((load, index) => {
                const completed = load?.classificacao?.status === "concluida";
                const counterproof =
                  load?.classificacao?.contraprova?.status === "concluida";
                const parcels = Array.isArray(load.parcelasNovas)
                  ? load.parcelasNovas.join(", ")
                  : load.parcela || "-";
                const supported = feijao(load);
                const status = counterproof
                  ? "Com contraprova"
                  : completed
                    ? "Classificada"
                    : "Pendente";
                return (
                  <tr
                    key={load.id}
                    className={index % 2 ? styles.oddRow : styles.evenRowLight}
                  >
                    <td title={dateLabel(loadDate(load), true)}>
                      {dateLabel(loadDate(load))}
                    </td>
                    <td>{romaneio(load)}</td>
                    <td>{String(ticket(load)).replace(/^0+/, "") || "0"}</td>
                    <td title={project(load)}>
                      {project(load).replace("Projeto ", "")}
                    </td>
                    <td title={parcels}>{parcels}</td>
                    <td>
                      <img
                        src={iconForCulture(load.cultura)}
                        alt={load.cultura || "cultura"}
                        style={{
                          width: 18,
                          height: 18,
                          filter: "drop-shadow(2px 3px 1px rgb(0 0 0 / 0.25))"
                        }}
                      />
                    </td>
                    <td title={load.mercadoria || "-"}>
                      {load.mercadoria || "-"}
                    </td>
                    <td>
                      {load.observacoes ? (
                        <Tooltip title={load.observacoes}>
                          <LightbulbOutlinedIcon
                            color="success"
                            fontSize="small"
                          />
                        </Tooltip>
                      ) : (
                        ""
                      )}
                    </td>
                    <td>{plate(load.placa)}</td>
                    <td title={load.motorista || "-"}>
                      {load.motorista || "-"}
                    </td>
                    <td title={destination(load)}>
                      {destination(load).replace("Projeto ", "")}
                    </td>
                    <td>{weight(load.pesoBruto)}</td>
                    <td>{weight(load.tara)}</td>
                    <td>{weight(load.liquido)}</td>
                    <td>
                      {!supported ? (
                        <Chip size="small" label="Em preparo" />
                      ) : (
                        <Chip
                          size="small"
                          color={completed ? "success" : "warning"}
                          icon={
                            completed ? (
                              <CheckCircleRoundedIcon />
                            ) : (
                              <PendingActionsRoundedIcon />
                            )
                          }
                          label={status}
                        />
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Tooltip
                        title={
                          supported
                            ? completed
                              ? "Ver classificação e contraprova"
                              : "Classificar carga"
                            : "Formulário disponível inicialmente apenas para feijão"
                        }
                      >
                        <span>
                          <IconButton
                            color={completed ? "success" : "warning"}
                            disabled={!supported}
                            onClick={() => setSelectedLoad(load)}
                          >
                            <AssignmentRoundedIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            {!loading && filtered.length > 0 && (
              <tr className={styles.tableEndSpacer}>
                <td colSpan={16} />
              </tr>
            )}
          </tbody>
        </Table>
      </Box>
      {selectedLoad && (
        <ClassificationDialog
          load={selectedLoad}
          onClose={() => setSelectedLoad(null)}
          onSaved={handleSaved}
        />
      )}
    </Box>
  );
};

export default ClassificacaoCargasPage;
