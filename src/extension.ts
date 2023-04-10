import { exec, ExecOptions } from 'child_process';
import { randomBytes } from 'crypto';
import { basename, dirname, join } from 'path';
import { commands, ExtensionContext, FileType, Progress, ProgressLocation, QuickPickItem, Uri, window, workspace } from 'vscode';
import { install, loadVersions } from './downloader';
import { clearData, testForConverter } from './util';
import { Version } from './types';

async function init() {
	try {
		await testForConverter();
		return;
	} catch (error) {
		window.showInformationMessage('WebP Converter not found. Installing...');
	}

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
		await install(version, event => progress.report({ increment: event.progress }));
	});
}

async function convert(directory: string, file: string, progress: Progress<any>): Promise<void> {
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

	const cmd = `cwebp -preset photo ${directory}/${file} -o ${fileNew}`;
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

export async function activate(context: ExtensionContext) {
	await init();

	let cmdExecute = commands.registerCommand('webp-converter.execute', async (uri: Uri) => {
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
				await convert(directory, file, progress);
				progress.report({ increment: 100 });
			} catch (error: any) {
				window.showErrorMessage(`Failed to convert ${file} into a WebP file!`, {
					detail: error.message
				});
				console.error(error);
			}
		});
	});

	let cmdDeleteBinary = commands.registerCommand('webp-converter.delete-binary', async () => {
		await clearData();
		window.showInformationMessage('WebP Converter binaries cleared.');
	});

	context.subscriptions.push(cmdExecute);
	context.subscriptions.push(cmdDeleteBinary);
}

export function deactivate() {}
