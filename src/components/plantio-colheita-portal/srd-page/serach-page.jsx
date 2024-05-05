import { nodeServerSrd } from "../../../utils/axios/axios.utils";
import { Button } from "@mui/material";

const SearchPage = props => {
    const { setIsLoading, setDataArray, paramsQuery, setcsvData, handleSearch } = props;
    return (
        <Button
            variant="contained"
            color="success"
            size="small"
            sx={{ padding: "0px" }}
            onClick={handleSearch}
            disabled={!paramsQuery.dtIni && !paramsQuery.dtFim}
        >
            Buscar
        </Button>
    );
};

export default SearchPage;
