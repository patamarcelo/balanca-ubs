import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	FormControlLabel,
	IconButton,
	InputAdornment,
	MenuItem,
	Stack,
	Switch,
	TextField,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import FolderSharedRoundedIcon from "@mui/icons-material/FolderSharedRounded";
import { useMemo, useState } from "react";

import { tokens } from "../../theme";


import ProjectMultiSelect from "./ProjectMultiSelect";
import { sortProjects } from "./projectsCatalog";


import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";


const UNIDADES = [
	"ubs",
	"diamante",
	"ouroVerde",
	"bencaoDeDeus",
	"lagoVerde",
	"eldorado",
	"campoGuapo",
];

const CATEGORIES = ["admin", "regular", "operador", "gestor"];

const initialForm = {
	displayName: "",
	email: "",
	phoneNumber: "",
	password: "",
	emailVerified: false,
	disabled: false,
	admin: false,
	isActive: true,
	isBalanca: true,
	isDefensivos: false,
	isVendas: false,
	unidadeOp: "",
	category: "admin",
	projetosLiberados: [],
};

const normalizePhone = (value) => {
	if (!value) return "";
	return String(value).replace(/\s/g, "").replace(/-/g, "");
};



const CreateUserDialog = ({ open, onClose, onCreate, onCopyFeedback }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isDark = theme.palette.mode === "dark";

	const [form, setForm] = useState(initialForm);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(true);

	const projetos = useMemo(() => {
		return sortProjects(form.projetosLiberados);
	}, [form.projetosLiberados]);

	const handleChange = (field, value) => {
		setForm((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const resetAndClose = () => {
		setForm(initialForm);
		onClose?.();
	};

	const copyToClipboard = async (text, successMessage = "Copiado.") => {
		try {
			await navigator.clipboard.writeText(text);
			onCopyFeedback?.(successMessage, "success");
		} catch (err) {
			console.error("Erro ao copiar", err);
			onCopyFeedback?.("Não foi possível copiar.", "error");
		}
	};

	const handleCopyCredentials = async () => {
		const email = form.email.trim();
		const password = form.password;

		if (!email || !password) {
			onCopyFeedback?.("Informe e-mail e senha antes de copiar.", "warning");
			return;
		}

		const text = `Usuário: ${email}
Senha: ${password}`;

		await copyToClipboard(text, "Usuário e senha copiados.");
	};

	const handleSubmit = async () => {
		if (!form.displayName.trim()) {
			window.alert("Informe o nome do usuário.");
			return;
		}

		if (!form.email.trim()) {
			window.alert("Informe o e-mail do usuário.");
			return;
		}

		if (!form.password || form.password.length < 6) {
			window.alert("Informe uma senha com pelo menos 6 caracteres.");
			return;
		}

		const payload = {
			email: form.email.trim(),
			phoneNumber: normalizePhone(form.phoneNumber),
			password: form.password,
			displayName: form.displayName.trim(),
			emailVerified: form.emailVerified,
			disabled: form.disabled,
			customClaims: {
				admin: form.admin,
				isActive: form.isActive && !form.disabled,
				isBalanca: form.isBalanca,
				isDefensivos: form.isDefensivos,
				isVendas: form.isVendas,
				unidadeOp: form.unidadeOp,
				category: form.category,
				projetosLiberados: projetos,
			},
		};

		try {
			setIsSubmitting(true);
			await onCreate?.(payload);
			setForm(initialForm);
		} finally {
			setIsSubmitting(false);
		}
	};

	const inputSx = {
		"& .MuiOutlinedInput-root": {
			borderRadius: 2.2,
			backgroundColor: isDark ? "rgba(255,255,255,0.045)" : "#fff",
			"& fieldset": {
				borderColor: isDark ? "rgba(255,255,255,0.09)" : "rgba(20,27,45,0.12)",
			},
			"&:hover fieldset": {
				borderColor: colors.greenAccent[500],
			},
			"&.Mui-focused fieldset": {
				borderColor: colors.greenAccent[500],
			},
		},
	};

	return (
		<Dialog
			open={open}
			onClose={resetAndClose}
			fullWidth
			maxWidth="md"
			PaperProps={{
				sx: {
					borderRadius: 4,
					background:
						theme.palette.mode === "dark"
							? `linear-gradient(180deg, ${colors.primary[700]} 0%, ${colors.primary[800]} 100%)`
							: "#ffffff",
					color: "inherit",
					border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(20,27,45,0.08)"
						}`,
					boxShadow: "0 26px 80px rgba(0,0,0,0.36)",
				},
			}}
		>
			<DialogTitle
				sx={{
					p: 2.5,
					borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(20,27,45,0.08)"
						}`,
				}}
			>
				<Stack direction="row" justifyContent="space-between" spacing={2}>
					<Stack direction="row" spacing={1.4} alignItems="center">
						<Box
							sx={{
								width: 44,
								height: 44,
								borderRadius: 3,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: "rgba(76,206,172,0.14)",
								color: colors.greenAccent[400],
							}}
						>
							<PersonAddAltRoundedIcon />
						</Box>

						<Box>
							<Typography variant="h4" fontWeight={900}>
								Novo usuário
							</Typography>

							<Typography variant="caption" sx={{ opacity: 0.62 }}>
								Crie usuário no Firebase Auth já com custom claims iniciais.
							</Typography>
						</Box>
					</Stack>

					<IconButton onClick={resetAndClose}>
						<CloseRoundedIcon />
					</IconButton>
				</Stack>
			</DialogTitle>

			<DialogContent sx={{ p: 2.5 }}>
				<SectionTitle title="Dados de acesso" />

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							sm: "1fr 1fr",
						},
						gap: 1.5,
					}}
				>
					<TextField
						label="Nome"
						size="small"
						value={form.displayName}
						onChange={(e) => handleChange("displayName", e.target.value)}
						sx={inputSx}
					/>

					<TextField
						label="E-mail"
						size="small"
						value={form.email}
						onChange={(e) => handleChange("email", e.target.value)}
						sx={inputSx}
					/>

					<TextField
						label="Telefone"
						size="small"
						value={form.phoneNumber}
						onChange={(e) => handleChange("phoneNumber", e.target.value)}
						placeholder="+5563999999999"
						sx={inputSx}
					/>

					<TextField
						label="Senha inicial"
						type={showPassword ? "text" : "password"}
						size="small"
						value={form.password}
						onChange={(e) => handleChange("password", e.target.value)}
						helperText="Mínimo de 6 caracteres"
						sx={inputSx}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Tooltip title={showPassword ? "Ocultar senha" : "Mostrar senha"}>
										<IconButton
											size="small"
											onClick={() => setShowPassword((prev) => !prev)}
											edge="end"
										>
											{showPassword ? (
												<VisibilityOffRoundedIcon fontSize="small" />
											) : (
												<VisibilityRoundedIcon fontSize="small" />
											)}
										</IconButton>
									</Tooltip>
								</InputAdornment>
							),
						}}
					/>
				</Box>

				<Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.2 }}>
					<Button
						variant="outlined"
						size="small"
						startIcon={<ContentCopyRoundedIcon />}
						onClick={handleCopyCredentials}
						sx={{
							borderRadius: 999,
							textTransform: "none",
							fontWeight: 900,
							borderColor: isDark ? "rgba(255,255,255,0.16)" : "rgba(20,27,45,0.16)",
							color: "inherit",
							"&:hover": {
								borderColor: colors.greenAccent[500],
								backgroundColor: "rgba(76,206,172,0.08)",
							},
						}}
					>
						Copiar usuário e senha
					</Button>
				</Stack>
				<Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
					<FormControlLabel
						control={
							<Switch
								checked={form.emailVerified}
								onChange={(e) => handleChange("emailVerified", e.target.checked)}
								color="secondary"
							/>
						}
						label="E-mail verificado"
					/>

					<FormControlLabel
						control={
							<Switch
								checked={form.disabled}
								onChange={(e) => {
									const disabled = e.target.checked;
									handleChange("disabled", disabled);
									handleChange("isActive", !disabled);
								}}
								color="secondary"
							/>
						}
						label="Criar desativado"
					/>
				</Stack>

				<Divider sx={{ my: 2.5, opacity: 0.12 }} />

				<SectionTitle title="Permissões iniciais" />

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							sm: "1fr 1fr",
						},
						gap: 1.5,
					}}
				>
					<TextField
						select
						label="Unidade operacional"
						size="small"
						value={form.unidadeOp}
						onChange={(e) => handleChange("unidadeOp", e.target.value)}
						sx={inputSx}
					>
						<MenuItem value="">Sem unidade</MenuItem>
						{UNIDADES.map((item) => (
							<MenuItem key={item} value={item}>
								{item}
							</MenuItem>
						))}
					</TextField>

					<TextField
						select
						label="Categoria"
						size="small"
						value={form.category}
						onChange={(e) => handleChange("category", e.target.value)}
						sx={inputSx}
					>
						{CATEGORIES.map((item) => (
							<MenuItem key={item} value={item}>
								{item}
							</MenuItem>
						))}
					</TextField>
				</Box>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							sm: "1fr 1fr 1fr 1fr",
						},
						gap: 1,
						mt: 1.5,
					}}
				>
					<SwitchCard
						label="Admin"
						checked={form.admin}
						onChange={(value) => handleChange("admin", value)}
						colors={colors}
					/>

					<SwitchCard
						label="Balança"
						checked={form.isBalanca}
						onChange={(value) => handleChange("isBalanca", value)}
						colors={colors}
					/>

					<SwitchCard
						label="Defensivos"
						checked={form.isDefensivos}
						onChange={(value) => handleChange("isDefensivos", value)}
						colors={colors}
					/>

					<SwitchCard
						label="Vendas"
						checked={form.isVendas}
						onChange={(value) => handleChange("isVendas", value)}
						colors={colors}
					/>
				</Box>

				<Divider sx={{ my: 2.5, opacity: 0.12 }} />

				<SectionTitle title="Projetos liberados" />

				<ProjectMultiSelect
					value={Array.isArray(form.projetosLiberados) ? form.projetosLiberados : []}
					onChange={(projects) => handleChange("projetosLiberados", projects)}
					helperText="Selecione os projetos iniciais do usuário."
				/>

				<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.2 }}>
					<Chip
						icon={<FolderSharedRoundedIcon />}
						label={`${projetos.length} projeto(s)`}
						size="small"
						sx={{
							fontWeight: 900,
							backgroundColor: "rgba(76,206,172,0.12)",
							color: colors.greenAccent[400],
							"& .MuiChip-icon": {
								color: colors.greenAccent[400],
							},
						}}
					/>

					{projetos.slice(0, 10).map((project) => (
						<Chip
							key={project}
							label={project}
							size="small"
							sx={{
								fontWeight: 800,
								backgroundColor: "rgba(255,255,255,0.06)",
							}}
						/>
					))}

					{projetos.length > 10 && (
						<Chip label={`+${projetos.length - 10}`} size="small" />
					)}
				</Stack>

				<Stack direction="row" justifyContent="flex-end" spacing={1.2} sx={{ mt: 3 }}>
					<Button
						variant="text"
						onClick={resetAndClose}
						disabled={isSubmitting}
						sx={{
							borderRadius: 999,
							textTransform: "none",
							fontWeight: 900,
							color: "inherit",
						}}
					>
						Cancelar
					</Button>

					<Button
						variant="contained"
						startIcon={
							isSubmitting ? (
								<CircularProgress size={16} color="inherit" />
							) : (
								<SaveRoundedIcon />
							)
						}
						onClick={handleSubmit}
						disabled={isSubmitting}
						sx={{
							borderRadius: 999,
							textTransform: "none",
							fontWeight: 900,
							backgroundColor: colors.greenAccent[500],
							color: colors.primary[800],
							boxShadow: "none",
							px: 2.4,
							"&:hover": {
								backgroundColor: colors.greenAccent[400],
								boxShadow: "none",
							},
						}}
					>
						Criar usuário
					</Button>
				</Stack>
			</DialogContent>
		</Dialog>
	);
};

const SectionTitle = ({ title }) => (
	<Typography variant="h5" fontWeight={900} sx={{ mb: 1.35 }}>
		{title}
	</Typography>
);

const SwitchCard = ({ label, checked, onChange, colors }) => (
	<Box
		sx={{
			borderRadius: 2.5,
			px: 1.1,
			py: 0.9,
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			border: `1px solid ${checked ? "rgba(76,206,172,0.28)" : "rgba(255,255,255,0.08)"
				}`,
			backgroundColor: checked ? "rgba(76,206,172,0.09)" : "rgba(255,255,255,0.035)",
		}}
	>
		<Typography variant="body2" fontWeight={900}>
			{label}
		</Typography>

		<Switch
			size="small"
			checked={checked}
			onChange={(e) => onChange(e.target.checked)}
			color="secondary"
			sx={{
				"& .MuiSwitch-switchBase.Mui-checked": {
					color: colors.greenAccent[500],
				},
				"& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
					backgroundColor: colors.greenAccent[500],
				},
			}}
		/>
	</Box>
);

export default CreateUserDialog;