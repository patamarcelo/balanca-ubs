import { Box } from "@mui/material";

import { useEffect, useState } from "react";
import { onSnapshot, collection, query, where, limit, orderBy } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { db } from "../../../utils/firebase/firebase";
import { TABLES_FIREBASE } from "../../../utils/firebase/firebase.typestables";
import RomaneiosTable from "./table-romaneios";


const RomaneiosPage = () => {

    const dispatch = useDispatch();
    const [isLoadingHome, setIsLoading] = useState(true);
    const [useData, setUseData] = useState([]);

    useEffect(() => {
        const collRef = collection(db, TABLES_FIREBASE.truckmove);
        const q = query(collRef, where("syncDate", "!=", null),
		orderBy("syncDate", "desc"), limit(100));
        onSnapshot(q, (snapshot) => {

            const formArr = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))
            setUseData(formArr)

        });

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [dispatch]);


    useEffect(() => {
        if (useData.length > 0) {
            useData.forEach((data) => {
                console.log('Romaneio: ', data)
            })
        }
    }, [useData]);

    return (
        <Box
            width={"100%"}
            height={"100%"}
            justifyContent={"center"}
            display={"flex"}
            alignItems={"flex-start"}
            p={5}
        >
            <RomaneiosTable data={useData} />
        </Box>
    );
};

export default RomaneiosPage;
