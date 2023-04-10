import { commands, ExtensionContext } from 'vscode';
import binaryVersion from './commands/binary-version';
import convert from './commands/convert';
import deleteBinary from './commands/delete-binary';
import init from './init';

export async function activate(context: ExtensionContext) {
    await init();

    context.subscriptions.push(commands.registerCommand('webp-converter.execute', convert));
    context.subscriptions.push(commands.registerCommand('webp-converter.delete-binary', deleteBinary));
    context.subscriptions.push(commands.registerCommand('webp-converter.binary-version', binaryVersion));
}

export function deactivate() { }
