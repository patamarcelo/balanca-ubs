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
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
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
const metric = (value, unit = "") =>
  Number.isFinite(Number(value))
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
const numberToDigits = (value, places = DECIMALS) => {
  if (value === "" || value === null || value === undefined) return "";
  const number = Number(String(value).replace(",", "."));
  return Number.isFinite(number)
    ? String(Math.round(number * 10 ** places))
    : "";
};
const digitsToNumber = (value, places = DECIMALS) => {
  const digits = String(value || "").replace(/\D/g, "");
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
    peneiras: { ...empty(PENEIRAS), ...asDigits(PENEIRAS, data.peneiras) },
    defeitos: { ...empty(DEFEITOS), ...asDigits(DEFEITOS, data.defeitos) },
    classificacaoFinal: data.classificacaoFinal || "",
    observacoes: data.observacoes || ""
  };
};

const ShiftField = ({ value, onChange, places = DECIMALS, ...props }) => {
  const digits = String(value || "").replace(/\D/g, "");
  const padded = digits.padStart(places + 1, "0");
  const display = digits
    ? `${Number(padded.slice(0, -places))},${padded.slice(-places)}`
    : "";
  return (
    <TextField
      {...props}
      type="text"
      inputMode="numeric"
      value={display}
      onChange={(event) => {
        const next = event.target.value
          .replace(/\D/g, "")
          .replace(/^0+(?=\d)/, "");
        onChange(/^0*$/.test(next) ? "" : next);
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
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
            gap: 1.25
          }}
        >
          <TextField
            size="small"
            disabled={locked}
            label="Classificado"
            value={form.classificacaoFinal}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                classificacaoFinal: event.target.value
              }))
            }
          />
          <TextField
            size="small"
            disabled={locked}
            label="Observações"
            multiline
            minRows={2}
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
            sx={{ mt: 1.5, textTransform: "none" }}
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
    ...PENEIRAS.map((item) => [
      `${item.label} (g)`,
      item.key,
      "peneiras",
      " g"
    ]),
    ...DEFEITOS.map((item) => [`${item.label} (g)`, item.key, "defeitos", " g"])
  ];
  const row = (label, a, b) => (
    <Box
      key={label}
      sx={{
        display: "grid",
        gridTemplateColumns:
          "minmax(150px, 1fr) minmax(170px, 1fr) minmax(170px, 1fr)",
        borderBottom: "1px solid #e2e8f0"
      }}
    >
      <Typography sx={{ p: 1, fontWeight: 700, color: "#334155" }}>
        {label}
      </Typography>
      <Typography sx={{ p: 1, borderLeft: "1px solid #e2e8f0" }}>
        {a}
      </Typography>
      <Typography
        sx={{
          p: 1,
          borderLeft: "1px solid #e2e8f0",
          backgroundColor: "#f0fdf4"
        }}
      >
        {b}
      </Typography>
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
            minWidth: 520,
            border: "1px solid #e2e8f0",
            borderRadius: 1.5,
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "minmax(150px, 1fr) minmax(170px, 1fr) minmax(170px, 1fr)",
              backgroundColor: "#0e5e91",
              color: "#fff"
            }}
          >
            <Typography sx={{ p: 1, fontWeight: 800 }}>Campo</Typography>
            <Typography sx={{ p: 1, fontWeight: 800 }}>
              Classificação
            </Typography>
            <Typography sx={{ p: 1, fontWeight: 800 }}>Contraprova</Typography>
          </Box>
          {rows.map(([label, key, group, unit]) =>
            row(
              label,
              metric(valueFor(originalData, key, group), unit),
              metric(valueFor(counterData, key, group), unit)
            )
          )}
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
        </Box>
      </Paper>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2
        }}
      >
        <Photo photo={original?.foto} label="Foto da classificação" />
        <Photo photo={counterproof?.foto} label="Foto da contraprova" />
      </Box>
    </Box>
  );
};

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
      await saveTruckClassification(load.id, next);
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
  return (
    <Dialog
      open
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{ sx: { borderRadius: 2, backgroundColor: "#fff" } }}
    >
      <DialogTitle
        sx={{ color: "#fff", backgroundColor: "#0e5e91", fontWeight: 900 }}
      >
        Classificação — Feijão
      </DialogTitle>
      <DialogContent
        dividers
        sx={{ backgroundColor: "#f5f7fa", p: { xs: 1.5, sm: 2.5 } }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 1,
            mb: 2
          }}
        >
          <Info label="Data" value={dateLabel(loadDate(load), true)} />
          <Info label="Ticket" value={ticket(load)} />
          <Info label="Projeto" value={project(load)} />
          <Info label="Placa" value={plate(load.placa)} />
          <Info label="Motorista" value={load.motorista || "-"} />
          <Info label="Romaneio" value={romaneio(load)} />
        </Box>
        <Paper variant="outlined" sx={{ mb: 2, borderColor: "#d9e0e6" }}>
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 1, borderBottom: "1px solid #d9e0e6" }}
          >
            <Tab
              value="original"
              label={original ? "Classificação" : "Nova classificação"}
            />
            <Tab
              value="counterproof"
              disabled={!original}
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
          {!original && (
            <Typography
              variant="caption"
              sx={{ display: "block", p: 1.25, color: "#64748b" }}
            >
              A contraprova é liberada após salvar a classificação original.
            </Typography>
          )}
        </Paper>
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
          <Button color="inherit" onClick={onClose} disabled={saving}>
            Fechar
          </Button>
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
          overflowX: "auto",
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
