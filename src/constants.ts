export const PRESETS = [
    'default',
    'photo',
    'picture',
    'drawing',
    'icon',
    'text',
];

export const COMPRESSION = [
    0, 1, 2, 3, 4, 5, 6
];

export const URL_FILE_INDEX = 'https://storage.googleapis.com/downloads.webmproject.org/releases/webp/index.html';
export const REGEX_FILENAME = /^(?:libwebp)-([0-9]+\.[0-9]+\.[0-9]+)-(windows|linux|mac){1}(?:-)?(.*)(?:\.tar\.gz|\.zip)$/g;

/*
libwebp-0.4.2-linux-x86-32.tar.gz
libwebp-0.4.2-linux-x86-64.tar.gz
libwebp-0.4.2-windows-x64.zip
libwebp-0.4.2-windows-x86.zip
libwebp-0.4.2-mac-10.8.tar.gz
libwebp-0.4.2-rc2-windows-x86.zip 
*/
