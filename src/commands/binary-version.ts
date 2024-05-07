import { exec } from 'child_process'
import { window } from 'vscode'
import { preferSystemBinary } from '../settings'
import { Context } from '../types'
import { converterBinary, testForConverter } from '../util'
import { doDownloadBinary } from './download-binary'

export default async function binaryVersion(context: Context): Promise<void> {
    const isInstalled = await testForConverter(context)
    if (!isInstalled) {
        await doDownloadBinary(context)
    }

    const binary = await converterBinary(context, 'encode')
    const cmd = `${binary} -version`

    const version = await new Promise<string>((resolve, reject) => {
        exec(cmd, null, (error, stdout) => {
            if (error) {
                reject(error)
            }
            else {
                resolve(stdout.toString('utf8'))
            }
        })
    })

    const msg = [
        `libwebp: ${version.trim()}`,
        `Installed at: \n${binary}`,
        `Using system binary: ${preferSystemBinary() ? 'yes' : 'no'}`
    ].join('\n\n')
    window.showInformationMessage(msg, {
        modal: true
    })
}
