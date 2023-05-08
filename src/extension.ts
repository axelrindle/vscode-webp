import { commands, ExtensionContext, window } from 'vscode';
import binaryVersion from './commands/binary-version';
import convert from './commands/convert';
import deleteBinary from './commands/delete-binary';
import downloadBinary from './commands/download-binary';
import init from './init';
import { testForConverter } from './util';

export async function activate(context: ExtensionContext) {
    try {
        await testForConverter(context);
    } catch (error) {
        window.showInformationMessage('Installing libwebp...');
        await init(context);
    }

    context.subscriptions.push(commands.registerCommand('webp-converter.execute', args => convert(context, args)));
    context.subscriptions.push(commands.registerCommand('webp-converter.download-binary', () => downloadBinary(context)));
    context.subscriptions.push(commands.registerCommand('webp-converter.delete-binary', () => deleteBinary(context)));
    context.subscriptions.push(commands.registerCommand('webp-converter.binary-version', () => binaryVersion(context)));
}

export function deactivate() { }
