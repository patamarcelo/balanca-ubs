import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Divider,
	Drawer,
	FormControlLabel,
	IconButton,
	MenuItem,
	Stack,
	Switch,
	TextField,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import FolderSharedRoundedIcon from "@mui/icons-material/FolderSharedRounded";
import { useEffect, useMemo, useState } from "react";

import { tokens } from "../../theme";

import ProjectMultiSelect from "./ProjectMultiSelect";
import { sortProjects } from "./projectsCatalog";


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

const defaultForm = {
	displayName: "",
	email: "",
	phoneNumber: "",
	emailVerified: false,
	admin: false,
	isActive: true,
	isBalanca: false,
	isDefensivos: false,
	isVendas: false,
	unidadeOp: "",
	category: "admin",
	projetosLiberados: [],
	newPassword: "",
};

const normalizePhone = (value) => {
	if (!value) return "";
	return String(value).replace(/\s/g, "").replace(/-/g, "");
};


const getIsActive = (user) => {
	const claims = user?.customClaims || {};
	return claims.isActive !== undefined ? !!claims.isActive : !user?.disabled;
};

const UserDrawer = ({
	open,
	user,
	actionLoadingUid = "",
	onClose,
	onSave,
	onChangePassword,
	onToggleStatus,
	onRevokeSessions,
	onDeleteUser,
	onCopyUid,
}) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isDark = theme.palette.mode === "dark";

	const [form, setForm] = useState(defaultForm);
	const [isSaving, setIsSaving] = useState(false);
	const [passwordLoading, setPasswordLoading] = useState(false);

	const isActionLoading = user?.uid && actionLoadingUid === user.uid;

	useEffect(() => {
		if (!user) {
			setForm(defaultForm);
			return;
		}

		const claims = user.customClaims || {};

		setForm({
			displayName: user.displayName || "",
			email: user.email || "",
			phoneNumber: user.phoneNumber || "",
			emailVerified: !!user.emailVerified,
			admin: !!claims.admin,
			isActive: getIsActive(user),
			isBalanca: !!claims.isBalanca,
			isDefensivos: !!claims.isDefensivos,
			isVendas: !!claims.isVendas,
			unidadeOp: claims.unidadeOp || "",
			category: claims.category || "admin",
			projetosLiberados: sortProjects(
				Array.isArray(claims.projetosLiberados)
					? claims.projetosLiberados
					: []
			),
			newPassword: "",
		});
	}, [user]);

	const selectedProjects = useMemo(() => {
		return sortProjects(
			Array.isArray(form.projetosLiberados)
				? form.projetosLiberados
				: []
		);
	}, [form.projetosLiberados]);

	const projetosCount = selectedProjects.length;

	const handleChange = (field, value) => {
		setForm((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = async () => {
		if (!user?.uid) return;

		const userPayload = {
			displayName: form.displayName.trim(),
			email: form.email.trim(),
			phoneNumber: normalizePhone(form.phoneNumber) || null,
			emailVerified: form.emailVerified,
		};

		const customClaims = {
			admin: form.admin,
			isActive: form.isActive,
			isBalanca: form.isBalanca,
			isDefensivos: form.isDefensivos,
			isVendas: form.isVendas,
			unidadeOp: form.unidadeOp,
			category: form.category,
			projetosLiberados: selectedProjects,
		};

		try {
			setIsSaving(true);

			await onSave?.({
				uid: user.uid,
				userPayload,
				customClaims,
			});
		} finally {
			setIsSaving(false);
		}
	};

	const handlePassword = async () => {
		if (!user || !form.newPassword) return;

		if (form.newPassword.length < 6) {
			window.alert("A senha precisa ter pelo menos 6 caracteres.");
			return;
		}

		const confirmed = window.confirm(
			"Confirma a alteração da senha? As sessões antigas serão revogadas."
		);

		if (!confirmed) return;

		try {
			setPasswordLoading(true);
			await onChangePassword?.(user, form.newPassword);
			handleChange("newPassword", "");
		} finally {
			setPasswordLoading(false);
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

	if (!user) return null;

	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: {
						xs: "100%",
						sm: 620,
					},
					background:
						theme.palette.mode === "dark"
							? `linear-gradient(180deg, ${colors.primary[700]} 0%, ${colors.primary[800]} 100%)`
							: "#ffffff",
					color: "inherit",
					borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(20,27,45,0.08)"
						}`,
				},
			}}
		>
			<Box
				sx={{
					height: "100%",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Box
					sx={{
						p: 2.5,
						borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(20,27,45,0.08)"
							}`,
					}}
				>
					<Stack direction="row" justifyContent="space-between" spacing={2}>
						<Box sx={{ minWidth: 0 }}>
							<Stack direction="row" spacing={1} alignItems="center">
								<Box
									sx={{
										width: 42,
										height: 42,
										borderRadius: 3,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: form.admin
											? "rgba(104,112,250,0.16)"
											: "rgba(76,206,172,0.14)",
										color: form.admin
											? colors.blueAccent[300]
											: colors.greenAccent[400],
									}}
								>
									{form.admin ? (
										<AdminPanelSettingsRoundedIcon />
									) : (
										<SecurityRoundedIcon />
									)}
								</Box>

								<Box sx={{ minWidth: 0 }}>
									<Typography variant="h4" fontWeight={900}>
										Gerenciar usuário
									</Typography>

									<Typography
										variant="caption"
										sx={{
											opacity: 0.62,
											display: "block",
											maxWidth: 440,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
									>
										{user.uid}
									</Typography>
								</Box>
							</Stack>
						</Box>

						<IconButton onClick={onClose}>
							<CloseRoundedIcon />
						</IconButton>
					</Stack>

					<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
						<Chip
							label={form.isActive ? "Ativo" : "Inativo"}
							color={form.isActive ? "success" : "error"}
							size="small"
							sx={{ fontWeight: 900 }}
						/>

						<Chip
							label={form.admin ? "Admin" : "Regular"}
							size="small"
							sx={{
								fontWeight: 900,
								color: form.admin ? colors.blueAccent[300] : "inherit",
								backgroundColor: form.admin
									? "rgba(104,112,250,0.14)"
									: "rgba(255,255,255,0.06)",
							}}
						/>

						<Chip
							label={`${projetosCount} projeto(s)`}
							size="small"
							icon={<FolderSharedRoundedIcon />}
							sx={{
								fontWeight: 900,
								color: colors.greenAccent[400],
								backgroundColor: "rgba(76,206,172,0.12)",
								"& .MuiChip-icon": {
									color: colors.greenAccent[400],
								},
							}}
						/>
					</Stack>
				</Box>

				<Box
					sx={{
						flex: 1,
						overflowY: "auto",
						p: 2.5,
					}}
				>
					<SectionTitle title="Dados principais" subtitle="Dados do Firebase Auth." />

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
							sx={inputSx}
							helperText="Use formato +55..."
						/>

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

						<Box
							sx={{
								borderRadius: 2.2,
								border: `1px solid ${isDark ? "rgba(255,255,255,0.09)" : "rgba(20,27,45,0.12)"
									}`,
								px: 1.2,
								display: "flex",
								alignItems: "center",
							}}
						>
							<FormControlLabel
								control={
									<Switch
										checked={form.emailVerified}
										onChange={(e) =>
											handleChange("emailVerified", e.target.checked)
										}
										color="secondary"
									/>
								}
								label="E-mail verificado"
							/>
						</Box>
					</Box>

					<Divider sx={{ my: 2.5, opacity: 0.12 }} />

					<SectionTitle
						title="Permissões e aplicativos"
						subtitle="Custom claims controladas pelo painel."
					/>

					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								sm: "1fr 1fr",
							},
							gap: 1,
						}}
					>
						<SwitchCard
							label="Usuário ativo"
							description="Controla isActive e acesso geral."
							checked={form.isActive}
							onChange={(value) => handleChange("isActive", value)}
							colors={colors}
						/>

						<SwitchCard
							label="Administrador"
							description="Permissão admin nos claims."
							checked={form.admin}
							onChange={(value) => handleChange("admin", value)}
							colors={colors}
						/>

						<SwitchCard
							label="Balança"
							description="Libera acesso ao módulo Balança."
							checked={form.isBalanca}
							onChange={(value) => handleChange("isBalanca", value)}
							colors={colors}
						/>

						<SwitchCard
							label="Defensivos"
							description="Libera acesso ao módulo Defensivos."
							checked={form.isDefensivos}
							onChange={(value) => handleChange("isDefensivos", value)}
							colors={colors}
						/>

						<SwitchCard
							label="Vendas"
							description="Libera acesso ao módulo Vendas."
							checked={form.isVendas}
							onChange={(value) => handleChange("isVendas", value)}
							colors={colors}
						/>
					</Box>

					<Divider sx={{ my: 2.5, opacity: 0.12 }} />

					<SectionTitle
						title="Projetos liberados"
						subtitle="Selecione os projetos que este usuário poderá acessar."
					/>

					<ProjectMultiSelect
						value={selectedProjects}
						onChange={(projects) => handleChange("projetosLiberados", projects)}
					/>

					<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.2 }}>
						{selectedProjects.slice(0, 14).map((project) => (
							<Chip
								key={project}
								label={project}
								size="small"
								sx={{
									fontWeight: 800,
									backgroundColor: "rgba(76,206,172,0.11)",
									color: colors.greenAccent[400],
								}}
							/>
						))}

						{projetosCount > 14 && (
							<Chip
								label={`+${projetosCount - 14}`}
								size="small"
								sx={{ fontWeight: 900 }}
							/>
						)}
					</Stack>

					<Divider sx={{ my: 2.5, opacity: 0.12 }} />

					<SectionTitle
						title="Segurança"
						subtitle="Ações sensíveis do Firebase Auth."
					/>

					<Box
						sx={{
							borderRadius: 3,
							p: 1.5,
							backgroundColor: isDark
								? "rgba(255,255,255,0.04)"
								: "rgba(20,27,45,0.035)",
							border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(20,27,45,0.08)"
								}`,
						}}
					>
						<Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
							<TextField
								label="Nova senha"
								type="password"
								size="small"
								fullWidth
								value={form.newPassword}
								onChange={(e) => handleChange("newPassword", e.target.value)}
								sx={inputSx}
							/>

							<Button
								variant="outlined"
								startIcon={
									passwordLoading ? (
										<CircularProgress size={16} color="inherit" />
									) : (
										<LockResetRoundedIcon />
									)
								}
								onClick={handlePassword}
								disabled={passwordLoading || isActionLoading || !form.newPassword}
								sx={{
									borderRadius: 999,
									textTransform: "none",
									fontWeight: 900,
									whiteSpace: "nowrap",
								}}
							>
								Alterar senha
							</Button>
						</Stack>

						<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
							<Button
								variant="outlined"
								startIcon={
									form.isActive ? <BlockRoundedIcon /> : <CheckCircleRoundedIcon />
								}
								color={form.isActive ? "error" : "success"}
								onClick={() => onToggleStatus?.(user)}
								disabled={isActionLoading}
								sx={{
									borderRadius: 999,
									textTransform: "none",
									fontWeight: 900,
								}}
							>
								{form.isActive ? "Desativar" : "Ativar"}
							</Button>

							<Button
								variant="outlined"
								color="warning"
								startIcon={<LogoutRoundedIcon />}
								onClick={() => onRevokeSessions?.(user)}
								disabled={isActionLoading}
								sx={{
									borderRadius: 999,
									textTransform: "none",
									fontWeight: 900,
								}}
							>
								Revogar sessões
							</Button>

							<Button
								variant="outlined"
								color="error"
								startIcon={<DeleteOutlineRoundedIcon />}
								onClick={() => onDeleteUser?.(user)}
								disabled={isActionLoading}
								sx={{
									borderRadius: 999,
									textTransform: "none",
									fontWeight: 900,
									ml: {
										sm: "auto",
									},
								}}
							>
								Excluir
							</Button>
						</Stack>
					</Box>
				</Box>

				<Box
					sx={{
						p: 2,
						borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(20,27,45,0.08)"
							}`,
						backgroundColor: isDark ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.9)",
					}}
				>
					<Stack direction="row" justifyContent="space-between" spacing={1}>
						<Tooltip title="Copiar UID">
							<Button
								variant="outlined"
								startIcon={<ContentCopyRoundedIcon />}
								onClick={() => onCopyUid?.(user)}
								sx={{
									borderRadius: 999,
									textTransform: "none",
									fontWeight: 900,
								}}
							>
								Copiar UID
							</Button>
						</Tooltip>

						<Stack direction="row" spacing={1}>
							<Button
								variant="text"
								onClick={onClose}
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
									isSaving ? (
										<CircularProgress size={16} color="inherit" />
									) : (
										<SaveRoundedIcon />
									)
								}
								onClick={handleSave}
								disabled={isSaving || isActionLoading}
								sx={{
									borderRadius: 999,
									textTransform: "none",
									fontWeight: 900,
									backgroundColor: colors.greenAccent[500],
									color: colors.primary[800],
									boxShadow: "none",
									"&:hover": {
										backgroundColor: colors.greenAccent[400],
										boxShadow: "none",
									},
								}}
							>
								Salvar alterações
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Box>
		</Drawer>
	);
};

const SectionTitle = ({ title, subtitle }) => (
	<Box sx={{ mb: 1.35 }}>
		<Typography variant="h5" fontWeight={900}>
			{title}
		</Typography>

		<Typography variant="caption" sx={{ opacity: 0.62 }}>
			{subtitle}
		</Typography>
	</Box>
);

const SwitchCard = ({ label, description, checked, onChange, colors }) => (
	<Box
		sx={{
			borderRadius: 2.5,
			p: 1.25,
			border: `1px solid ${checked ? "rgba(76,206,172,0.26)" : "rgba(255,255,255,0.08)"
				}`,
			backgroundColor: checked ? "rgba(76,206,172,0.09)" : "rgba(255,255,255,0.035)",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 1,
		}}
	>
		<Box>
			<Typography variant="body2" fontWeight={900}>
				{label}
			</Typography>

			<Typography variant="caption" sx={{ opacity: 0.58 }}>
				{description}
			</Typography>
		</Box>

		<Switch
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

export default UserDrawer;