import { commands, ExtensionContext } from 'vscode';
import binaryVersion from './commands/binary-version';
import convert from './commands/convert';
import deleteBinary from './commands/delete-binary';
import downloadBinary from './commands/download-binary';
import { checkExtensionVersion } from './commands/version-check';
import { precheck } from './init';

export async function activate(context: ExtensionContext) {
    await checkExtensionVersion(context);

    await precheck(context);

    context.subscriptions.push(commands.registerCommand('webp-converter.execute', args => convert(context, args)));
    context.subscriptions.push(commands.registerCommand('webp-converter.download-binary', () => downloadBinary(context)));
    context.subscriptions.push(commands.registerCommand('webp-converter.delete-binary', () => deleteBinary(context)));
    context.subscriptions.push(commands.registerCommand('webp-converter.binary-version', () => binaryVersion(context)));
    context.subscriptions.push(commands.registerCommand('webp-converter.check-extension-version', () => checkExtensionVersion(context, true)));
}

export function deactivate() { }
