import { ExtensionContext, ProgressLocation, QuickPickItem, window } from 'vscode';
import { install, loadVersions } from './downloader';
import { AxiosProgressCallback, Version } from './types';

export default async function init(context: ExtensionContext) {
    const versions = await loadVersions();
    const choice = await window.showQuickPick(
        versions.map<QuickPickItem>((el, index) => ({
            label: el.name,
            description: el.arch,
            picked: index === 0,
        })),
        {
            title: 'Select a libwebp version to use.',
        }
    );

    if (choice === undefined) {
        window.showErrorMessage('Installation canceled by user!');
        return;
    }

    const version = versions.find(el => el.name === choice.label && el.arch === choice.description) as Version;
    await window.withProgress({
        location: ProgressLocation.Notification,
        cancellable: false,
        title: `Installing libwebp v${version?.name}`
    }, async (progress) => {
        const callback: AxiosProgressCallback =
            event => progress.report({ increment: event.progress });
        await install(context, version, callback);
    });
}
