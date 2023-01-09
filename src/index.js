import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./store/store";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import toast from "react-hot-toast";

// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
// import toast from "react-hot-toast";

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

const configuration = {
	onUpdate: (registration) => {
		if (registration && registration.waiting) {
			registration.waiting.postMessage({ type: "SKIP_WAITING" });
			toast.success("App Atualizado com sucesso!!");
			setTimeout(() => {
				window.location.reload();
			}, 1500);
		}
	}
};

serviceWorkerRegistration.register(configuration);
