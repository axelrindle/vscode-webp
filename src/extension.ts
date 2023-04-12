import { commands, ExtensionContext, window } from 'vscode';
import binaryVersion from './commands/binary-version';
import convert from './commands/convert';
import deleteBinary from './commands/delete-binary';
import downloadBinary from './commands/download-binary';
import init from './init';
import { testForConverter } from './util';

export async function activate(context: ExtensionContext) {
    try {
        await testForConverter();
    } catch (error) {
        window.showInformationMessage('Installing libwebp...');
        await init();
    }

    context.subscriptions.push(commands.registerCommand('webp-converter.execute', convert));
    context.subscriptions.push(commands.registerCommand('webp-converter.download-binary', downloadBinary));
    context.subscriptions.push(commands.registerCommand('webp-converter.delete-binary', deleteBinary));
    context.subscriptions.push(commands.registerCommand('webp-converter.binary-version', binaryVersion));
}

export function deactivate() { }
