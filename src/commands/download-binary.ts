import { window } from 'vscode';
import init from '../init';
import { testForConverter } from '../util';

export default async function downloadBinary(): Promise<void> {
    try {
        await testForConverter();
        window.showInformationMessage('libwebp is already installed.');
    } catch (error) {
        window.showInformationMessage('Installing libwebp...');
        await init();
    }
}
