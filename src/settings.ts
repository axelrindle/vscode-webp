import { WorkspaceConfiguration, workspace } from 'vscode';

function config(): WorkspaceConfiguration {
    return workspace.getConfiguration('webp-converter');
}

export function preferSystemBinary(): boolean {
    return config().get('preferSystemBinary') ?? false;
}
