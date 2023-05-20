import { ExecOptions, exec } from 'child_process';
import { randomBytes } from 'crypto';
import { basename, dirname, join } from 'path';
import { ExtensionContext, FileType, ProgressLocation, Uri, window, workspace } from 'vscode';
import { commandArgsToUris, converterBinary } from '../util';
import { ConversionOptions, IdentifyableQuickPickItem } from '../types';
import { config } from '../settings';

const ID_USE_DEFAULTS = 1;
const ID_CUSTOMIZE = 2;

function optionsFromDefaults(): ConversionOptions {
    const conf = config();
    return {
        preset: conf.get('defaults.preset') || undefined,
        quality: conf.get('defaults.quality'),
        alphaQuality: conf.get('defaults.alphaQuality'),
        compression: conf.get('defaults.compression'),
    };
}

function buildCommandOptionString(options: ConversionOptions): string {
    const result: string[] = [];

    /**
     * Adds the given command parameter if the value is not undefined
     * @param param
     * @param value
     */
    function push(param: string, value: any | (() => any)) {
        if (value === undefined) {
            return;
        }

        let _value: any = value;
        if (typeof value === 'function') {
            _value = value();
        }

        if (_value === undefined) {
            return;
        }

        result.push(`-${param} ${_value}`);
    }

    push('preset', options.preset);
    push('q', options.quality);
    push('alpha_q', options.alphaQuality);
    push('m', options.compression);

    return result.join(' ');
}

async function doConvert(context: ExtensionContext, directory: string, file: string, options: ConversionOptions): Promise<void> {
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
        }
    } catch (error) {
        // ignore ¯\_(ツ)_/¯
    }

    const cmdOptions = buildCommandOptionString(options);
    const cmd = `${await converterBinary(context)} ${cmdOptions} "${directory}/${file}" -o "${fileNew}"`;
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

export default async function convert(context: ExtensionContext, ...args: any[]): Promise<void> {
    const uris = commandArgsToUris(args);

    const items: IdentifyableQuickPickItem[] = [
        {
            id: ID_USE_DEFAULTS,
            label: 'Use Defaults',
            detail: 'Uses the default settings configured in the VSCode settings.',
            picked: true,
        },
        {
            id: ID_CUSTOMIZE,
            label: 'Customize Settings',
            detail: 'Allows you to customize the settings for this conversion only.',
        },
    ];
    const pick = await window.showQuickPick(items, {
        title: 'Choose Mode',
        canPickMany: false,
    });
    if (pick === undefined) {
        window.showErrorMessage('Conversion canceled!');
        return;
    }
    let options: ConversionOptions;
    switch (pick.id) {
        case ID_USE_DEFAULTS:
            options = optionsFromDefaults();
            break;
        case ID_CUSTOMIZE: // TODO: Customization
            options = optionsFromDefaults();
            window.showInformationMessage('Settings customization is a work-in-progress.');
            break;
        default:
            window.showErrorMessage(`Invalid option #${pick.id}!`);
            return;
    }

    await window.withProgress({
        location: ProgressLocation.Notification,
        cancellable: false,
        title: `Converting ${uris.length} file(s) into WebP...`
    }, async (progress) => {
        for (const uri of uris) {
            const { fsPath } = uri;
            const directory = dirname(fsPath);
            const filename = basename(fsPath);

            const increment = 100 / uris.length;

            try {
                await doConvert(context, directory, filename, options);
                progress.report({ increment });
            } catch (error: any) {
                window.showErrorMessage(`Failed to convert ${filename} into a WebP file!`, {
                    detail: error.message
                });
                console.error(error);
            }
        }
    });
}
