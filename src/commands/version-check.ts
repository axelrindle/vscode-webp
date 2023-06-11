import versionCheck from '@version-checker/core';
import { ExtensionContext, authentication, window } from 'vscode';

export async function checkExtensionVersion(context: ExtensionContext, showNone: boolean = false): Promise<void> {
    let githubToken: string|undefined = undefined;
    try {
        const auth = await authentication.getSession('github', []);
        githubToken = auth?.accessToken;
    } catch (error) {
        // ¯\_(ツ)_/¯
    }

    const { update } = await versionCheck({
        owner: 'axelrindle',
        repo: 'vscode-webp',
        currentVersion: context.extension.packageJSON.version,
        excludePrereleases: true,
        token: githubToken,
    });
    if (update) {
        window.showInformationMessage(`An update to vscode-webp is available: ${update?.name}`);
    }
    else if (showNone) {
        window.showInformationMessage('No updates available for vscode-webp.');
    }
}
