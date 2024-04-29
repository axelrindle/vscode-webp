import { ExtensionContext, window } from 'vscode'
import init from '../init'
import { testForConverter } from '../util'

export default async function downloadBinary(context: ExtensionContext): Promise<void> {
    try {
        await testForConverter(context)
        window.showInformationMessage('libwebp is already installed.')
    } catch (error) {
        window.showInformationMessage('Installing libwebp...')
        await init(context)
    }
}
