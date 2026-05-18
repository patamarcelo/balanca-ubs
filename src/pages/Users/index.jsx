import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Snackbar,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import { useCallback, useEffect, useMemo, useState } from "react";

import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AgricultureRoundedIcon from "@mui/icons-material/AgricultureRounded";


import UsersTable from "../../components/users";
import UserDrawer from "../../components/users/UserDrawer";
import CreateUserDialog from "../../components/users/CreateUserDialog";
import { tokens } from "../../theme";

import {
	getAllUsers,
	createUser,
	updateUser,
	updateUserClaims,
	setUserDisabled,
	revokeUserSessions,
	updateUserPassword,
	deleteUser,
} from "../../services/usersApi";

const FARM_TRUCK_LINKS_TEXT = `LINKS APPS:

Farm Truck:

IOS:
https://testflight.apple.com/join/nvzsTk5K

Android:
https://play.google.com/store/apps/details?id=com.patamarcelo.farmtruck`;

const FARM_APLICACOES_LINKS_TEXT = `LINKS APPS:

Farm Aplicações:

IOS:
https://testflight.apple.com/join/5yrl2KYq

Android:
https://play.google.com/store/apps/details?id=com.patamarcelo.fetchapp`;

const UsersPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [isLoading, setIsLoading] = useState(false);
	const [actionLoadingUid, setActionLoadingUid] = useState("");
	const [usersArr, setUsersArr] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [error, setError] = useState("");

	const [toast, setToast] = useState({
		open: false,
		severity: "success",
		message: "",
	});

	const showToast = useCallback((message, severity = "success") => {
		setToast({
			open: true,
			severity,
			message,
		});
	}, []);

	const closeToast = () => {
		setToast((prev) => ({
			...prev,
			open: false,
		}));
	};

	const loadUsers = useCallback(async () => {
		try {
			setIsLoading(true);
			setError("");

			const response = await getAllUsers();

			if (!response?.success) {
				throw new Error(response?.message || "Erro ao buscar usuários.");
			}

			setUsersArr(response.data || []);
		} catch (err) {
			console.error("Erro ao buscar usuários", err);
			setError(err?.message || "Erro ao buscar usuários.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	const updateUserInState = useCallback((updatedUser) => {
		if (!updatedUser?.uid) return;

		setUsersArr((prev) =>
			prev.map((user) => {
				if (user.uid !== updatedUser.uid) return user;
				return updatedUser;
			})
		);

		setSelectedUser((prev) => {
			if (!prev || prev.uid !== updatedUser.uid) return prev;
			return updatedUser;
		});
	}, []);

	const removeUserFromState = useCallback((uid) => {
		setUsersArr((prev) => prev.filter((user) => user.uid !== uid));
		setSelectedUser(null);
		setDrawerOpen(false);
	}, []);

	const handleOpenUser = (user) => {
		setSelectedUser(user);
		setDrawerOpen(true);
	};

	const handleCloseDrawer = () => {
		setDrawerOpen(false);
	};

	const handleCreateUser = async (payload) => {
		try {
			const response = await createUser(payload);

			if (!response?.success) {
				throw new Error(response?.message || "Erro ao criar usuário.");
			}

			setUsersArr((prev) => [response.data, ...prev]);
			setCreateDialogOpen(false);
			showToast("Usuário criado com sucesso.");
		} catch (err) {
			console.error("Erro ao criar usuário", err);
			showToast(err?.message || "Erro ao criar usuário.", "error");
			throw err;
		}
	};

	const handleSaveUser = async ({ uid, userPayload, customClaims }) => {
		if (!uid) return;

		try {
			setActionLoadingUid(uid);

			let latestUser = null;

			if (userPayload && Object.keys(userPayload).length > 0) {
				const userResponse = await updateUser(uid, userPayload);

				if (!userResponse?.success) {
					throw new Error(
						userResponse?.message || "Erro ao atualizar dados do usuário."
					);
				}

				latestUser = userResponse.data;
			}

			if (customClaims && Object.keys(customClaims).length > 0) {
				const claimsResponse = await updateUserClaims(uid, customClaims, false);

				if (!claimsResponse?.success) {
					throw new Error(
						claimsResponse?.message || "Erro ao atualizar permissões."
					);
				}

				latestUser = claimsResponse.data;
			}

			if (latestUser) {
				updateUserInState(latestUser);
			}

			showToast("Usuário atualizado com sucesso.");
		} catch (err) {
			console.error("Erro ao salvar usuário", err);
			showToast(err?.message || "Erro ao salvar usuário.", "error");
			throw err;
		} finally {
			setActionLoadingUid("");
		}
	};

	const handleToggleStatus = async (user) => {
		if (!user?.uid) return;

		const userName = user.displayName || user.email || "este usuário";
		const currentClaims = user.customClaims || {};
		const isActive =
			currentClaims.isActive !== undefined ? currentClaims.isActive : !user.disabled;
		const willDisable = isActive;

		const confirmed = window.confirm(
			willDisable
				? `Deseja desativar ${userName}? O acesso será bloqueado.`
				: `Deseja ativar ${userName}? O acesso será liberado.`
		);

		if (!confirmed) return;

		try {
			setActionLoadingUid(user.uid);

			const response = await setUserDisabled(user.uid, willDisable);

			if (!response?.success) {
				throw new Error(response?.message || "Erro ao alterar status.");
			}

			updateUserInState(response.data);

			showToast(
				willDisable
					? "Usuário desativado com sucesso."
					: "Usuário ativado com sucesso."
			);
		} catch (err) {
			console.error("Erro ao alterar status", err);
			showToast(err?.message || "Erro ao alterar status.", "error");
		} finally {
			setActionLoadingUid("");
		}
	};

	const handleRevokeSessions = async (user) => {
		if (!user?.uid) return;

		const userName = user.displayName || user.email || "este usuário";

		const confirmed = window.confirm(
			`Deseja revogar as sessões de ${userName}? Ele precisará fazer login novamente.`
		);

		if (!confirmed) return;

		try {
			setActionLoadingUid(user.uid);

			const response = await revokeUserSessions(user.uid);

			if (!response?.success) {
				throw new Error(response?.message || "Erro ao revogar sessões.");
			}

			updateUserInState(response.data);
			showToast("Sessões revogadas com sucesso.");
		} catch (err) {
			console.error("Erro ao revogar sessões", err);
			showToast(err?.message || "Erro ao revogar sessões.", "error");
		} finally {
			setActionLoadingUid("");
		}
	};

	const handleChangePassword = async (user, password) => {
		if (!user?.uid || !password) return;

		try {
			setActionLoadingUid(user.uid);

			const response = await updateUserPassword(user.uid, password);

			if (!response?.success) {
				throw new Error(response?.message || "Erro ao alterar senha.");
			}

			showToast("Senha alterada com sucesso.");
		} catch (err) {
			console.error("Erro ao alterar senha", err);
			showToast(err?.message || "Erro ao alterar senha.", "error");
			throw err;
		} finally {
			setActionLoadingUid("");
		}
	};

	const handleDeleteUser = async (user) => {
		if (!user?.uid) return;

		const userName = user.displayName || user.email || "este usuário";

		const confirmed = window.confirm(
			`Tem certeza que deseja excluir ${userName}? Essa ação remove o usuário do Firebase Auth.`
		);

		if (!confirmed) return;

		try {
			setActionLoadingUid(user.uid);

			const response = await deleteUser(user.uid);

			if (!response?.success) {
				throw new Error(response?.message || "Erro ao excluir usuário.");
			}

			removeUserFromState(user.uid);
			showToast("Usuário excluído com sucesso.");
		} catch (err) {
			console.error("Erro ao excluir usuário", err);
			showToast(err?.message || "Erro ao excluir usuário.", "error");
		} finally {
			setActionLoadingUid("");
		}
	};

	const handleCopyUid = async (user) => {
		if (!user?.uid) return;

		try {
			await navigator.clipboard.writeText(user.uid);
			showToast("UID copiado.");
		} catch (err) {
			console.error("Erro ao copiar UID", err);
			showToast("Não foi possível copiar o UID.", "error");
		}
	};

	const handleCopyText = async (text, successMessage) => {
		try {
			await navigator.clipboard.writeText(text);
			showToast(successMessage);
		} catch (err) {
			console.error("Erro ao copiar texto", err);
			showToast("Não foi possível copiar.", "error");
		}
	};

	const pageStats = useMemo(() => {
		const total = usersArr.length;
		const active = usersArr.filter((user) => {
			const claims = user.customClaims || {};
			return claims.isActive !== undefined ? claims.isActive : !user.disabled;
		}).length;
		const admins = usersArr.filter((user) => !!user?.customClaims?.admin).length;

		return {
			total,
			active,
			inactive: total - active,
			admins,
		};
	}, [usersArr]);

	if (isLoading && usersArr.length === 0) {
		return (
			<Box
				sx={{
					width: "100%",
					minHeight: "72vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background:
						theme.palette.mode === "dark"
							? `linear-gradient(135deg, ${colors.primary[700]}, ${colors.primary[800]})`
							: colors.blueOrigin[700],
				}}
			>
				<CircularProgress color="secondary" />
			</Box>
		);
	}

	return (
		<Box
			sx={{
				width: "100%",
				minHeight: "calc(100vh - 64px)",
				// p: 2.5,
				background:
					theme.palette.mode === "dark"
						? `radial-gradient(circle at top left, ${colors.blueOrigin[900]} 0%, ${colors.primary[700]} 34%, ${colors.primary[800]} 100%)`
						: `linear-gradient(135deg, ${colors.blueOrigin[700]} 0%, #ffffff 100%)`,
			}}
		>
			<Box
				sx={{
					// borderRadius: 4,
					border: `1px solid ${theme.palette.mode === "dark"
						? "rgba(255,255,255,0.08)"
						: "rgba(20,27,45,0.08)"
						}`,
					backgroundColor:
						theme.palette.mode === "dark"
							? "rgba(8,11,18,0.74)"
							: "rgba(255,255,255,0.84)",
					backdropFilter: "blur(18px)",
					boxShadow:
						theme.palette.mode === "dark"
							? "0 24px 70px rgba(0,0,0,0.32)"
							: "0 24px 70px rgba(31,42,64,0.12)",
					overflow: "hidden",
				}}
			>
				<Box
					sx={{
						p: 3,
						borderBottom: `1px solid ${theme.palette.mode === "dark"
							? "rgba(255,255,255,0.08)"
							: "rgba(20,27,45,0.08)"
							}`,
					}}
				>
					<Stack
						direction={{ xs: "column", md: "row" }}
						alignItems={{ xs: "flex-start", md: "center" }}
						justifyContent="space-between"
						spacing={2}
					>
						<Stack direction="row" spacing={1.5} alignItems="center">
							<Box
								sx={{
									width: 46,
									height: 46,
									borderRadius: 3,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									backgroundColor:
										theme.palette.mode === "dark"
											? "rgba(76,206,172,0.14)"
											: colors.greenAccent[900],
									color:
										theme.palette.mode === "dark"
											? colors.greenAccent[400]
											: colors.greenAccent[200],
								}}
							>
								<ManageAccountsRoundedIcon />
							</Box>

							<Box>
								<Typography variant="h3" fontWeight={900}>
									Gerenciamento de Usuários
								</Typography>

								<Typography
									variant="body2"
									sx={{
										opacity: 0.68,
										mt: 0.4,
										maxWidth: 760,
									}}
								>
									Controle usuários Firebase, custom claims, apps liberados,
									projetos, status de acesso, senha e sessões.
								</Typography>
							</Box>
						</Stack>

						<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
							<Button
								variant="outlined"
								startIcon={<LocalShippingRoundedIcon />}
								onClick={() =>
									handleCopyText(FARM_TRUCK_LINKS_TEXT, "Links do Farm Truck copiados.")
								}
								sx={{
									borderRadius: 999,
									textTransform: "none",
									fontWeight: 800,
									px: 2,
									borderColor:
										theme.palette.mode === "dark"
											? "rgba(255,255,255,0.16)"
											: "rgba(20,27,45,0.16)",
									color: "inherit",
									"&:hover": {
										borderColor: colors.greenAccent[500],
										backgroundColor: "rgba(76,206,172,0.08)",
									},
								}}
							>
								Farm Truck
							</Button>

							<Button
								variant="outlined"
								startIcon={<AgricultureRoundedIcon />}
								onClick={() =>
									handleCopyText(
										FARM_APLICACOES_LINKS_TEXT,
										"Links do Farm Aplicações copiados."
									)
								}
								sx={{
									borderRadius: 999,
									textTransform: "none",
									fontWeight: 800,
									px: 2,
									borderColor:
										theme.palette.mode === "dark"
											? "rgba(255,255,255,0.16)"
											: "rgba(20,27,45,0.16)",
									color: "inherit",
									"&:hover": {
										borderColor: colors.greenAccent[500],
										backgroundColor: "rgba(76,206,172,0.08)",
									},
								}}
							>
								Farm Aplicações
							</Button>
							<Button
								variant="outlined"
								startIcon={<RefreshRoundedIcon />}
								onClick={loadUsers}
								disabled={isLoading}
								sx={{
									borderRadius: 999,
									textTransform: "none",
									fontWeight: 800,
									px: 2,
									borderColor:
										theme.palette.mode === "dark"
											? "rgba(255,255,255,0.16)"
											: "rgba(20,27,45,0.16)",
									color: "inherit",
								}}
							>
								Atualizar
							</Button>

							<Button
								variant="contained"
								startIcon={<PersonAddAltRoundedIcon />}
								onClick={() => setCreateDialogOpen(true)}
								sx={{
									borderRadius: 999,
									textTransform: "none",
									fontWeight: 900,
									px: 2.2,
									backgroundColor: colors.greenAccent[500],
									color: colors.primary[800],
									boxShadow: "none",
									"&:hover": {
										backgroundColor: colors.greenAccent[400],
										boxShadow: "0 14px 30px rgba(76,206,172,0.18)",
									},
								}}
							>
								Novo usuário
							</Button>
						</Stack>
					</Stack>

					<Stack
						direction="row"
						spacing={1}
						flexWrap="wrap"
						useFlexGap
						sx={{ mt: 2.5 }}
					>
						<StatPill label="Total" value={pageStats.total} colors={colors} />
						<StatPill
							label="Ativos"
							value={pageStats.active}
							colors={colors}
							tone="success"
						/>
						<StatPill
							label="Inativos"
							value={pageStats.inactive}
							colors={colors}
							tone="danger"
						/>
						<StatPill
							label="Admins"
							value={pageStats.admins}
							colors={colors}
							tone="info"
						/>
					</Stack>
				</Box>

				{error && (
					<Box sx={{ px: 3, pt: 2 }}>
						<Alert severity="error">{error}</Alert>
					</Box>
				)}

				{isLoading && usersArr.length > 0 && (
					<Box sx={{ px: 3, pt: 2 }}>
						<Alert severity="info">Atualizando lista de usuários...</Alert>
					</Box>
				)}

				<Box sx={{ p: 3, pt: error || isLoading ? 2 : 3 }}>
					<UsersTable
						users={usersArr}
						actionLoadingUid={actionLoadingUid}
						onOpenUser={handleOpenUser}
						onToggleStatus={handleToggleStatus}
						onRevokeSessions={handleRevokeSessions}
						onCopyUid={handleCopyUid}
					/>
				</Box>
			</Box>

			<UserDrawer
				open={drawerOpen}
				user={selectedUser}
				actionLoadingUid={actionLoadingUid}
				onClose={handleCloseDrawer}
				onSave={handleSaveUser}
				onChangePassword={handleChangePassword}
				onToggleStatus={handleToggleStatus}
				onRevokeSessions={handleRevokeSessions}
				onDeleteUser={handleDeleteUser}
				onCopyUid={handleCopyUid}
			/>

			<CreateUserDialog
				open={createDialogOpen}
				onClose={() => setCreateDialogOpen(false)}
				onCreate={handleCreateUser}
				onCopyFeedback={showToast}
			/>

			<Snackbar
				open={toast.open}
				autoHideDuration={3600}
				onClose={closeToast}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
			>
				<Alert
					onClose={closeToast}
					severity={toast.severity}
					variant="filled"
					sx={{ width: "100%" }}
				>
					{toast.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

const StatPill = ({ label, value, colors, tone = "default" }) => {
	const toneMap = {
		default: {
			bg: "rgba(255,255,255,0.06)",
			color: colors.grey[100],
			border: "rgba(255,255,255,0.08)",
		},
		success: {
			bg: "rgba(76,206,172,0.12)",
			color: colors.greenAccent[400],
			border: "rgba(76,206,172,0.22)",
		},
		danger: {
			bg: "rgba(219,79,74,0.12)",
			color: colors.redAccent[400],
			border: "rgba(219,79,74,0.22)",
		},
		info: {
			bg: "rgba(104,112,250,0.12)",
			color: colors.blueAccent[400],
			border: "rgba(104,112,250,0.22)",
		},
	};

	const current = toneMap[tone] || toneMap.default;

	return (
		<Box
			sx={{
				px: 1.5,
				py: 0.9,
				borderRadius: 999,
				border: `1px solid ${current.border}`,
				backgroundColor: current.bg,
				display: "flex",
				alignItems: "center",
				gap: 1,
			}}
		>
			<Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 800 }}>
				{label}
			</Typography>

			<Typography
				variant="body2"
				sx={{
					fontWeight: 900,
					color: current.color,
				}}
			>
				{value}
			</Typography>
		</Box>
	);
};

export default UsersPage;