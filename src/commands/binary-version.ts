import { exec } from 'child_process';
import { converterBinary } from '../util';
import { window } from 'vscode';

export default async function binaryVersion(): Promise<void> {
    const binary = await converterBinary();
    const cmd = `${binary} -version`;

    const version = await new Promise<string>((resolve, reject) => {
		exec(cmd, null, (error, stdout) => {
			if (error) {
				reject(error);
			}
			else {
				resolve(stdout.toString('utf8'));
			}
		});
	});

    const msg = `libwebp: ${version.trim()}\n\nInstalled at: \n${binary}`;
    window.showInformationMessage(msg, {
        modal: true
    });
}
