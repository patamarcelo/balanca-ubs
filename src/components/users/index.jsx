import { Box, Typography, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { tokens } from "../../theme";

const UsersTable = (props) => {

    const theme = useTheme();
	const colors = tokens(theme.palette.mode);

    const { users } = props;
    console.log('usersLLLL:', users)
    return (
        <Box sx={{ width: "100%", padding: "20px" }}>
            <Box
                sx={{
                    width: "100%",
                    margin: "10px",
                    marginTop: "-10px",
                    padding: "10px",
                    paddingTop: "0px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    // border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                    position: 'sticky',
                    top: 0,
                    backgroundColor: colors.blueOrigin[900]
                }}
            >
                <Typography variant="h6" sx={{ flex: 1 }}>
                    Email
                </Typography>
                <Typography variant="h6" sx={{ flex: 1 }}>
                    Nome
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                    }}
                >

                    <Typography variant="h6">
                        Ativo
                    </Typography>
                </Box>
            </Box>
            {users.sort((a, b) => a.displayName.localeCompare(b.displayName)).map((data, i) => (
                <Box
                    key={i}
                    sx={{
                        width: "100%",
                        margin: "10px",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                        backgroundColor: colors.blueOrigin[800]
                    }}
                >
                    <Typography variant="h6" sx={{ flex: 1 }}>
                        {data.email}
                    </Typography>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                        {data.displayName || "N/A"}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flex: 1,
                        }}
                    >
                        {data.disabled ? (
                            <CancelIcon sx={{ color: "red", marginRight: "8px" }} />
                        ) : (
                            <CheckCircleIcon sx={{ color: "green", marginRight: "8px" }} />
                        )}
                        <Typography variant="h6">
                            {data.disabled ? "Inativo" : "Ativo"}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

export default UsersTable;