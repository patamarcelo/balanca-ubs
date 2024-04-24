import { Box, Typography } from "@mui/material";
import djangoApi from "../../../utils/axios/axios.utils";
import { useEffect, useState } from "react";

const MapPlotDjango = (props) => {
    const { loadMaps, mapIdsFilter, farmSelected} = props;
    const [displayMap, setDisplayMap] = useState(null);
    const [rotateDir, setRotateDir] = useState("270");
    
    useEffect(() => {
        const handleSendApiApp = async (idFarm) => {
            const params = JSON.stringify({
                projeto: farmSelected,
                parcelas: mapIdsFilter
            });
            try {
                await djangoApi
                    .post("plantio/get_matplot_draw_application/", params, {
                        headers: {
                            Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
                        }
                    })
                    .then((res) => {
                        console.log(res.data);
                        setDisplayMap(res.data);
                    });
            } catch (err) {
                console.log("Erro ao alterar as aplicações", err);
            } finally {
                // pass
            }
        };    
        if(loadMaps){
            handleSendApiApp()
        }
    }, [loadMaps, farmSelected, mapIdsFilter]);

    return (  
        <Box>
            <Typography> DIV dos Mapas</Typography>
            {
                loadMaps && (
                    <Box display={"flex"} justifyContent={"center"}>
								<img
									src={displayMap}
									alt="Italian Trulli"
									style={{
										transform: `rotate(${rotateDir}deg)`,
										width: "400px"
									}}
								/>
							</Box>
                )
            }
        </Box>
    );
}
 
export default MapPlotDjango;