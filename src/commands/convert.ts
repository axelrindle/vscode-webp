import { ExecOptions, exec } from 'child_process';
import { randomBytes } from 'crypto';
import { basename, dirname, join } from 'path';
import { FileType, Progress, ProgressLocation, Uri, window, workspace } from 'vscode';
import { converterBinary } from '../util';

async function doConvert(directory: string, file: string, progress: Progress<any>): Promise<void> {
	let filename: string = file.split('.')[0];
	if (!filename) {
		filename = 'webp-converted-' + randomBytes(4).toString('hex');
	}

	const fileNew = filename + ".webp";
	try {
		const stats = await workspace.fs.stat(Uri.file(join(directory, fileNew)));
		if (stats.type === FileType.File || stats.type === FileType.SymbolicLink) {
			const answer = await window.showQuickPick(['Yes', 'No'], {
				title: `The file ${fileNew} does already exist. Overwrite?`,
				canPickMany: false,
				ignoreFocusOut: true,
			});

			if (answer !== 'Yes') {
				window.showInformationMessage('WebP convertion canceled.');
				return;
			}

			progress.report({ increment: 10 });
		}
	} catch (error) {
		// ignore ¯\_(ツ)_/¯
	}

	const cmd = `${await converterBinary()} -preset photo ${directory}/${file} -o ${fileNew}`;
	const opts: ExecOptions = {
		cwd: directory,
		timeout: 30000 // TODO: Make timeout configurable
	};
	return new Promise((resolve, reject) => {
		exec(cmd, opts, error => {
			if (error) {
				reject(error);
			}
			else {
				resolve();
			}
		});
	});
}

export default async function convert(uri: Uri): Promise<void> {
    const { fsPath } = uri;
    const directory = dirname(fsPath);
    const file = basename(fsPath);

    window.withProgress({
        location: ProgressLocation.Notification,
        cancellable: false,
        title: `Converting ${file} into WebP...`
    }, async (progress) => {
        try {
            progress.report({ increment: 10 });
            await doConvert(directory, file, progress);
            progress.report({ increment: 100 });
        } catch (error: any) {
            window.showErrorMessage(`Failed to convert ${file} into a WebP file!`, {
                detail: error.message
            });
            console.error(error);
        }
    });
}