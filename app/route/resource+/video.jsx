import {PassThrough} from "node:stream"
import {image_server} from "app/server/image.server.js";
import {createReadableStreamFromReadable} from "@remix-run/node";
import {stringIsAValidUrl} from "app/server/util/utilFunction.js";
import {mainVideoReadStream, BadVideoResponse} from "app/server/video.server.js";

export const loader = async ({request}) => {
    const url = new URL(request.url);
    let src = url.searchParams.get("src");
    if (!stringIsAValidUrl(src)) {
        src = image_server + src
    }
    if (!src) {
        return BadVideoResponse();
    }
    try {
        const {size, fileStream, hash} = await mainVideoReadStream(src)
        const body = new PassThrough()
        const stream = fileStream
        stream.on('error', err => body.end(err))
        stream.on('end', () => body.end())
        stream.pipe(body)
        return new Response(createReadableStreamFromReadable(body), {
            status: 200,
            headers: {
                'content-type': 'video/webm',
                'content-length': String(size),
                'content-disposition': `inline; filename="${hash}.webm"`,
                'cache-control': 'public, max-age=31536000, immutable',
            },
        })
    } catch (e) {
        console.log(e)
        console.log("error happend")
        return BadVideoResponse();
    }
}


