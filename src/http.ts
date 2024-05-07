import { createWriteStream } from 'fs'
import { IncomingHttpHeaders } from 'http'
import { get as httpsGet } from 'https'

export interface Response<T = undefined> {
    data: T
    headers: IncomingHttpHeaders
    status: number
    statusText: string
}

export function get(url: string): Promise<Response<string>> {
    return new Promise((resolve, reject) => {
        const request = httpsGet(url, res => {
            const data: Buffer[] = []
            res.on('data', (chunk: Buffer) => data.push(chunk))
            res.once('close', () => resolve({
                data: data.map(b => b.toString('utf8')).join(''),
                headers: res.headers,
                status: res.statusCode ?? -1,
                statusText: res.statusMessage ?? 'Unknown',
            }))
        })

        request.once('error', err => reject(err))
    })
}

export type ProgressCallback = (progress: number) => void

export function download(url: string, file: string, onProgress: ProgressCallback): Promise<Response> {
    return new Promise((resolve, reject) => {
        httpsGet(url, res => {
            const length = res.headers['content-length']

            if (length) {
                let total = 0
                const size = parseInt(length)
                res.on('data', (chunk: Buffer) => {
                    total += chunk.byteLength
                    onProgress(total / size)
                })
            }

            const writer = createWriteStream(file)

            res.pipe(writer, {
                end: false,
            })

            res.on('end', () => {
                writer.close(err => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve({
                            data: undefined,
                            headers: res.headers,
                            status: res.statusCode ?? -1,
                            statusText: res.statusMessage ?? 'Unknown',
                        })
                    }
                })
            })
        })
    })
}
