import PolicyPage from "../../pages/Policy";
import Auth from "../auth";

import { Routes, Route } from "react-router-dom";
const LogginApp = () => {
	return (
		<Routes>
			<Route path="/" element={<Auth />} />
			<Route path="/politica-privacidade-app" element={<PolicyPage />} />
		</Routes>
	);
};

export default LogginApp;
