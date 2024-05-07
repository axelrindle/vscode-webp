import { window } from 'vscode'
import { Context } from '../types'
import { clearData } from '../util'

export default async function deleteBinary(context: Context): Promise<void> {
    await clearData(context)

    window.showInformationMessage('libwebp binaries cleared.')
}
