import { WorkspaceConfiguration, workspace } from 'vscode';

export function config(): WorkspaceConfiguration {
    return workspace.getConfiguration('webp-converter');
}

export function preferSystemBinary(): boolean {
    return config().get('preferSystemBinary') ?? false;
}
