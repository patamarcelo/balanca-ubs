import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// Color design Tokens
export const tokens = (mode) => ({
	...(mode === "dark"
		? {
				grey: {
					100: "#e0e0e0",
					200: "#c2c2c2",
					300: "#a3a3a3",
					400: "#858585",
					500: "#666666",
					600: "#525252",
					700: "#3d3d3d",
					800: "#292929",
					900: "#141414"
				},
				primary: {
					100: "#d0d1d5",
					200: "#a1a4ab",
					300: "#727681",
					400: "#1F2A40",
					500: "#141b2d",
					600: "#101624",
					700: "#0c101b",
					800: "#080b12",
					900: "#040509"
				},
				greenAccent: {
					100: "#dbf5ee",
					200: "#b7ebde",
					300: "#94e2cd",
					400: "#70d8bd",
					500: "#4cceac",
					600: "#3da58a",
					700: "#2e7c67",
					800: "#1e5245",
					900: "#0f2922"
				},
				redAccent: {
					100: "#f8dcdb",
					200: "#f1b9b7",
					300: "#e99592",
					400: "#e2726e",
					500: "#db4f4a",
					600: "#af3f3b",
					700: "#832f2c",
					800: "#58201e",
					900: "#2c100f"
				},
				blueAccent: {
					100: "#e1e2fe",
					200: "#c3c6fd",
					300: "#a4a9fc",
					400: "#868dfb",
					500: "#6870fa",
					600: "#535ac8",
					700: "#3e4396",
					800: "#2a2d64",
					900: "#151632"
				},
				pink: {
					100: "#f0d5de",
					200: "#e1abbd",
					300: "#d2809c",
					400: "#c3567b",
					500: "#b42c5a",
					600: "#902348",
					700: "#6c1a36",
					800: "#481224",
					900: "#240912"
				},
				yellow: {
					100: "#fffff5",
					200: "#ffffeb",
					300: "#ffffe0",
					400: "#ffffd6",
					500: "#ffffcc",
					600: "#cccca3",
					700: "#99997a",
					800: "#666652",
					900: "#333329"
				},
				blueOrigin: {
					100: "#d0e3f0",
					200: "#a0c8e1",
					300: "#71acd3",
					400: "#4191c4",
					500: "#1275b5",
					550: "#1373b4",
					600: "#0e5e91",
					700: "#0b466d",
					800: "#072f48",
					900: "#041724"
				},
				brown: {
					100: "#d7d7d7",
					200: "#afafaf",
					300: "#888888",
					400: "rgba(56, 56, 56, 0.8)",
					500: "#383838",
					600: "#2d2d2d",
					700: "#222222",
					800: "#161616",
					900: "#0b0b0b"
				},
				modal: {
					100: "#d7d7d7",
					200: "#afafaf",
					300: "#888888",
					400: "#606060",
					500: "#383838",
					600: "#2d2d2d",
					700: "#222222",
					800: "#161616",
					900: "#0b0b0b"
				}
		  }
		: {
				grey: {
					100: "#141414",
					200: "#292929",
					300: "#3d3d3d",
					400: "#525252",
					500: "#666666",
					600: "#858585",
					700: "#a3a3a3",
					800: "#c2c2c2",
					900: "#e0e0e0"
				},
				primary: {
					100: "#040509",
					200: "#080b12",
					300: "#0c101b",
					400: "#f2f0f0",
					500: "#141b2d",
					600: "#434957",
					700: "#727681",
					800: "#a1a4ab",
					900: "#d0d1d5"
				},
				greenAccent: {
					100: "#0f2922",
					200: "#1e5245",
					300: "#2e7c67",
					400: "#3da58a",
					500: "#4cceac",
					600: "#70d8bd",
					700: "#94e2cd",
					800: "#b7ebde",
					900: "#dbf5ee"
				},
				redAccent: {
					100: "#2c100f",
					200: "#58201e",
					300: "#832f2c",
					400: "#af3f3b",
					500: "#db4f4a",
					600: "#e2726e",
					700: "#e99592",
					800: "#f1b9b7",
					900: "#f8dcdb"
				},
				blueAccent: {
					100: "#151632",
					200: "#2a2d64",
					300: "#3e4396",
					400: "#535ac8",
					500: "#6870fa",
					600: "#868dfb",
					700: "#a4a9fc",
					800: "#c3c6fd",
					900: "#e1e2fe"
				},
				pink: {
					100: "#240912",
					200: "#481224",
					300: "#6c1a36",
					400: "#902348",
					500: "#b42c5a",
					600: "#c3567b",
					700: "#d2809c",
					800: "#e1abbd",
					900: "#f0d5de"
				},
				yellow: {
					100: "#333329",
					200: "#666652",
					300: "#99997a",
					400: "#cccca3",
					500: "#ffffcc",
					600: "#ffffd6",
					700: "#ffffe0",
					800: "#ffffeb",
					900: "#fffff5"
				},
				blueOrigin: {
					100: "#041724",
					200: "#072f48",
					300: "#0b466d",
					400: "#0e5e91",
					500: "#1275b5",
					600: "#4191c4",
					700: "#71acd3",
					800: "#a0c8e1",
					900: "#d0e3f0"
				},
				brown: {
					100: "#0b0b0b",
					200: "#161616",
					300: "#222222",
					400: "#2d2d2d",
					500: "#383838",
					600: "#606060",
					700: "#888888",
					800: "#afafaf",
					900: "#d7d7d7"
				},
				modal: {
					100: "#0b0b0b",
					200: "#161616",
					300: "#222222",
					400: "#2d2d2d",
					500: "#383838",
					600: "#606060",
					700: "#888888",
					800: "#afafaf",
					900: "#d7d7d7"
				}
		  })
});

// mui theme settings
export const themeSettings = (mode) => {
	const colors = tokens(mode);

	return {
		palette: {
			mode: mode,
			...(mode === "dark"
				? {
						primary: {
							main: colors.primary[500]
						},
						secondary: {
							main: colors.greenAccent[500]
						},
						neutral: {
							dark: colors.grey[700],
							main: colors.grey[500],
							light: colors.grey[100]
						},
						background: {
							default: "#fcfcfc"
						}
				  }
				: {
						primary: {
							main: colors.primary[100]
						},
						secondary: {
							main: colors.greenAccent[500]
						},
						neutral: {
							dark: colors.grey[700],
							main: colors.grey[500],
							light: colors.grey[100]
						},
						background: {
							default: "#fcfcfc"
						}
				  })
		},
		typography: {
			fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
			fontSize: 12,
			h1: {
				fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
				fontSize: 40
			},
			h2: {
				fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
				fontSize: 32
			},
			h3: {
				fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
				fontSize: 24
			},
			h4: {
				fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
				fontSize: 20
			},
			h5: {
				fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
				fontSize: 16
			},
			h6: {
				fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
				fontSize: 14
			}
		}
	};
};

// context for color mode
export const ColorModeContext = createContext({
	toggleColorMode: () => {}
});

export const useMode = () => {
	const [mode, setMode] = useState("dark");

	const colorMode = useMemo(
		() => ({
			toggleColorMode: () =>
				setMode((prev) => (prev === "light" ? "dark" : "light"))
		}),
		[]
	);

	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

	return [theme, colorMode];
};
