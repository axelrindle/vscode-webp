import { ExtensionContext, window } from 'vscode';
import { clearData } from '../util';

export default async function deleteBinary(context: ExtensionContext): Promise<void> {
    await clearData();
    window.showInformationMessage('WebP Converter binaries cleared.');
}
