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
  TextField,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { ColorModeContext, tokens } from "../../theme";
import { selectCurrentUser } from "../../store/user/user.selector";
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

const CLASSIFICATION_DECIMAL_PLACES = 2;

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

const compactSelectSx = {
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

const emptyMeasurements = (fields) =>
  fields.reduce((accumulator, field) => {
    accumulator[field.key] = "";
    return accumulator;
  }, {});

const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const toDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (value.seconds) return new Date(value.seconds * 1000);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getLoadDate = (load) =>
  toDate(load?.appDate) || toDate(load?.createdAt) || toDate(load?.entrada);

const formatDate = (value) => {
  const date = toDate(value);
  return date ? date.toLocaleString("pt-BR") : "-";
};

const formatTableDate = (value) => {
  const date = toDate(value);
  if (!date) return "-";
  return `${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
};

const toDateKey = (value) => {
  const date = toDate(value);
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const todayKey = () => toDateKey(new Date());

const daysAgoKey = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toDateKey(date);
};

const getTicket = (load) => load?.ticket || load?.codTicketPro || "-";
const getProject = (load) => load?.projeto || load?.fazendaOrigem || "-";
const getDestination = (load) => load?.fazendaDestino || load?.destino || "-";
const isFeijao = (load) => normalizeText(load?.cultura).includes("feijao");

const formatWeight = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0
    ? number.toLocaleString("pt-BR")
    : "-";
};

const formatPercent = (value) => {
  const number = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(number) && number > 0
    ? `${number.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })} %`
    : "-";
};

const formatPlate = (plate) => {
  const value = String(plate || "").toUpperCase();
  return value.length > 3
    ? `${value.slice(0, 3)}-${value.slice(3)}`
    : value || "-";
};

const getClassificationPhotoUrl = (photo) => {
  if (typeof photo === "string") return photo;
  return photo?.url || photo?.downloadURL || "";
};

const cultureIcon = (culture) => {
  const normalized = normalizeText(culture);
  if (normalized.includes("feijao")) return beans;
  if (normalized.includes("soja")) return soy;
  if (normalized.includes("arroz")) return rice;
  if (normalized.includes("milho")) return corn;
  return question;
};

const numberToDigits = (
  value,
  decimalPlaces = CLASSIFICATION_DECIMAL_PLACES
) => {
  if (value === "" || value === null || value === undefined) return "";
  const number = Number(String(value).replace(",", "."));
  if (!Number.isFinite(number)) return "";
  return String(Math.round(number * 10 ** decimalPlaces));
};

const digitsToNumber = (
  value,
  decimalPlaces = CLASSIFICATION_DECIMAL_PLACES
) => {
  if (value === "" || value === null || value === undefined) return null;
  const digits = String(value).replace(/\D/g, "");
  return digits ? Number(digits) / 10 ** decimalPlaces : null;
};

const numericMap = (values) =>
  Object.entries(values).reduce((accumulator, [key, value]) => {
    accumulator[key] = digitsToNumber(value);
    return accumulator;
  }, {});

const mapToDigits = (fields, values = {}) =>
  fields.reduce((accumulator, field) => {
    accumulator[field.key] = numberToDigits(values[field.key]);
    return accumulator;
  }, {});

const createForm = (load) => {
  const saved = load?.classificacao?.dados || {};
  return {
    pesoAmostraGramas: numberToDigits(saved.pesoAmostraGramas),
    umidadePercentual: numberToDigits(saved.umidadePercentual),
    impurezasPercentual: numberToDigits(saved.impurezasPercentual),
    peneiras: {
      ...emptyMeasurements(PENEIRAS),
      ...mapToDigits(PENEIRAS, saved.peneiras)
    },
    defeitos: {
      ...emptyMeasurements(DEFEITOS),
      ...mapToDigits(DEFEITOS, saved.defeitos)
    },
    classificacaoFinal: saved.classificacaoFinal || "",
    observacoes: saved.observacoes || ""
  };
};

const DecimalShiftField = ({
  label,
  value,
  onChange,
  decimalPlaces = CLASSIFICATION_DECIMAL_PLACES,
  ...props
}) => {
  const digits = String(value || "").replace(/\D/g, "");
  const padded = digits.padStart(decimalPlaces + 1, "0");
  const displayValue = digits
    ? `${Number(padded.slice(0, -decimalPlaces))},${padded.slice(-decimalPlaces)}`
    : "";

  return (
    <TextField
      {...props}
      label={label}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={(event) => {
        const nextDigits = event.target.value
          .replace(/\D/g, "")
          .replace(/^0+(?=\d)/, "");
        onChange(/^0*$/.test(nextDigits) ? "" : nextDigits);
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

const FormSection = ({ title, fields, values, onChange }) => (
  <Paper
    variant="outlined"
    sx={{ mt: 2.25, p: 2, borderColor: "#d9e0e6", backgroundColor: "#fff" }}
  >
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
        <DecimalShiftField
          key={field.key}
          size="small"
          label={`${field.label} (g)`}
          value={values[field.key]}
          onChange={(value) => onChange(field.key, value)}
        />
      ))}
    </Box>
  </Paper>
);

const ClassificationDialog = ({ load, onClose, onSaved }) => {
  const user = useSelector(selectCurrentUser);
  const [form, setForm] = useState(() => createForm(load));
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const existingClassification = load?.classificacao;
  const existingPhotoUrl = getClassificationPhotoUrl(
    existingClassification?.foto
  );

  const updateMeasurement = (group, key, value) => {
    setForm((previous) => ({
      ...previous,
      [group]: { ...previous[group], [key]: value }
    }));
  };

  const handleSave = async () => {
    const pesoAmostraGramas = digitsToNumber(form.pesoAmostraGramas);
    if (!pesoAmostraGramas || pesoAmostraGramas <= 0) {
      toast.error("Informe o peso da amostra para salvar a classificação.");
      return;
    }

    setSaving(true);
    try {
      let foto = existingClassification?.foto || null;
      if (imageFile)
        foto = await uploadTruckClassificationImage(load.id, imageFile);

      const classification = {
        schemaVersion: 1,
        status: "concluida",
        cultura: "feijao",
        createdAt: existingClassification?.createdAt,
        createdBy: existingClassification?.createdBy || {
          uid: user?.uid || "",
          email: user?.email || ""
        },
        updatedBy: { uid: user?.uid || "", email: user?.email || "" },
        foto,
        dados: {
          pesoAmostraGramas,
          umidadePercentual: digitsToNumber(form.umidadePercentual),
          impurezasPercentual: digitsToNumber(form.impurezasPercentual),
          peneiras: numericMap(form.peneiras),
          defeitos: numericMap(form.defeitos),
          classificacaoFinal: form.classificacaoFinal.trim(),
          observacoes: form.observacoes.trim()
        }
      };

      await saveTruckClassification(load.id, classification);
      toast.success("Classificação salva com sucesso.");
      onSaved({
        ...classification,
        createdAt: existingClassification?.createdAt || new Date(),
        updatedAt: new Date()
      });
      onClose();
    } catch (error) {
      console.error("Erro ao salvar classificação", error);
      toast.error(error?.message || "Não foi possível salvar a classificação.");
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
          <Info label="Data" value={formatDate(getLoadDate(load))} />
          <Info label="Ticket" value={getTicket(load)} />
          <Info label="Projeto" value={getProject(load)} />
          <Info label="Placa" value={formatPlate(load.placa)} />
          <Info label="Motorista" value={load.motorista || "-"} />
          <Info label="Romaneio" value={load.relatorioColheita || "-"} />
        </Box>
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
            <DecimalShiftField
              required
              size="small"
              label="Peso da amostra (g)"
              value={form.pesoAmostraGramas}
              onChange={(value) =>
                setForm((previous) => ({
                  ...previous,
                  pesoAmostraGramas: value
                }))
              }
            />
            <DecimalShiftField
              size="small"
              label="Umidade (%)"
              value={form.umidadePercentual}
              onChange={(value) =>
                setForm((previous) => ({
                  ...previous,
                  umidadePercentual: value
                }))
              }
            />
            <DecimalShiftField
              size="small"
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
        <FormSection
          title="Peneiras"
          fields={PENEIRAS}
          values={form.peneiras}
          onChange={(key, value) => updateMeasurement("peneiras", key, value)}
        />
        <FormSection
          title="Defeitos"
          fields={DEFEITOS}
          values={form.defeitos}
          onChange={(key, value) => updateMeasurement("defeitos", key, value)}
        />
        <Paper
          variant="outlined"
          sx={{ mt: 2.25, p: 2, borderColor: "#d9e0e6" }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
              gap: 1.25
            }}
          >
            <TextField
              size="small"
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
              label="Observações"
              value={form.observacoes}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  observacoes: event.target.value
                }))
              }
              multiline
              minRows={2}
            />
          </Box>
          <Button
            component="label"
            variant="outlined"
            startIcon={<PhotoCameraRoundedIcon />}
            sx={{ mt: 1.5, textTransform: "none" }}
          >
            {imageFile
              ? imageFile.name
              : existingClassification?.foto
                ? "Substituir foto da classificação"
                : "Adicionar foto da classificação"}
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(event) =>
                setImageFile(event.target.files?.[0] || null)
              }
            />
          </Button>
          {existingPhotoUrl && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                fontWeight={800}
                sx={{ color: "#0e5e91", mb: 0.75 }}
              >
                Foto da classificação atual
              </Typography>
              <Box
                component="a"
                href={existingPhotoUrl}
                target="_blank"
                rel="noreferrer"
                sx={{
                  display: "inline-flex",
                  border: "1px solid #d9e0e6",
                  borderRadius: 1.5,
                  overflow: "hidden",
                  backgroundColor: "#f8fafc"
                }}
              >
                <Box
                  component="img"
                  src={existingPhotoUrl}
                  alt="Foto da classificação"
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
          )}
        </Paper>
      </DialogContent>
      <DialogActions sx={{ p: 1.75, backgroundColor: "#fff" }}>
        <Button color="inherit" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={
            saving ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <CheckCircleRoundedIcon />
            )
          }
          sx={{
            backgroundColor: "#3da58a",
            textTransform: "none",
            fontWeight: 800
          }}
        >
          Salvar classificação
        </Button>
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
  const [startDate, setStartDate] = useState(daysAgoKey(6));
  const [endDate, setEndDate] = useState(todayKey());
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [classificationFilter, setClassificationFilter] = useState("todos");
  const [selectedLoad, setSelectedLoad] = useState(null);

  useEffect(() => {
    colorMode.setColorMode("light");
  }, [colorMode]);

  const loadData = useCallback(async () => {
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
    loadData();
  }, [loadData]);

  const projects = useMemo(
    () =>
      [...new Set(loads.map(getProject).filter((item) => item !== "-"))].sort(
        (a, b) => a.localeCompare(b, "pt-BR")
      ),
    [loads]
  );
  const tickets = useMemo(
    () =>
      [...new Set(loads.map(getTicket).filter((item) => item !== "-"))].sort(
        (a, b) => String(a).localeCompare(String(b), "pt-BR", { numeric: true })
      ),
    [loads]
  );
  const destinations = useMemo(
    () =>
      [
        ...new Set(loads.map(getDestination).filter((item) => item !== "-"))
      ].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [loads]
  );

  const filteredLoads = useMemo(() => {
    const normalizedSearch = normalizeText(search);
    return loads.filter((load) => {
      const loadDate = toDateKey(getLoadDate(load));
      const matchesDate =
        (!startDate || loadDate >= startDate) &&
        (!endDate || loadDate <= endDate);
      const matchesProject =
        !selectedProjects.length || selectedProjects.includes(getProject(load));
      const matchesTicket =
        !selectedTickets.length || selectedTickets.includes(getTicket(load));
      const matchesDestination =
        !selectedDestinations.length ||
        selectedDestinations.includes(getDestination(load));
      const matchesClassification =
        classificationFilter !== "sem" || !load?.classificacao?.status;
      const searchable = [
        load.placa,
        load.motorista,
        getTicket(load),
        getProject(load)
      ]
        .map(normalizeText)
        .join(" ");
      return (
        matchesDate &&
        matchesProject &&
        matchesTicket &&
        matchesDestination &&
        matchesClassification &&
        (!normalizedSearch || searchable.includes(normalizedSearch))
      );
    });
  }, [
    loads,
    search,
    startDate,
    endDate,
    selectedProjects,
    selectedTickets,
    selectedDestinations,
    classificationFilter
  ]);

  const clearFilters = () => {
    setSearch("");
    setStartDate(daysAgoKey(6));
    setEndDate(todayKey());
    setSelectedProjects([]);
    setSelectedTickets([]);
    setSelectedDestinations([]);
    setClassificationFilter("todos");
  };

  const filtersActive =
    search ||
    selectedProjects.length ||
    selectedTickets.length ||
    selectedDestinations.length ||
    classificationFilter !== "todos" ||
    startDate !== daysAgoKey(6) ||
    endDate !== todayKey();

  const handleSaved = (classificacao) => {
    setLoads((previous) =>
      previous.map((load) =>
        load.id === selectedLoad?.id ? { ...load, classificacao } : load
      )
    );
  };

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
            setStartDate(daysAgoKey(1));
            setEndDate(daysAgoKey(1));
          }}
        >
          Ontem
        </Button>
        <Button
          color="success"
          variant="outlined"
          size="small"
          onClick={() => {
            setStartDate(todayKey());
            setEndDate(todayKey());
          }}
        >
          Hoje
        </Button>
        <FormControl size="small" sx={{ ...compactSelectSx, minWidth: 200 }}>
          <InputLabel>Filtre por Projeto</InputLabel>
          <Select
            multiple
            label="Filtre por Projeto"
            value={selectedProjects}
            onChange={(event) => setSelectedProjects(event.target.value)}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", gap: 0.5, overflow: "hidden" }}>
                {selected.map((value) => (
                  <Chip key={value} label={value.replace("Projeto ", "")} />
                ))}
              </Box>
            )}
          >
            {projects.map((option) => (
              <MenuItem key={option} value={option}>
                {option.replace("Projeto ", "")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ ...compactSelectSx, minWidth: 180 }}>
          <InputLabel>Filtre por Ticket</InputLabel>
          <Select
            multiple
            label="Filtre por Ticket"
            value={selectedTickets}
            onChange={(event) => setSelectedTickets(event.target.value)}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", gap: 0.5, overflow: "hidden" }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={String(value).replace(/^0+/, "") || "0"}
                  />
                ))}
              </Box>
            )}
          >
            {tickets.map((option) => (
              <MenuItem key={option} value={option}>
                {String(option).replace(/^0+/, "") || "0"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ ...compactSelectSx, minWidth: 210 }}>
          <InputLabel>Filtre por Destinatário</InputLabel>
          <Select
            multiple
            label="Filtre por Destinatário"
            value={selectedDestinations}
            onChange={(event) => setSelectedDestinations(event.target.value)}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", gap: 0.5, overflow: "hidden" }}>
                {selected.map((value) => (
                  <Chip key={value} label={value.replace("Projeto ", "")} />
                ))}
              </Box>
            )}
          >
            {destinations.map((option) => (
              <MenuItem key={option} value={option}>
                {option.replace("Projeto ", "")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={classificationFilter === "sem"}
              onChange={(event) =>
                setClassificationFilter(event.target.checked ? "sem" : "todos")
              }
              color="warning"
            />
          }
          label="Sem classificação"
          sx={{ whiteSpace: "nowrap", mr: 0 }}
        />
        {filtersActive && (
          <IconButton color="warning" onClick={clearFilters}>
            <CancelIcon />
          </IconButton>
        )}
        <Tooltip title="Atualizar cargas">
          <span>
            <IconButton color="primary" onClick={loadData} disabled={loading}>
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
            <col style={{ width: "8.5%" }} />
            <col style={{ width: "5.5%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "7%" }} />
            <col style={{ width: "4%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "3%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "4.5%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "8.5%" }} />
            <col style={{ width: "4.5%" }} />
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
            {!loading && filteredLoads.length === 0 && (
              <tr>
                <td colSpan={16} style={{ textAlign: "center", padding: 18 }}>
                  Nenhuma carga encontrada no período selecionado.
                </td>
              </tr>
            )}
            {!loading &&
              filteredLoads.map((load, index) => {
                const completed = load?.classificacao?.status === "concluida";
                const supported = isFeijao(load);
                const parcels = Array.isArray(load.parcelasNovas)
                  ? load.parcelasNovas.join(", ")
                  : load.parcela || "-";
                return (
                  <tr
                    key={load.id}
                    className={`${index % 2 ? styles.oddRow : styles.evenRowLight}`}
                  >
                    <td title={formatDate(getLoadDate(load))}>
                      {formatTableDate(getLoadDate(load))}
                    </td>
                    <td>{load.relatorioColheita || "-"}</td>
                    <td>{String(getTicket(load)).replace(/^0+/, "") || "0"}</td>
                    <td title={getProject(load)}>
                      {getProject(load).replace("Projeto ", "")}
                    </td>
                    <td title={parcels}>{parcels}</td>
                    <td>
                      <img
                        src={cultureIcon(load.cultura)}
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
                    <td>{formatPlate(load.placa)}</td>
                    <td title={load.motorista || "-"}>
                      {load.motorista || "-"}
                    </td>
                    <td title={getDestination(load)}>
                      {getDestination(load).replace("Projeto ", "")}
                    </td>
                    <td>{formatWeight(load.pesoBruto)}</td>
                    <td>{formatWeight(load.tara)}</td>
                    <td>{formatWeight(load.liquido)}</td>
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
                          label={completed ? "Classificada" : "Pendente"}
                        />
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Tooltip
                        title={
                          supported
                            ? completed
                              ? "Editar classificação"
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
