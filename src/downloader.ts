import axios from 'axios';
import { Element, load } from 'cheerio';
import { createWriteStream } from 'fs';
import { rm } from 'fs/promises';
import { basename } from 'path';
import { rcompare } from 'semver';
import { Stream } from 'stream';
import { ExtensionContext } from 'vscode';
import { REGEX_FILENAME, URL_FILE_INDEX } from './constants';
import { AxiosProgressCallback, Version } from './types';
import { dataDirectory, platformMatches } from './util';
import decompress = require('decompress');

let versionsCache: Version[] | null = null;

export async function loadVersions(): Promise<Version[]> {
    if (versionsCache !== null) {
        return versionsCache;
    }

    const response = await axios.get<string>(URL_FILE_INDEX);
    const $ = load(response.data);

    const links = $('pre a');
    const mapped = links.map<Element, Version>(function () {
        return {
            name: (this.children[0] as any).data,
            url: this.attribs['href'],
            platform: '',
            arch: '',
        };
    })
        .toArray()
        .map<Version | null>(el => {
            const matches = REGEX_FILENAME.exec(el.name);

            if (matches === null) {
                return null;
            }

            return {
                name: matches[1],
                platform: matches[2],
                arch: matches[3],
                url: el.url,
            };
        })
        .filter(el => el !== null)
        .filter(platformMatches)
        .sort((a, b) => rcompare(a!.name, b!.name));

    versionsCache = mapped as Version[];
    return versionsCache;
}

export async function install(context: ExtensionContext, version: Version, onDownloadProgress: AxiosProgressCallback): Promise<void> {
    const filename = basename(version.url);
    const output = await dataDirectory(context, filename);

    const response = await axios.get(version.url, {
        responseType: 'stream',
        onDownloadProgress,
    });

    await new Promise<void>((resolve, reject) => {
        const stream = response.data as Stream;
        stream.pipe(createWriteStream(output));

        stream.once('end', () => resolve());
        stream.once('error', error => reject(error));
    });

    await decompress(output, await dataDirectory(context, 'libwebp'), {
        strip: 1,
    });
    await rm(output);
}
