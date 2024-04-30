import { nodeServerSrd } from "../../../utils/axios/axios.utils";
import { Button } from "@mui/material";

const SearchPage = props => {
    const { setIsLoading, setDataArray, paramsQuery, setcsvData } = props;
    const handleSearch = async () => {
        setcsvData([])
        console.log("Buscar os dados", paramsQuery);
        setIsLoading(true);
        try {
            nodeServerSrd
                .get("/get-from-srd", {
                    headers: {
                        Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
                    },
                    params: {
                        paramsQuery
                    }
                })
                .then(res => {
                    setDataArray(res.data.objects);
                    console.log(res.data.objects);
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false)
                    window.alert('erro ao pegar os dados: ', err)
                })
        } catch (error) {
            console.log("erro ao pegar os dados: ", error);
            setIsLoading(false);
        } finally {
            // setIsLoading(false);
        }
    };
    return (
        <Button
            variant="contained"
            color="success"
            size="small"
            sx={{ padding: "0px" }}
            onClick={handleSearch}
            disabled={!paramsQuery.dtIni || !paramsQuery.dtFim}
        >
            Buscar
        </Button>
    );
};

export default SearchPage;
