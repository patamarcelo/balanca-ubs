import {
    Box,
    Typography,
    useTheme,
    Chip,
    TextField,
    IconButton,
    Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import EmailIcon from "@mui/icons-material/Email";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import { useMemo, useState } from "react";

import { tokens } from "../../theme";

const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const UsersTable = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { users } = props;

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive
    const [roleFilter, setRoleFilter] = useState("all"); // all | admin | regular

    // Normaliza: aceita tanto array quanto objeto de usuários
    const normalizedUsers = useMemo(() => {
        if (Array.isArray(users)) return users;
        if (users && typeof users === "object") return Object.values(users);
        return [];
    }, [users]);

    // Monta um array “flat” com os campos que vamos exibir
    const mappedUsers = useMemo(
        () =>
            normalizedUsers
                .map((u) => {
                    const providerPhone =
                        u?.providerData?.find((p) => p.phoneNumber)?.phoneNumber;
                    const providerEmail =
                        u?.providerData?.find((p) => p.email)?.email;

                    const displayName =
                        u.displayName ||
                        u?.providerData?.find((p) => p.displayName)?.displayName ||
                        "";

                    return {
                        uid: u.uid,
                        displayName,
                        email: u.email || providerEmail || "",
                        phoneNumber: u.phoneNumber || providerPhone || "",
                        disabled: !!u.disabled,
                        admin: !!u?.customClaims?.admin,
                        isActive:
                            u?.customClaims?.isActive !== undefined
                                ? u.customClaims.isActive
                                : !u.disabled,
                        unidadeOp: u?.customClaims?.unidadeOp || "",
                        category: u?.customClaims?.category || "",
                        lastSignInTime: u?.metadata?.lastSignInTime || "",
                        creationTime: u?.metadata?.creationTime || "",
                        // 🔹 NOVO: projetos liberados
                        projetosLiberados:
                            u?.customClaims?.projetosLiberados || [],
                    };
                })
                .sort((a, b) =>
                    (a.displayName || "").localeCompare(b.displayName || "")
                ),
        [normalizedUsers]
    );

    // Aplica busca + filtros
    const filteredUsers = useMemo(() => {
        return mappedUsers.filter((u) => {
            const term = search.trim().toLowerCase();

            if (term) {
                const haystack = `${u.displayName} ${u.email}`.toLowerCase();
                if (!haystack.includes(term)) return false;
            }

            if (statusFilter === "active" && !u.isActive) return false;
            if (statusFilter === "inactive" && u.isActive) return false;

            if (roleFilter === "admin" && !u.admin) return false;
            if (roleFilter === "regular" && u.admin) return false;

            return true;
        });
    }, [mappedUsers, search, statusFilter, roleFilter]);

    const totalUsers = mappedUsers.length;
    const totalActive = mappedUsers.filter((u) => u.isActive).length;
    const totalAdmins = mappedUsers.filter((u) => u.admin).length;

    return (
        <Box
            sx={{
                width: "100%",
                p: 2,
                display: "flex",
                flexDirection: "column",
                // altura fixa relativa à viewport
                height: "calc(100vh - 80px)", // ajusta esse 120px se precisar
            }}
        >
            {/* HEADER COM TÍTULO E CONTADORES */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Usuários do Sistema
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Gerencie acessos, perfis e status de login
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                        label={`Total: ${totalUsers}`}
                        sx={{
                            backgroundColor: colors.primary[600],
                            color: "#fff",
                            fontWeight: 600,
                        }}
                    />
                    <Chip
                        icon={<CheckCircleIcon />}
                        label={`Ativos: ${totalActive}`}
                        sx={{
                            backgroundColor: colors.greenAccent[700],
                            color: "#fff",
                            fontWeight: 600,
                        }}
                    />
                    <Chip
                        icon={<AdminPanelSettingsIcon />}
                        label={`Admins: ${totalAdmins}`}
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: "#fff",
                            fontWeight: 600,
                        }}
                    />
                </Box>
            </Box>

            {/* BARRA DE BUSCA + FILTROS */}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2,
                    alignItems: "center",
                }}
            >
                {/* Busca */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                        minWidth: 260,
                        backgroundColor: colors.primary[700],
                        borderRadius: "999px",
                        px: 2,
                        py: 0.5,
                    }}
                >
                    <SearchIcon sx={{ mr: 1, opacity: 0.7 }} />
                    <TextField
                        variant="standard"
                        placeholder="Buscar por nome ou e-mail..."
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            disableUnderline: true,
                            style: { color: "#fff" },
                        }}
                    />
                </Box>

                {/* Filtro de status */}
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                        label="Todos"
                        onClick={() => setStatusFilter("all")}
                        variant={statusFilter === "all" ? "filled" : "outlined"}
                        sx={{
                            borderRadius: "999px",
                            backgroundColor:
                                statusFilter === "all"
                                    ? colors.primary[500]
                                    : "transparent",
                        }}
                    />
                    <Chip
                        icon={<CheckCircleIcon />}
                        label="Ativos"
                        onClick={() => setStatusFilter("active")}
                        variant={
                            statusFilter === "active" ? "filled" : "outlined"
                        }
                        sx={{
                            borderRadius: "999px",
                            backgroundColor:
                                statusFilter === "active"
                                    ? colors.greenAccent[700]
                                    : "transparent",
                        }}
                    />
                    <Chip
                        icon={<CancelIcon />}
                        label="Inativos"
                        onClick={() => setStatusFilter("inactive")}
                        variant={
                            statusFilter === "inactive" ? "filled" : "outlined"
                        }
                        sx={{
                            borderRadius: "999px",
                            backgroundColor:
                                statusFilter === "inactive"
                                    ? colors.redAccent[700]
                                    : "transparent",
                        }}
                    />
                </Box>

                {/* Filtro de perfil */}
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                        icon={<PersonIcon />}
                        label="Todos Perfis"
                        onClick={() => setRoleFilter("all")}
                        variant={roleFilter === "all" ? "filled" : "outlined"}
                        sx={{
                            borderRadius: "999px",
                            backgroundColor:
                                roleFilter === "all"
                                    ? colors.primary[500]
                                    : "transparent",
                        }}
                    />
                    <Chip
                        icon={<AdminPanelSettingsIcon />}
                        label="Admin"
                        onClick={() => setRoleFilter("admin")}
                        variant={
                            roleFilter === "admin" ? "filled" : "outlined"
                        }
                        sx={{
                            borderRadius: "999px",
                            backgroundColor:
                                roleFilter === "admin"
                                    ? colors.blueAccent[700]
                                    : "transparent",
                        }}
                    />
                    <Chip
                        icon={<PersonIcon />}
                        label="Regular"
                        onClick={() => setRoleFilter("regular")}
                        variant={
                            roleFilter === "regular" ? "filled" : "outlined"
                        }
                        sx={{
                            borderRadius: "999px",
                            backgroundColor:
                                roleFilter === "regular"
                                    ? colors.grey[700]
                                    : "transparent",
                        }}
                    />
                </Box>
            </Box>

            {/* LISTA DE USUÁRIOS */}
            <Box
                sx={{
                    mt: 1,
                    flex: 1,           // ocupa o resto do espaço disponível
                    overflowY: "auto", // só aqui scrolla
                    // backgroundColor: 'whitesmoke'
                    // pr: 1,
                }}
            >
                {filteredUsers.map((u, index) => (
                    <Box
                        key={u.uid || index}
                        sx={{
                            mb: 1.5,
                            p: 1.5,
                            borderRadius: 2,
                            border: `1px solid ${colors.primary[700]}`,
                            backgroundColor: colors.blueOrigin
                                ? colors.blueOrigin[800]
                                : colors.primary[800],
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                            "&:hover": {
                                borderColor: colors.blueAccent[500],
                                boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
                            },
                        }}
                    >
                        {/* Linha 1: nome + status + admin */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 1,
                                flexWrap: "wrap",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ opacity: 0.6, minWidth: 24 }}
                                >
                                    #{index + 1}
                                </Typography>
                                <Typography variant="h6" fontSize={16}>
                                    {u.displayName || "Sem nome"}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                {/* Status ativo/inativo */}
                                <Chip
                                    icon={
                                        u.isActive ? (
                                            <CheckCircleIcon />
                                        ) : (
                                            <CancelIcon />
                                        )
                                    }
                                    label={u.isActive ? "Ativo" : "Inativo"}
                                    size="small"
                                    sx={{
                                        backgroundColor: u.isActive
                                            ? colors.greenAccent[700]
                                            : colors.redAccent[700],
                                        color: "#fff",
                                        fontWeight: 600,
                                    }}
                                />

                                {/* Admin / Regular */}
                                <Chip
                                    icon={
                                        u.admin ? (
                                            <AdminPanelSettingsIcon />
                                        ) : (
                                            <PersonIcon />
                                        )
                                    }
                                    label={u.admin ? "Admin" : "Regular"}
                                    size="small"
                                    sx={{
                                        backgroundColor: u.admin
                                            ? colors.blueAccent[700]
                                            : colors.grey[700],
                                        color: "#fff",
                                        fontWeight: 600,
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Linha 2: e-mail + telefone */}
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2,
                                mt: 0.5,
                                alignItems: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    minWidth: 220,
                                }}
                            >
                                <EmailIcon sx={{ fontSize: 18, opacity: 0.7 }} />
                                <Typography variant="body2">{u.email}</Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    minWidth: 160,
                                }}
                            >
                                <PhoneIphoneIcon
                                    sx={{ fontSize: 18, opacity: 0.7 }}
                                />
                                <Typography variant="body2">
                                    {u.phoneNumber || "—"}
                                </Typography>
                            </Box>

                            {u.unidadeOp && (
                                <Chip
                                    label={u.unidadeOp}
                                    size="small"
                                    sx={{
                                        backgroundColor: colors.primary[600],
                                        color: "#fff",
                                        fontWeight: 500,
                                    }}
                                />
                            )}

                            {u.category && (
                                <Chip
                                    label={u.category}
                                    size="small"
                                    sx={{
                                        backgroundColor: colors.primary[700],
                                        color: "#fff",
                                        fontWeight: 500,
                                    }}
                                />
                            )}
                        </Box>

                        {/* Linha 3: datas */}
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2,
                                mt: 0.5,
                                opacity: 0.8,
                            }}
                        >
                            <Typography variant="caption">
                                Último acesso:{" "}
                                <strong>
                                    {formatDate(u.lastSignInTime)}
                                </strong>
                            </Typography>
                            <Typography variant="caption">
                                Criado em:{" "}
                                <strong>{formatDate(u.creationTime)}</strong>
                            </Typography>
                        </Box>
                        {/* 🔹 NOVO: Linha 2.1 – Projetos liberados */}
                        {u.projetosLiberados && u.projetosLiberados.length > 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    mt: 0.75,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.75,
                                        maxHeight: 80,
                                        overflowY: "auto",
                                        pr: 0.5,
                                    }}
                                >
                                    {u.projetosLiberados.map((proj, idx) => (
                                        <Chip
                                            key={idx}
                                            label={proj}
                                            size="small"
                                            sx={{
                                                backgroundColor: colors.blueAccent[700],
                                                color: "#fff",
                                                fontWeight: 500,
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                ))}

                {filteredUsers.length === 0 && (
                    <Box
                        sx={{
                            mt: 4,
                            textAlign: "center",
                            opacity: 0.7,
                        }}
                    >
                        <Typography variant="body2">
                            Nenhum usuário encontrado com os filtros atuais.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default UsersTable;
