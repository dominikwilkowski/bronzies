import * as serviceWorker from "./serviceWorker";
import { createRoot } from "react-dom/client";
import pkg from "../package.json";
import React from "react";
import App from "./app";

const stored_version = localStorage.getItem("app_version");
if (stored_version !== pkg.version) {
	localStorage.removeItem("questions");
	localStorage.removeItem("svg");

	localStorage.setItem("app_version", pkg.version);

	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.getRegistrations().then((registrations) => {
			registrations.forEach((registration) => registration.unregister());
		});
	}
}

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);

serviceWorker.register();

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.addEventListener("message", (event) => {
		if (event.data && event.data.type === "NEW_VERSION") {
			console.log("New version available. Reloading page...");
			window.location.reload();
		}
	});
}
