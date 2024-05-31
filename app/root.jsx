import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useRouteError
} from "@remix-run/react";
import {json} from "@remix-run/node"

export const loader = async ({request}) => {
    return json({
            ENV: {
                MODE: process.env.NODE_ENV,
            }
        },
    )
}

const Document = ({children})=> {
    return (
        <html>
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta />
            <Meta/>
            <Links/>
        </head>
        <body>
        {children}
        <Scripts/>
        </body>
        </html>
    );
}

const App = () => {
    const loaderData = useLoaderData()
    const ENV =  loaderData?.ENV
    if(loaderData.message){
        toast(loaderData.message)
        loaderData.message = undefined
    }
    return (
        <Document>
            <script
                dangerouslySetInnerHTML={{
                    __html: `window.ENV=${JSON.stringify(ENV)}`
                }}
            />
            <Toaster />
            <Outlet/>
        </Document>
    );
}

export function ErrorBoundary() {
    const error = useRouteError()
    return (
        <Document>
            <div>
                {error.message}
            </div>
        </Document>
    );
}
