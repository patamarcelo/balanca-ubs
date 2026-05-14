import {
	Avatar,
	Box,
	Button,
	Chip,
	CircularProgress,
	Divider,
	IconButton,
	InputAdornment,
	MenuItem,
	Stack,
	TextField,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import { useMemo, useState } from "react";

import { tokens } from "../../theme";
import { sortProjects } from "./projectsCatalog";

const formatDate = (value) => {
	if (!value) return "—";

	const d = new Date(value);

	if (Number.isNaN(d.getTime())) return "—";

	return d.toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const normalizeText = (value) =>
	String(value || "")
		.trim()
		.toLowerCase();

const getProviderValue = (providerData, key) => {
	if (!Array.isArray(providerData)) return "";

	const provider = providerData.find((item) => item?.[key]);

	return provider?.[key] || "";
};

const getInitials = (name, email) => {
	const base = name || email || "?";
	const parts = base.trim().split(" ").filter(Boolean);

	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}

	return base.slice(0, 2).toUpperCase();
};

const UsersTable = ({
	users,
	actionLoadingUid = "",
	onOpenUser,
	onToggleStatus,
	onRevokeSessions,
	onCopyUid,
}) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isDark = theme.palette.mode === "dark";

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [roleFilter, setRoleFilter] = useState("all");
	const [appFilter, setAppFilter] = useState("all");
	const [unitFilter, setUnitFilter] = useState("all");

	const normalizedUsers = useMemo(() => {
		if (Array.isArray(users)) return users;
		if (users && typeof users === "object") return Object.values(users);
		return [];
	}, [users]);

	const mappedUsers = useMemo(() => {
		return normalizedUsers
			.map((u) => {
				const providerPhone = getProviderValue(u?.providerData, "phoneNumber");
				const providerEmail = getProviderValue(u?.providerData, "email");
				const providerDisplayName = getProviderValue(
					u?.providerData,
					"displayName"
				);

				const customClaims = u?.customClaims || {};
				const displayName = u.displayName || providerDisplayName || "";

				const isActive =
					customClaims.isActive !== undefined
						? !!customClaims.isActive
						: !u.disabled;

				const projetosLiberados = Array.isArray(customClaims.projetosLiberados)
					? sortProjects(customClaims.projetosLiberados)
					: [];

				return {
					original: u,
					uid: u.uid,
					displayName,
					email: u.email || providerEmail || "",
					phoneNumber: u.phoneNumber || providerPhone || "",
					disabled: !!u.disabled,
					emailVerified: !!u.emailVerified,
					admin: !!customClaims.admin,
					isActive,
					isBalanca: !!customClaims.isBalanca,
					isDefensivos: !!customClaims.isDefensivos,
					isVendas: !!customClaims.isVendas,
					unidadeOp: customClaims.unidadeOp || "",
					category: customClaims.category || "",
					lastSignInTime: u?.metadata?.lastSignInTime || "",
					creationTime: u?.metadata?.creationTime || "",
					lastRefreshTime: u?.metadata?.lastRefreshTime || "",
					tokensValidAfterTime: u?.tokensValidAfterTime || "",
					projetosLiberados,
				};
			})
			.sort((a, b) =>
				(a.displayName || a.email || "").localeCompare(
					b.displayName || b.email || ""
				)
			);
	}, [normalizedUsers]);

	const unidades = useMemo(() => {
		const values = mappedUsers
			.map((user) => user.unidadeOp)
			.filter(Boolean)
			.sort((a, b) => a.localeCompare(b));

		return [...new Set(values)];
	}, [mappedUsers]);

	const filteredUsers = useMemo(() => {
		return mappedUsers.filter((u) => {
			const term = normalizeText(search);

			if (term) {
				const haystack = normalizeText(
					[
						u.displayName,
						u.email,
						u.phoneNumber,
						u.uid,
						u.unidadeOp,
						u.category,
						...u.projetosLiberados,
					].join(" ")
				);

				if (!haystack.includes(term)) return false;
			}

			if (statusFilter === "active" && !u.isActive) return false;
			if (statusFilter === "inactive" && u.isActive) return false;

			if (roleFilter === "admin" && !u.admin) return false;
			if (roleFilter === "regular" && u.admin) return false;

			if (appFilter === "balanca" && !u.isBalanca) return false;
			if (appFilter === "defensivos" && !u.isDefensivos) return false;
			if (appFilter === "vendas" && !u.isVendas) return false;

			if (unitFilter !== "all" && u.unidadeOp !== unitFilter) return false;

			return true;
		});
	}, [mappedUsers, search, statusFilter, roleFilter, appFilter, unitFilter]);

	const inputSx = {
		"& .MuiOutlinedInput-root": {
			borderRadius: 999,
			backgroundColor: isDark ? "rgba(255,255,255,0.055)" : "#fff",
			"& fieldset": {
				borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(20,27,45,0.10)",
			},
			"&:hover fieldset": {
				borderColor: isDark ? "rgba(76,206,172,0.35)" : colors.greenAccent[300],
			},
			"&.Mui-focused fieldset": {
				borderColor: colors.greenAccent[500],
			},
		},
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: "1fr",
						md: "1.7fr 0.8fr 0.8fr 0.8fr 0.8fr",
					},
					gap: 1.25,
					mb: 2,
				}}
			>
				<TextField
					size="small"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Buscar por nome, e-mail, telefone, UID, unidade ou projeto..."
					sx={inputSx}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchRoundedIcon sx={{ opacity: 0.65 }} />
							</InputAdornment>
						),
					}}
				/>

				<TextField
					select
					size="small"
					label="Status"
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					sx={inputSx}
				>
					<MenuItem value="all">Todos</MenuItem>
					<MenuItem value="active">Ativos</MenuItem>
					<MenuItem value="inactive">Inativos</MenuItem>
				</TextField>

				<TextField
					select
					size="small"
					label="Perfil"
					value={roleFilter}
					onChange={(e) => setRoleFilter(e.target.value)}
					sx={inputSx}
				>
					<MenuItem value="all">Todos</MenuItem>
					<MenuItem value="admin">Admins</MenuItem>
					<MenuItem value="regular">Regulares</MenuItem>
				</TextField>

				<TextField
					select
					size="small"
					label="App"
					value={appFilter}
					onChange={(e) => setAppFilter(e.target.value)}
					sx={inputSx}
				>
					<MenuItem value="all">Todos</MenuItem>
					<MenuItem value="balanca">Balança</MenuItem>
					<MenuItem value="defensivos">Defensivos</MenuItem>
					<MenuItem value="vendas">Vendas</MenuItem>
				</TextField>

				<TextField
					select
					size="small"
					label="Unidade"
					value={unitFilter}
					onChange={(e) => setUnitFilter(e.target.value)}
					sx={inputSx}
				>
					<MenuItem value="all">Todas</MenuItem>
					{unidades.map((unidade) => (
						<MenuItem key={unidade} value={unidade}>
							{unidade}
						</MenuItem>
					))}
				</TextField>
			</Box>

			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 1.5,
					gap: 1,
					flexWrap: "wrap",
				}}
			>
				<Typography variant="body2" sx={{ opacity: 0.72, fontWeight: 700 }}>
					Exibindo {filteredUsers.length} de {mappedUsers.length} usuários
				</Typography>

				<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
					<CompactChip
						label="Balança"
						value={mappedUsers.filter((u) => u.isBalanca).length}
						color={colors.greenAccent[500]}
					/>
					<CompactChip
						label="Defensivos"
						value={mappedUsers.filter((u) => u.isDefensivos).length}
						color={colors.blueAccent[500]}
					/>
					<CompactChip
						label="Vendas"
						value={mappedUsers.filter((u) => u.isVendas).length}
						color={colors.pink[500]}
					/>
				</Stack>
			</Box>

			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 1.25,
					maxHeight: "calc(100vh - 320px)",
					minHeight: 420,
					overflowY: "auto",
					pr: 0.5,
				}}
			>
				{filteredUsers.map((user) => {
					const isActionLoading = actionLoadingUid === user.uid;

					return (
						<Box
							key={user.uid}
							onClick={() => onOpenUser?.(user.original)}
							sx={{
								p: 1.6,
								borderRadius: 3,
								cursor: "pointer",
								border: `1px solid ${user.isActive
									? isDark
										? "rgba(255,255,255,0.08)"
										: "rgba(20,27,45,0.08)"
									: "rgba(219,79,74,0.32)"
									}`,
								backgroundColor: isDark
									? "rgba(255,255,255,0.045)"
									: "rgba(255,255,255,0.78)",
								boxShadow: isDark
									? "0 14px 36px rgba(0,0,0,0.16)"
									: "0 14px 36px rgba(31,42,64,0.08)",
								transition: "all 0.18s ease",
								opacity: user.isActive ? 1 : 0.68,
								"&:hover": {
									transform: "translateY(-2px)",
									borderColor: colors.greenAccent[500],
									backgroundColor: isDark
										? "rgba(255,255,255,0.07)"
										: "#fff",
								},
							}}
						>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: {
										xs: "1fr",
										lg: "1.25fr 1fr 1fr auto",
									},
									gap: 1.5,
									alignItems: "center",
								}}
							>
								<Stack direction="row" spacing={1.25} alignItems="center">
									<Avatar
										sx={{
											width: 42,
											height: 42,
											fontSize: 14,
											fontWeight: 900,
											backgroundColor: user.admin
												? "rgba(104,112,250,0.18)"
												: "rgba(76,206,172,0.16)",
											color: user.admin
												? colors.blueAccent[400]
												: colors.greenAccent[400],
											border: `1px solid ${user.admin
												? "rgba(104,112,250,0.32)"
												: "rgba(76,206,172,0.28)"
												}`,
										}}
									>
										{getInitials(user.displayName, user.email)}
									</Avatar>

									<Box sx={{ minWidth: 0 }}>
										<Stack
											direction="row"
											spacing={0.8}
											alignItems="center"
											flexWrap="wrap"
											useFlexGap
										>
											<Typography
												variant="body1"
												sx={{
													fontWeight: 900,
													lineHeight: 1.1,
												}}
											>
												{user.displayName || "Sem nome"}
											</Typography>

											<StatusChip active={user.isActive} colors={colors} />

											{user.admin && (
												<Chip
													size="small"
													icon={<AdminPanelSettingsRoundedIcon />}
													label="Admin"
													sx={{
														height: 22,
														fontSize: 11,
														fontWeight: 900,
														color: colors.blueAccent[300],
														backgroundColor: "rgba(104,112,250,0.14)",
														"& .MuiChip-icon": {
															color: colors.blueAccent[300],
														},
													}}
												/>
											)}
										</Stack>

										<Typography
											variant="caption"
											sx={{
												opacity: 0.58,
												display: "block",
												mt: 0.4,
												maxWidth: 360,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{user.uid}
										</Typography>
									</Box>
								</Stack>

								<Stack spacing={0.65} sx={{ minWidth: 0 }}>
									<InfoLine icon={<EmailRoundedIcon />} text={user.email || "—"} />
									<InfoLine
										icon={<PhoneIphoneRoundedIcon />}
										text={user.phoneNumber || "—"}
									/>
								</Stack>

								<Stack spacing={0.9}>
									<Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
										<MiniPill
											icon={<BusinessRoundedIcon />}
											label={user.unidadeOp || "Sem unidade"}
										/>
										<MiniPill
											icon={<SecurityRoundedIcon />}
											label={user.category || "Sem categoria"}
										/>
									</Stack>

									<Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
										<AppBadge active={user.isBalanca} label="Balança" />
										<AppBadge active={user.isDefensivos} label="Defensivos" />
										<AppBadge active={user.isVendas} label="Vendas" />
									</Stack>
								</Stack>

								<Stack
									direction="row"
									spacing={0.75}
									alignItems="center"
									justifyContent="flex-end"
									onClick={(e) => e.stopPropagation()}
								>
									<Tooltip title="Copiar UID">
										<IconButton size="small" onClick={() => onCopyUid?.(user)}>
											<ContentCopyRoundedIcon fontSize="small" />
										</IconButton>
									</Tooltip>

									<Tooltip
										title={user.isActive ? "Desativar usuário" : "Ativar usuário"}
									>
										<span>
											<IconButton
												size="small"
												disabled={isActionLoading}
												onClick={() => onToggleStatus?.(user.original)}
												sx={{
													color: user.isActive
														? colors.redAccent[400]
														: colors.greenAccent[400],
												}}
											>
												{isActionLoading ? (
													<CircularProgress size={18} color="inherit" />
												) : user.isActive ? (
													<BlockRoundedIcon fontSize="small" />
												) : (
													<CheckCircleRoundedIcon fontSize="small" />
												)}
											</IconButton>
										</span>
									</Tooltip>

									<Tooltip title="Revogar sessões">
										<span>
											<IconButton
												size="small"
												disabled={isActionLoading}
												onClick={() => onRevokeSessions?.(user.original)}
												sx={{
													color: colors.blueAccent[400],
												}}
											>
												<LogoutRoundedIcon fontSize="small" />
											</IconButton>
										</span>
									</Tooltip>

									<Button
										size="small"
										variant="contained"
										endIcon={<MoreHorizRoundedIcon />}
										onClick={() => onOpenUser?.(user.original)}
										sx={{
											borderRadius: 999,
											textTransform: "none",
											fontWeight: 900,
											boxShadow: "none",
											backgroundColor: isDark
												? "rgba(255,255,255,0.08)"
												: colors.primary[100],
											color: isDark ? colors.grey[100] : "#fff",
											"&:hover": {
												backgroundColor: colors.greenAccent[500],
												color: colors.primary[800],
												boxShadow: "none",
											},
										}}
									>
										Gerenciar
									</Button>
								</Stack>
							</Box>

							<Divider sx={{ my: 1.3, opacity: 0.1 }} />

							<Stack
								direction={{ xs: "column", md: "row" }}
								spacing={{ xs: 0.5, md: 2 }}
								alignItems={{ xs: "flex-start", md: "center" }}
								justifyContent="space-between"
							>
								<Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
									<Typography variant="caption" sx={{ opacity: 0.62 }}>
										Criado: <strong>{formatDate(user.creationTime)}</strong>
									</Typography>

									<Typography variant="caption" sx={{ opacity: 0.62 }}>
										Último acesso:{" "}
										<strong>{formatDate(user.lastSignInTime)}</strong>
									</Typography>
								</Stack>
							</Stack>
							{user.projetosLiberados.length > 0 && (
								<Box
									sx={{
										mt: 1.2,
										p: 1.2,
										borderRadius: 2.5,
										backgroundColor: isDark
											? "rgba(255,255,255,0.035)"
											: "rgba(20,27,45,0.028)",
										border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(20,27,45,0.08)"
											}`,
									}}
								>
									<Stack
										direction="row"
										alignItems="center"
										justifyContent="space-between"
										spacing={1}
										sx={{ mb: 0.8 }}
									>
										<Typography
											variant="caption"
											sx={{
												fontWeight: 900,
												opacity: 0.76,
											}}
										>
											Projetos liberados
										</Typography>

										<Chip
											size="small"
											label={`${user.projetosLiberados.length}`}
											sx={{
												height: 20,
												fontSize: 11,
												fontWeight: 900,
												backgroundColor: "rgba(76,206,172,0.12)",
												color: colors.greenAccent[400],
											}}
										/>
									</Stack>

									<Box
										sx={{
											display: "flex",
											flexWrap: "wrap",
											gap: 0.65,
											maxHeight: 74,
											overflowY: "auto",
											pr: 0.4,
										}}
									>
										{user.projetosLiberados.map((project) => (
											<Chip
												key={`${user.uid}-${project}`}
												label={project}
												size="small"
												sx={{
													height: 22,
													fontSize: 11,
													fontWeight: 800,
													backgroundColor: isDark
														? "rgba(76,206,172,0.11)"
														: "rgba(76,206,172,0.16)",
													color: isDark
														? colors.greenAccent[400]
														: colors.greenAccent[200],
													border: `1px solid ${isDark
															? "rgba(76,206,172,0.18)"
															: "rgba(76,206,172,0.25)"
														}`,
												}}
											/>
										))}
									</Box>
								</Box>
							)}
						</Box>
					);
				})}


				{filteredUsers.length === 0 && (
					<Box
						sx={{
							borderRadius: 4,
							p: 5,
							textAlign: "center",
							border: `1px dashed ${isDark ? "rgba(255,255,255,0.14)" : "rgba(20,27,45,0.16)"
								}`,
							backgroundColor: isDark
								? "rgba(255,255,255,0.035)"
								: "rgba(255,255,255,0.75)",
						}}
					>
						<Typography variant="h5" fontWeight={900}>
							Nenhum usuário encontrado
						</Typography>

						<Typography variant="body2" sx={{ opacity: 0.65, mt: 0.7 }}>
							Ajuste os filtros ou limpe a busca para visualizar mais usuários.
						</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
};

const CompactChip = ({ label, value, color }) => (
	<Box
		sx={{
			px: 1.1,
			py: 0.65,
			borderRadius: 999,
			border: "1px solid rgba(255,255,255,0.08)",
			backgroundColor: "rgba(255,255,255,0.045)",
			display: "flex",
			gap: 0.75,
			alignItems: "center",
		}}
	>
		<Typography variant="caption" sx={{ opacity: 0.65, fontWeight: 800 }}>
			{label}
		</Typography>
		<Typography variant="caption" sx={{ color, fontWeight: 900 }}>
			{value}
		</Typography>
	</Box>
);

const StatusChip = ({ active, colors }) => (
	<Chip
		size="small"
		icon={active ? <CheckCircleRoundedIcon /> : <CancelRoundedIcon />}
		label={active ? "Ativo" : "Inativo"}
		sx={{
			height: 22,
			fontSize: 11,
			fontWeight: 900,
			color: active ? colors.greenAccent[300] : colors.redAccent[300],
			backgroundColor: active
				? "rgba(76,206,172,0.12)"
				: "rgba(219,79,74,0.12)",
			"& .MuiChip-icon": {
				color: active ? colors.greenAccent[300] : colors.redAccent[300],
			},
		}}
	/>
);

const InfoLine = ({ icon, text }) => (
	<Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
		<Box sx={{ opacity: 0.55, display: "flex", "& svg": { fontSize: 16 } }}>
			{icon}
		</Box>

		<Typography
			variant="caption"
			sx={{
				fontWeight: 700,
				opacity: 0.82,
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
			}}
		>
			{text}
		</Typography>
	</Stack>
);

const MiniPill = ({ icon, label }) => (
	<Box
		sx={{
			display: "inline-flex",
			alignItems: "center",
			gap: 0.55,
			px: 0.9,
			py: 0.45,
			borderRadius: 999,
			backgroundColor: "rgba(255,255,255,0.055)",
			border: "1px solid rgba(255,255,255,0.07)",
			maxWidth: 190,
		}}
	>
		<Box sx={{ opacity: 0.55, display: "flex", "& svg": { fontSize: 15 } }}>
			{icon}
		</Box>

		<Typography
			variant="caption"
			sx={{
				fontWeight: 800,
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
			}}
		>
			{label}
		</Typography>
	</Box>
);

const AppBadge = ({ active, label }) => (
	<Chip
		size="small"
		label={label}
		variant={active ? "filled" : "outlined"}
		sx={{
			height: 22,
			fontSize: 11,
			fontWeight: 900,
			opacity: active ? 1 : 0.45,
			backgroundColor: active ? "rgba(76,206,172,0.13)" : "transparent",
			color: active ? "#4cceac" : "inherit",
			borderColor: "rgba(255,255,255,0.12)",
		}}
	/>
);

export default UsersTable;