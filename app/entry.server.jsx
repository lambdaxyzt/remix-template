import  "root/env/init.js";
// @ts-ignore
import isbot from "isbot";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToPipeableStream } from "react-dom/server";
import { MongoClient } from 'mongodb';

const ABORT_DELAY = 5_000;

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

export async function connectToDatabase() {
  return client.db('lologs');
}

export default function handleRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext,
    loadContext,
) {
    return isbot(request.headers.get("user-agent"))
        ? handleBotRequest(
            request,
            responseStatusCode,
            responseHeaders,
            remixContext
        )
        : handleBrowserRequest(
            request,
            responseStatusCode,
            responseHeaders,
            remixContext
        );
}

function handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext,
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;
        const { pipe, abort } = renderToPipeableStream(
            <RemixServer
                context={remixContext}
                url={request.url}
                abortDelay={ABORT_DELAY}
            />,
            {
                onAllReady() {
                    shellRendered = true;
                    const body = new PassThrough();
                    const stream = createReadableStreamFromReadable(body);

                    responseHeaders.set("Content-Type", "text/html");

                    resolve(
                        new Response(stream, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        })
                    );

                    pipe(body);
                },
                onShellError(error) {
                    reject(error);
                },
                onError(error) {
                    responseStatusCode = 500;
                    // Log streaming rendering errors from inside the shell.  Don't log
                    // errors encountered during initial shell rendering since they'll
                    // reject and get logged in handleDocumentRequest.
                    if (shellRendered) {
                        console.error(error);
                    }
                },
            }
        );
        setTimeout(abort, ABORT_DELAY);
    });
}

function handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext,
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;
        const { pipe, abort } = renderToPipeableStream(
            <RemixServer
                context={remixContext}
                url={request.url}
                abortDelay={ABORT_DELAY}
            />,
            {
                onShellReady() {
                    shellRendered = true;
                    const body = new PassThrough();
                    const stream = createReadableStreamFromReadable(body);

                    responseHeaders.set("Content-Type", "text/html");

                    resolve(
                        new Response(stream, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        })
                    );

                    pipe(body);
                },
                onShellError(error) {
                    reject(error);
                },
                onError(error) {
                    responseStatusCode = 500;
                    // Log streaming rendering errors from inside the shell.  Don't log
                    // errors encountered during initial shell rendering since they'll
                    // reject and get logged in handleDocumentRequest.
                    if (shellRendered) {
                        console.error(error);
                    }
                },
            }
        );

        setTimeout(abort, ABORT_DELAY);
    });
}
