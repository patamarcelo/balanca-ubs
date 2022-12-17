import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

// import "react-notifications/lib/notifications.css";
// import { NotificationContainer } from "react-notifications";

import { Toaster } from "react-hot-toast";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "./store/user/user.selector";

import Auth from "./routes/auth";
import LoggedApp from "./routes/logged-app";
import "./index.css";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./store/user/user.action";

import { onAuthStateChangedListener } from "./utils/firebase/firebase";

function App() {
	const [theme, colorMode] = useMode();
	const user = useSelector(selectCurrentUser);
	const dispatch = useDispatch();

	useEffect(() => {
		const unsubscribe = onAuthStateChangedListener((user) => {
			dispatch(setUser(user));
		});
		return unsubscribe;
	}, [dispatch]);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{/* <NotificationContainer /> */}
				<Toaster position="bottom-right" />
				<div className="app">{user ? <LoggedApp /> : <Auth />}</div>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export default App;
