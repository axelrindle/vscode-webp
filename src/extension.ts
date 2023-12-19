import { commands, ExtensionContext } from 'vscode';
import binaryVersion from './commands/binary-version';
import { decode, encode } from './commands/convert';
import deleteBinary from './commands/delete-binary';
import downloadBinary from './commands/download-binary';
import { precheck } from './init';

export async function activate(context: ExtensionContext) {
    await precheck(context);

    context.subscriptions.push(commands.registerCommand('webp-converter.convert.to', args => encode(context, args)));
    context.subscriptions.push(commands.registerCommand('webp-converter.convert.from', args => decode(context, args)));

    context.subscriptions.push(commands.registerCommand('webp-converter.download-binary', () => downloadBinary(context)));
    context.subscriptions.push(commands.registerCommand('webp-converter.delete-binary', () => deleteBinary(context)));
    context.subscriptions.push(commands.registerCommand('webp-converter.binary-version', () => binaryVersion(context)));
}

export function deactivate() { }
