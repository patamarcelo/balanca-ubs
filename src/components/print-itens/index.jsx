import { Box } from "@mui/material";
import "./index.css";
import { useEffect, useState, useRef } from "react";

import PageData from "./page-data";
import useMediaQuery from "@mui/material/useMediaQuery";

import LoaderPage from "../global/Loader";

const PrintLayout = ({ data }) => {


	const isNonMobile = useMediaQuery("(min-width: 1020px)");
	const isNonMobileLand = useMediaQuery("(min-width: 900px)");
	const [printValue, setPrintValue] = useState();

	const [isLoading, setIsLoading] = useState(true);

	const firstRef = useRef(null);


	useEffect(() => {
		setPrintValue(data);
		setTimeout(() => {
			setIsLoading(false);
		}, 500);
	}, []);

	useEffect(() => {
		const handleBeforePrint = () => {
			const container = document.querySelector(".print-container");
			const first = document.getElementById("printablediv"); // ou firstRef.current?.closest('#printablediv')
			if (!container || !first) return;

			// remove clone antigo, se existir
			const old = document.getElementById("printablediv-clone");
			if (old) old.remove();

			// clona o primeiro bloco
			const clone = first.cloneNode(true);
			clone.id = "printablediv-clone";
			container.appendChild(clone);
		};

		const handleAfterPrint = () => {
			const old = document.getElementById("printablediv-clone");
			if (old) old.remove();
		};

		// Chrome/Edge/Firefox (eventos nativos)
		window.addEventListener("beforeprint", handleBeforePrint);
		window.addEventListener("afterprint", handleAfterPrint);

		// Fallback para navegadores que disparam via matchMedia
		const media = window.matchMedia?.("print");
		const mmListener = (e) => e.matches ? handleBeforePrint() : handleAfterPrint();
		if (media && media.addEventListener) media.addEventListener("change", mmListener);

		return () => {
			window.removeEventListener("beforeprint", handleBeforePrint);
			window.removeEventListener("afterprint", handleAfterPrint);
			if (media && media.removeEventListener) media.removeEventListener("change", mmListener);
		};
	}, []);

	return (
		<div className="print-container">
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				sx={{
					width: isNonMobile ? "90%" : "100%",
					maxWidth: "925px",
					backgroundColor: "white",
					boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
				}}
				className="print-ticket"
			>
				{isLoading || !data ? (
					<Box width="100%" height="60vh" sx={{ padding: "20px 50px" }}>
						<LoaderPage isLoading={isLoading} />
					</Box>
				) : (
					<PageData data={printValue} />
				)}
			</Box>

				<div
				className="print-ticket print-duplicate"
				>

			{/* divisor pontilhado visível só na impressão */}
			<div className="print-divider"></div>
			{/* SEGUNDA CÓPIA – escondida na tela, visível no print */}
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				sx={{
					width: isNonMobile ? "90%" : "100%",
					maxWidth: "925px",
					backgroundColor: "white",
					boxShadow: "none" // no print já tiramos via CSS, na tela não precisa mostrar
				}}
				// className="print-ticket print-duplicate"
				>
				{isLoading || !data ? (
					<Box width="100%" height="60vh" sx={{ padding: "20px 50px" }}>
						<LoaderPage isLoading={isLoading} />
					</Box>
				) : (
					<PageData data={printValue} />
				)}
			</Box>
			</div>

		</div>
	);
};

export default PrintLayout;
