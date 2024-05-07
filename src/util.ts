import { exec } from 'child_process'
import { rm } from 'fs/promises'
import { join } from 'path'
import { FileType, Uri, workspace } from 'vscode'
import { preferSystemBinary } from './settings'
import { Context, ConversionMode, Version } from './types'

export async function dataDirectory(context: Context, ...relatives: string[]): Promise<string> {
    const dir = context.extension.globalStorageUri
    try {
        const stats = await workspace.fs.stat(dir)
        if (stats.type !== FileType.Directory) {
            await workspace.fs.delete(dir, {
                recursive: true,
                useTrash: false
            })
        }
        throw new Error('Directory not found!')
    } catch (error) {
        await workspace.fs.createDirectory(dir)
    }

    return join(dir.fsPath, ...relatives)
}

export async function converterBinary(context: Context, mode: ConversionMode): Promise<string> {
    if (preferSystemBinary()) {
        try {
            await new Promise<void>((resolve, reject) => {
                exec('cwebp', err => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve()
                    }
                })
            })
            switch (mode) {
            case 'encode':
                return 'cwebp'
            case 'decode':
                return 'dwebp'
            default:
                throw new Error(`invalid mode ${mode}!`)
            }
        } catch (error) {
            // ¯\_(ツ)_/¯
        }
    }

    return await dataDirectory(context, 'libwebp', 'bin', 'cwebp')
}

export async function clearData(context: Context): Promise<void> {
    await rm(await dataDirectory(context), {
        recursive: true,
        force: true,
    })
}

export async function testForConverter(context: Context): Promise<boolean> {
    const binary = await converterBinary(context, 'encode') // TODO: Test both?
    return new Promise(resolve => {
        exec(binary, error => {
            if (error) {
                resolve(false)
            }
            else {
                resolve(true)
            }
        })
    })
}

export function platformMatches(version: Version | null): boolean {
    if (version === null) {
        return false
    }

    switch (process.platform) {
    case 'linux':
        return version.platform === 'linux'
    case 'win32':
        return version.platform === 'windows'
    case 'darwin':
        return version.platform === 'mac'
    default:
        return false
    }
}

export function commandArgsToUris(args: any[]): Uri[] {
    switch (args.length) {
    case 1:
        return [args[0]]
    case 2:
        return args[1]
    default:
        return []
    }
}
