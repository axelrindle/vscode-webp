import { exec } from 'child_process';
import { access, mkdir, rm } from 'fs/promises';
import { dirname, join } from 'path';
import { preferSystemBinary } from './settings';
import { Version } from './types';
import { Uri } from 'vscode';

export async function dataDirectory(...relatives: string[]): Promise<string> {
    const dir = join(dirname(__dirname), '_data');
    try {
        await access(dir);
    } catch (error) {
        await mkdir(dir);
    }

    return join(dir, ...relatives);
}

export async function converterBinary(): Promise<string> {
    if (preferSystemBinary()) {
        try {
            await new Promise<void>((resolve, reject) => {
                exec('cwebp', err => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
            return 'cwebp';
        } catch (error) {
            // ¯\_(ツ)_/¯
        }
    }

    return await dataDirectory('libwebp', 'bin', 'cwebp');
}

export async function clearData(): Promise<void> {
    await rm(await dataDirectory(), {
        recursive: true,
        force: true,
    });
}

export async function testForConverter(): Promise<void> {
    const binary = await converterBinary();
    return new Promise((resolve, reject) => {
        exec(binary, error => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}

export function platformMatches(version: Version | null): boolean {
    if (version === null) {
        return false;
    }

    switch (process.platform) {
        case 'linux':
            return version.platform === 'linux';
        case 'win32':
            return version.platform === 'windows';
        case 'darwin':
            return version.platform === 'mac';
        default:
            return false;
    }
}

export function commandArgsToUris(args: any[]): Uri[] {
	switch (args.length) {
		case 1:
			return [args[0]];
		case 2:
			return args[1];
		default:
			return [];
	}
}
