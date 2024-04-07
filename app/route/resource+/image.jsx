import {PassThrough} from "node:stream"
import {createReadableStreamFromReadable} from "@remix-run/node"
import {stringIsAValidUrl} from "app/server/util/utilFunction.js";
import {
    defaultQuality,
    image_server,
    widths,
    mainImageReadStream,
    generatedImageReadstream,
    isThereImage,
    BadImageResponse,
} from "app/server/image.server.js"

export const loader = async ({request}) => {
    const url = new URL(request.url);
    let src = url.searchParams.get("src");
    const width = url.searchParams.get("w") || 200;
    if (!stringIsAValidUrl(src)) {
        src = image_server + src
    }
    if (!src) {
        return BadImageResponse();
    }
    try {
        if (!await isThereImage(src)) {
            for (const width of widths) {
                await generatedImageReadstream(await mainImageReadStream(src), src, width, defaultQuality)
            }
        }
        const {
            size,
            fileStream,
            hash
        } = await generatedImageReadstream(await mainImageReadStream(src), src, width, defaultQuality)
        const body = new PassThrough()
        const stream = fileStream
        stream.on('error', err => body.end(err))
        stream.on('end', () => body.end())
        stream.pipe(body)
        return new Response(createReadableStreamFromReadable(body), {
            status: 200,
            headers: {
                'content-type': 'image/webp',
                'content-length': String(size),
                'content-disposition': `inline; filename="${hash}.webp"`,
                'cache-control': 'public, max-age=31536000, immutable',
            },
        })
    } catch (e) {
        console.log(e)
        console.log("error happend")
        return BadImageResponse();
    }
}


