import {
    Links, LiveReload,
    Meta,
    Outlet,
    Scripts,
} from "@remix-run/react";
import "./tailwind.css";

export default function App() {
    return (
        <html>
        <head>
            <link
                rel="icon"
                href="data:image/x-icon;base64,AA"
            />
            <Meta />
            <Links />
        </head>
        <body>
        <Outlet />
        <Scripts />
        </body>
        </html>
    );
}