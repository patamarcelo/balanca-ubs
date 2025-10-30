import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import toast from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
);

// Quando o novo SW assumir o controle → recarrega automaticamente
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.addEventListener("controllerchange", () => {
		if (!window.__appUpdated) {
			window.__appUpdated = true;
			window.location.reload();
		}
	});
}

const configuration = {
	onUpdate: (registration) => {
		if (registration && registration.waiting) {
			registration.waiting.postMessage({ type: "SKIP_WAITING" });
			toast.success("Aplicativo atualizado! Recarregando...");
			setTimeout(() => {
				window.location.reload();
			}, 1200);
		}
	}
};

serviceWorkerRegistration.register(configuration);
