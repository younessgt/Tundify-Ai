// import { Provider } from "react-redux";
// import { store } from "../store/store";

import "./globals.css";
import ReduxProvider from "../components/ReduxProvider";
import DarkModeToggle from "../components/DarkModeToggle";

export const metadata = {
  title: "TundiFy",
  description: "TundiFy is realtime chat app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <ReduxProvider>
          {/* <DarkModeToggle /> */}
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
