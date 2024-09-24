import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration
} from "@remix-run/react";
import "./global.css";
import { Toaster } from 'react-hot-toast';

export default function App() {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <title>Your App</title>
        </head>
        <body>
        <Toaster  position="bottom-right"
  toastOptions={{
    style: {
      background: '#333',
      color: '#fff',
    },
  }}
/>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        </body>
        </html>
    );
}