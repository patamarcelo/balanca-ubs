import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import Chip from "@mui/material/Chip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";

const ColheitaModalPage = (props) => {
    const { open, handleCloseModal, children } = props;

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "98%",
        height: "100%",
        bgcolor: 'red',
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
        overflowY: "auto"
    };

    return (
        
            <Modal
                open={open}
                onClose={handleCloseModal}
                aria-labelledby="keep-mounted-modal-colheita"
                aria-describedby="keep-mounted-modal-colheita"
            >
                <Box
                    style={style}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <Box
                        textAlign={"end"}
                        sx={{
                            cursor: 'pointer',
                            "& .fa-cirle": {
                                marginLeft: "auto"
                            },
                            "& .fa-cirle:hover": {
                                opacity: 0.5
                            }
                        }}
                        className="fa-circle"
                        onClick={() => handleCloseModal()}
                    >
                            <FontAwesomeIcon
                                style={{padding: '20px'}}
                                icon={faCircleXmark}
                                />
                                </Box>
                                {children}
                </Box>
            </Modal>
    );
}

export default ColheitaModalPage;