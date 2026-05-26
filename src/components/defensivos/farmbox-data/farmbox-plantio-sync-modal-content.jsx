import { useEffect, useMemo, useState } from "react";
import {
	Alert,
	Box,
	Button,
	Checkbox,
	CircularProgress,
	Divider,
	FormControlLabel,
	LinearProgress,
	MenuItem,
	Skeleton,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";

import toast from "react-hot-toast";
import djangoApi from "../../../utils/axios/axios.utils";

const STORAGE_KEY = "farmboxPlantioSync:lastSafraId";

const formatDateTimeLocalToBackend = (value) => {
	if (!value) return "";

	// datetime-local retorna: 2026-05-26T06:00
	// backend espera:       2026-05-26 06:00
	return String(value).replace("T", " ").slice(0, 16);
};

const formatLastSync = (value) => {
	if (!value) return "Nunca sincronizado";

	try {
		const date = new Date(value);

		if (Number.isNaN(date.getTime())) return value;

		return date.toLocaleString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return value;
	}
};

const FarmboxPlantioSyncModalContent = ({ colors, isDark, onSuccess }) => {
	const [safras, setSafras] = useState([]);
	const [safraId, setSafraId] = useState(() => localStorage.getItem(STORAGE_KEY) || "");

	const [updatedSince, setUpdatedSince] = useState("");
	const [forceFull, setForceFull] = useState(false);
	const [dryRun, setDryRun] = useState(false);

	const [loadingOptions, setLoadingOptions] = useState(false);
	const [syncing, setSyncing] = useState(false);
	const [error, setError] = useState("");
	const [result, setResult] = useState(null);

	const selectedSafra = useMemo(() => {
		return safras.find((item) => String(item.id) === String(safraId));
	}, [safras, safraId]);

	useEffect(() => {
		const loadOptions = async () => {
			setLoadingOptions(true);
			setError("");

			try {
				const res = await djangoApi.get("/plantio/farmbox_sync_options/", {
					headers: {
						Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
					},
				});

				const dados = res.data?.dados || [];
				setSafras(dados);

				const saved = localStorage.getItem(STORAGE_KEY);
				const savedExists = dados.some((item) => String(item.id) === String(saved));

				if (saved && savedExists) {
					setSafraId(String(saved));
					return;
				}

				if (dados.length > 0) {
					const firstId = String(dados[0].id);
					setSafraId(firstId);
					localStorage.setItem(STORAGE_KEY, firstId);
				}
			} catch (err) {
				console.error("Erro ao carregar opções Farmbox:", err);
				setError(
					err?.response?.data?.message ||
					"Não foi possível carregar as safras disponíveis."
				);
			} finally {
				setLoadingOptions(false);
			}
		};

		loadOptions();
	}, []);

	const handleChangeSafra = (event) => {
		const value = event.target.value;
		setSafraId(value);
		localStorage.setItem(STORAGE_KEY, value);
	};

	const handleSync = async () => {
		if (!safraId) {
			setError("Selecione uma safra.");
			return;
		}

		setSyncing(true);
		setError("");
		setResult(null);

		try {
			const payload = {
				safra_id: Number(safraId),
				force_full: forceFull,
				dry_run: dryRun,
			};

			const updatedSinceBackend = formatDateTimeLocalToBackend(updatedSince);

			if (updatedSinceBackend && !forceFull) {
				payload.updated_since = updatedSinceBackend;
			}

			const res = await djangoApi.post("/plantio/sync_plantio_farmbox/", payload, {
				headers: {
					Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
				},
			});

			setResult(res.data);

			if (dryRun) {
				toast.success("Teste Farmbox executado com sucesso.", {
					position: "top-right",
				});
				return;
			}

			toast.success("Sincronização Farmbox finalizada.", {
				position: "top-right",
			});

			onSuccess?.();
		} catch (err) {
			console.error("Erro ao sincronizar Farmbox:", err);
			setError(
				err?.response?.data?.message ||
				"Erro ao sincronizar dados do Farmbox."
			);
		} finally {
			setSyncing(false);
		}
	};
	const getSyncStats = () => {
		const source = result?.resultado || result || {};

		return {
			totalReturn:
				source.total_return ??
				result?.total_return ??
				result?.total_recebido_farmbox ??
				result?.total_recebido ??
				result?.farmbox_meta?.total_received ??
				0,

			totalAlterados:
				source["Total de Talhões alterados"] ??
				source.alteradas_com_farmbox_update ??
				source.total_alterados ??
				source.alterados ??
				0,

			criadas:
				source.criadas ??
				source.created ??
				0,

			atualizadas:
				source.atualizadas ??
				source.updated ??
				0,

			ignoradas:
				source.ignoradas ??
				source.ignored ??
				0,

			recebidosFarmbox:
				result?.total_recebido_farmbox ??
				result?.total_recebido ??
				result?.farmbox_meta?.total_received ??
				source.recebidos ??
				0,
		};
	};

	const syncStats = getSyncStats();

	const inputSx = {
		"& .MuiInputLabel-root": {
			color: isDark ? colors.grey[200] : colors.grey[700],
			fontWeight: 700,
		},
		"& .MuiFormHelperText-root": {
			color: isDark ? colors.grey[300] : colors.grey[600],
			fontWeight: 600,
		},
		"& .MuiOutlinedInput-root": {
			borderRadius: "12px",
			backgroundColor: isDark ? colors.blueOrigin[700] : "#FFFFFF",
			color: isDark ? colors.grey[100] : colors.grey[900],
			fontWeight: 700,
		},
		"& .MuiOutlinedInput-input": {
			color: isDark ? colors.grey[100] : colors.grey[900],
			WebkitTextFillColor: isDark ? colors.grey[100] : colors.grey[900],
			fontWeight: 700,
		},
		"& .MuiOutlinedInput-notchedOutline": {
			borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(15,23,42,0.16)",
		},
		"& .MuiSvgIcon-root": {
			color: isDark ? colors.grey[100] : colors.grey[900],
		},
	};

	const panelSx = {
		p: 2,
		borderRadius: "14px",
		backgroundColor: isDark
			? "rgba(255,255,255,0.06)"
			: "rgba(15,23,42,0.04)",
		border: isDark
			? "1px solid rgba(255,255,255,0.10)"
			: "1px solid rgba(15,23,42,0.08)",
	};

	const textColor = isDark ? colors.grey[100] : colors.grey[900];
	const mutedTextColor = isDark ? colors.grey[300] : colors.grey[700];


	const renderOptionsSkeleton = () => (
		<Box>
			<Box
				sx={{
					...panelSx,
					mb: 2,
				}}
			>
				<Stack spacing={1.5}>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
						<Skeleton variant="circular" width={34} height={34} />
						<Box sx={{ flex: 1 }}>
							<Skeleton variant="text" width="45%" height={24} />
							<Skeleton variant="text" width="72%" height={18} />
						</Box>
					</Box>

					<Divider />

					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								md: "1.2fr 1fr",
							},
							gap: 2,
						}}
					>
						<Skeleton variant="rounded" height={42} sx={{ borderRadius: "12px" }} />
						<Skeleton variant="rounded" height={42} sx={{ borderRadius: "12px" }} />
					</Box>

					<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
						<Skeleton variant="rounded" width={230} height={32} sx={{ borderRadius: "10px" }} />
						<Skeleton variant="rounded" width={190} height={32} sx={{ borderRadius: "10px" }} />
						<Skeleton variant="rounded" width={140} height={40} sx={{ borderRadius: "12px" }} />
					</Box>
				</Stack>
			</Box>

			<Alert severity="info">
				<Typography fontWeight={800}>
					Carregando safras e últimas sincronizações...
				</Typography>
				<Typography variant="body2">
					Buscando as opções disponíveis no banco antes de liberar a sincronização.
				</Typography>
			</Alert>
		</Box>
	);

	return (
		<Box>
			<Typography
				variant="body2"
				sx={{
					mb: 2,
					color: mutedTextColor,
					fontWeight: 600,
				}}
			>
				Use esta rotina para buscar os plantios direto do Farmbox e atualizar o banco do sistema usando a safra selecionada.
			</Typography>

			{loadingOptions && renderOptionsSkeleton()}

			{!loadingOptions && (
				<>
					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					{syncing && (
						<Box sx={{ mb: 2 }}>
							<LinearProgress
								color={dryRun ? "warning" : "success"}
								sx={{
									height: 8,
									borderRadius: 999,
									mb: 1.5,
									backgroundColor: isDark
										? "rgba(255,255,255,0.12)"
										: "rgba(15,23,42,0.08)",
								}}
							/>

							<Alert severity={dryRun ? "info" : "warning"}>
								<Typography fontWeight={900}>
									{dryRun
										? "Testando busca no Farmbox..."
										: "Sincronização em andamento..."}
								</Typography>

								<Typography variant="body2">
									{dryRun
										? "O sistema está buscando os dados em paralelo, mas nada será salvo no banco."
										: "O sistema está buscando as páginas do Farmbox em paralelo e depois atualizando os plantios no banco."}
								</Typography>
							</Alert>
						</Box>
					)}

					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								md: "1.2fr 1fr",
							},
							gap: 2,
							mb: 2,
							opacity: syncing ? 0.72 : 1,
							pointerEvents: syncing ? "none" : "auto",
							transition: "opacity 0.2s ease",
						}}
					>
						<TextField
							select
							fullWidth
							size="small"
							label="Safra"
							value={safraId}
							onChange={handleChangeSafra}
							disabled={syncing}
							sx={inputSx}
							helperText={
								selectedSafra?.id_farmbox
									? `Farmbox ID: ${selectedSafra.id_farmbox}`
									: "Selecione a safra que será sincronizada."
							}
						>
							{safras.map((item) => (
								<MenuItem key={item.id} value={String(item.id)}>
									{item.safra} — Farmbox ID {item.id_farmbox}
								</MenuItem>
							))}
						</TextField>

						<TextField
							fullWidth
							size="small"
							type="datetime-local"
							label="Atualizar desde"
							value={updatedSince}
							onChange={(event) => setUpdatedSince(event.target.value)}
							disabled={forceFull || syncing}
							helperText={
								forceFull
									? "Desabilitado porque a safra inteira será buscada."
									: "Opcional. Se vazio, usa a última sincronização salva."
							}
							InputLabelProps={{
								shrink: true,
							}}
							inputProps={{
								step: 60,
							}}
							sx={inputSx}
						/>
					</Box>

					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							alignItems: "center",
							gap: 2,
							mb: 2,
							opacity: syncing ? 0.72 : 1,
							pointerEvents: syncing ? "none" : "auto",
							transition: "opacity 0.2s ease",
						}}
					>
						<Tooltip
							arrow
							title="Ignora a última sincronização e busca todos os plantios da safra novamente."
						>
							<FormControlLabel
								control={
									<Checkbox
										checked={forceFull}
										onChange={(event) => setForceFull(event.target.checked)}
										disabled={syncing}
										color="success"
									/>
								}
								label="Buscar safra inteira novamente"
								sx={{
									color: textColor,
									fontWeight: 700,
									"& .MuiFormControlLabel-label": {
										fontWeight: 800,
									},
								}}
							/>
						</Tooltip>

						<Tooltip
							arrow
							title="Busca os dados no Farmbox, mas não grava nenhuma alteração no banco."
						>
							<FormControlLabel
								control={
									<Checkbox
										checked={dryRun}
										onChange={(event) => setDryRun(event.target.checked)}
										disabled={syncing}
										color="warning"
									/>
								}
								label="Apenas testar, não salvar"
								sx={{
									color: textColor,
									fontWeight: 700,
									"& .MuiFormControlLabel-label": {
										fontWeight: 800,
									},
								}}
							/>
						</Tooltip>

						<Button
							variant="contained"
							color="success"
							onClick={handleSync}
							disabled={syncing || !safraId}
							sx={{
								minHeight: 40,
								borderRadius: "12px",
								textTransform: "none",
								fontWeight: 900,
								px: 3,
								boxShadow: "0 10px 24px rgba(46,125,50,0.24)",
							}}
						>
							{syncing ? (
								<>
									<CircularProgress size={18} sx={{ mr: 1, color: "#fff" }} />
									{dryRun ? "Testando..." : "Sincronizando..."}
								</>
							) : dryRun ? (
								"Testar busca"
							) : (
								"Sincronizar"
							)}
						</Button>
					</Box>

					{updatedSince && !forceFull && (
						<Alert severity="info" sx={{ mb: 2 }}>
							<Typography fontWeight={800}>
								Data manual selecionada
							</Typography>
							<Typography variant="body2">
								O backend receberá:{" "}
								<strong>{formatDateTimeLocalToBackend(updatedSince)}</strong>
							</Typography>
						</Alert>
					)}

					{selectedSafra && (
						<Box
							sx={{
								...panelSx,
								mb: 2,
							}}
						>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
									gap: 2,
									flexWrap: "wrap",
								}}
							>
								<Box>
									<Typography
										variant="caption"
										sx={{
											display: "block",
											mb: 0.5,
											color: mutedTextColor,
											fontWeight: 800,
											textTransform: "uppercase",
											letterSpacing: "0.04em",
										}}
									>
										Safra selecionada
									</Typography>

									<Typography
										variant="h6"
										sx={{
											color: textColor,
											fontWeight: 900,
											lineHeight: 1.1,
										}}
									>
										{selectedSafra.safra}
									</Typography>

									<Typography
										variant="body2"
										sx={{
											color: mutedTextColor,
											fontWeight: 700,
											mt: 0.5,
										}}
									>
										Farmbox ID: {selectedSafra.id_farmbox}
									</Typography>
								</Box>

								<Box
									sx={{
										textAlign: {
											xs: "left",
											md: "right",
										},
									}}
								>
									<Typography
										variant="body2"
										sx={{ color: textColor, fontWeight: 700 }}
									>
										<strong>Última sincronização:</strong>{" "}
										{formatLastSync(selectedSafra.last_sync_at)}
									</Typography>

									<Typography
										variant="body2"
										sx={{ color: textColor, fontWeight: 700 }}
									>
										<strong>Último total recebido:</strong>{" "}
										{selectedSafra.last_total_received || 0}
									</Typography>
								</Box>
							</Box>
						</Box>
					)}

					{result && (
						<Alert severity={dryRun ? "info" : "success"} sx={{ mb: 2 }}>
							<Typography fontWeight={900} sx={{ mb: 1 }}>
								{result.msg}
							</Typography>

							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: {
										xs: "1fr 1fr",
										md: "repeat(5, 1fr)",
									},
									gap: 1.25,
									mt: 1,
								}}
							>
								<Box
									sx={{
										p: 1.25,
										borderRadius: "12px",
										backgroundColor: isDark
											? "rgba(255,255,255,0.08)"
											: "rgba(15,23,42,0.06)",
									}}
								>
									<Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.75 }}>
										Farmbox
									</Typography>
									<Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
										{syncStats.recebidosFarmbox}
									</Typography>
								</Box>

								<Box
									sx={{
										p: 1.25,
										borderRadius: "12px",
										backgroundColor: isDark
											? "rgba(255,255,255,0.08)"
											: "rgba(15,23,42,0.06)",
									}}
								>
									<Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.75 }}>
										Total DB
									</Typography>
									<Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
										{syncStats.totalReturn}
									</Typography>
								</Box>

								<Box
									sx={{
										p: 1.25,
										borderRadius: "12px",
										backgroundColor: isDark
											? "rgba(46,125,50,0.20)"
											: "rgba(46,125,50,0.10)",
									}}
								>
									<Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.75 }}>
										Alterados
									</Typography>
									<Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
										{syncStats.totalAlterados}
									</Typography>
								</Box>

								<Box
									sx={{
										p: 1.25,
										borderRadius: "12px",
										backgroundColor: isDark
											? "rgba(25,118,210,0.22)"
											: "rgba(25,118,210,0.10)",
									}}
								>
									<Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.75 }}>
										Criadas
									</Typography>
									<Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
										{syncStats.criadas}
									</Typography>
								</Box>

								<Box
									sx={{
										p: 1.25,
										borderRadius: "12px",
										backgroundColor: isDark
											? "rgba(237,108,2,0.22)"
											: "rgba(237,108,2,0.10)",
									}}
								>
									<Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.75 }}>
										Atualizadas
									</Typography>
									<Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
										{syncStats.atualizadas}
									</Typography>
								</Box>
							</Box>

							{syncStats.ignoradas > 0 && (
								<Typography variant="body2" sx={{ mt: 1.25, fontWeight: 700 }}>
									Ignoradas: {syncStats.ignoradas}
								</Typography>
							)}
						</Alert>
					)}

					{result?.farmbox_meta && (
						<Box sx={panelSx}>
							<Typography
								variant="caption"
								sx={{
									display: "block",
									mb: 1,
									color: mutedTextColor,
									fontWeight: 900,
									textTransform: "uppercase",
									letterSpacing: "0.04em",
								}}
							>
								Performance Farmbox
							</Typography>

							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: {
										xs: "1fr",
										sm: "1fr 1fr",
										md: "repeat(4, 1fr)",
									},
									gap: 1.5,
								}}
							>
								<Box>
									<Typography variant="body2" sx={{ color: mutedTextColor }}>
										Páginas
									</Typography>
									<Typography variant="h6" sx={{ color: textColor, fontWeight: 900 }}>
										{result.farmbox_meta.total_pages}
									</Typography>
								</Box>

								<Box>
									<Typography variant="body2" sx={{ color: mutedTextColor }}>
										Paralelas
									</Typography>
									<Typography variant="h6" sx={{ color: textColor, fontWeight: 900 }}>
										{result.farmbox_meta.pages_requested_parallel}
									</Typography>
								</Box>

								<Box>
									<Typography variant="body2" sx={{ color: mutedTextColor }}>
										Tempo
									</Typography>
									<Typography variant="h6" sx={{ color: textColor, fontWeight: 900 }}>
										{result.farmbox_meta.elapsed_total}s
									</Typography>
								</Box>

								<Box>
									<Typography variant="body2" sx={{ color: mutedTextColor }}>
										Registros
									</Typography>
									<Typography variant="h6" sx={{ color: textColor, fontWeight: 900 }}>
										{result.farmbox_meta.total_received}
									</Typography>
								</Box>
							</Box>
						</Box>
					)}
				</>
			)}
		</Box>
	);
};

export default FarmboxPlantioSyncModalContent;