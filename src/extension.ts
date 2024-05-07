import { commands, ExtensionContext, window } from 'vscode'
import binaryVersionCommand from './commands/binary-version'
import { decodeCommand, encodeCommand } from './commands/convert'
import deleteBinaryCommand from './commands/delete-binary'
import downloadBinaryCommand from './commands/download-binary'
import { Context } from './types'

export const EXTENSION_ID = 'webp-converter'

export async function activate(extensionContext: ExtensionContext) {
    const context: Context = {
        extension: extensionContext,
        channel: window.createOutputChannel('WebP')
    }

    const {
        subscriptions,
    } = extensionContext

    subscriptions.push(commands.registerCommand(`${EXTENSION_ID}.convert.to`, args => encodeCommand(context, args)))
    subscriptions.push(commands.registerCommand(`${EXTENSION_ID}.convert.from`, args => decodeCommand(context, args)))
    subscriptions.push(commands.registerCommand(`${EXTENSION_ID}.download-binary`, () => downloadBinaryCommand(context)))
    subscriptions.push(commands.registerCommand(`${EXTENSION_ID}.delete-binary`, () => deleteBinaryCommand(context)))
    subscriptions.push(commands.registerCommand(`${EXTENSION_ID}.binary-version`, () => binaryVersionCommand(context)))
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() { }
