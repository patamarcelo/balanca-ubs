import { Box, Button, Typography, CircularProgress } from "@mui/material";

import { nodeServerUsers } from "../../utils/axios/axios.utils";
import { useState, useEffect } from 'react'
import UsersTable from "../../components/users";


const UsersPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [usersArr, setUsersArr] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                setIsLoading(true);
                await nodeServerUsers
                    .get("get-all-users/", {
                        headers: {
                            Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
                        },
                    })
                    .then((res) => {
                        console.log(res.data);
                        setUsersArr(res.data.data)
                    })
                    .catch((err) => console.log(err));
            } catch (err) {
                console.log("Erro ao consumir a API", err);
            } finally {
                setIsLoading(false);
            }
        };
        getUsers()
    }, []);

    const getUsers = async () => {
        try {
            setIsLoading(true);
            await nodeServerUsers
                .get("get-all-users/", {
                    headers: {
                        Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
                    },
                })
                .then((res) => {
                    console.log(res.data);
                    setUsersArr(res.data.data)
                })
                .catch((err) => console.log(err));
        } catch (err) {
            console.log("Erro ao consumir a API", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress color="secondary"/>
            </Box>
        );
    }
    return (
        <Box
            sx={{
                width: '100%'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    textAlign: 'end',
                    marginRight: '20px',
                    paddingRight: '10px'
                }}
            >
                <Button variant="outlined" color="success" onClick={getUsers}>Update</Button>
            </Box>
            {
                usersArr && usersArr.length > 0 &&
                <UsersTable users={usersArr} />
            }


        </Box>
    );
}

export default UsersPage;