import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";


export const loader = async ({request}) => {
    const session = await getSession(request.headers.get("cookie"));
    return json({
            ENV: {
                MODE: process.env.NODE_ENV,
            }
        },
    )
}

function Document({children}) {
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


export default function App() {
    return <Outlet/>;
}
