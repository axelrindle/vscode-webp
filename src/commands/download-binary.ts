import decompress from 'decompress'
import { rm } from 'fs/promises'
import { JSDOM } from 'jsdom'
import { basename, sep } from 'path'
import { rcompare } from 'semver'
import { ProgressLocation, QuickPickItem, window } from 'vscode'
import { REGEX_FILENAME, URL_FILE_INDEX } from '../constants'
import { ProgressCallback, download, get } from '../http'
import { Context, Version } from '../types'
import { dataDirectory, platformMatches, testForConverter } from '../util'

let versionsCache: Version[] | null = null

async function loadVersions(context: Context): Promise<Version[]> {
    if (versionsCache !== null) {
        return versionsCache
    }

    const response = await get(URL_FILE_INDEX)
    if (response.status !== 200) {
        context.channel.appendLine(`[ERROR] ${response.statusText}`)
        context.channel.appendLine(response.data)
        context.channel.appendLine('')
        context.channel.show(true)
        throw new Error(`Error: ${response.statusText}. View the output pane "WebP" for more information.`)
    }

    const $ = new JSDOM(response.data)

    const links = $.window.document.querySelectorAll('pre a')
    const versions: Version[] = []

    links.forEach(e => {
        versions.push({
            name: e.firstChild?.textContent ?? 'Unknown',
            url: e.getAttribute('href') ?? 'Unknown',
            platform: '',
            arch: '',
        })
    })

    const mapped = versions.map<Version | null>(el => {
        const matches = REGEX_FILENAME.exec(el.name)

        if (matches === null) {
            return null
        }

        return {
            name: matches[1],
            platform: matches[2],
            arch: matches[3],
            url: 'https:' + el.url,
        }
    })
        .filter(el => el !== null)
        .filter(platformMatches)
        .sort((a, b) => rcompare(a!.name, b!.name))

    context.channel.appendLine(`Found versions: ${JSON.stringify(mapped, null, 4)}`)

    versionsCache = mapped as Version[]
    return versionsCache
}

async function install(context: Context, version: Version, onDownloadProgress: ProgressCallback): Promise<void> {
    const filename = basename(version.url)
    const file = await dataDirectory(context, filename)

    context.channel.appendLine(`Downloading ${version.url} to ${file}`)

    await download(version.url, file, onDownloadProgress)

    const targetDirectory = await dataDirectory(context, 'libwebp')

    await decompress(file, targetDirectory, {
        map(file) {
            file.path = file.path.split(sep).slice(1).join(sep)
            return file
        },
    })

    await rm(file)
}

export async function doDownloadBinary(context: Context) {
    const versions = await loadVersions(context)
    const choice = await window.showQuickPick(
        versions.map<QuickPickItem>((el, index) => ({
            label: el.name,
            description: el.arch,
            picked: index === 0,
        })),
        {
            title: 'Select a libwebp version to use.',
            ignoreFocusOut: true,
        }
    )

    if (choice === undefined) {
        window.showErrorMessage('Installation canceled by user!')
        return
    }

    const version = versions.find(el => el.name === choice.label && el.arch === choice.description) as Version
    await window.withProgress({
        location: ProgressLocation.Notification,
        cancellable: false,
        title: `Installing libwebp v${version?.name}`
    }, async (progress) => {
        const callback: ProgressCallback = p => progress.report({ message: (p * 100).toPrecision(2) + ' %' })
        await install(context, version, callback)
    })
}

export default async function downloadBinaryCommand(context: Context): Promise<void> {
    const isInstalled = await testForConverter(context)

    if (isInstalled) {
        window.showInformationMessage('libwebp is already installed.')
        return
    }

    await doDownloadBinary(context)
}
