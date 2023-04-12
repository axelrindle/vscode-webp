<img src="logo.png" align="right" width="128">

# webp-converter

[![CI](https://github.com/axelrindle/vscode-webp/actions/workflows/main.yml/badge.svg)](https://github.com/axelrindle/vscode-webp/actions/workflows/main.yml)
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/axelrindle.webp-converter)](https://marketplace.visualstudio.com/items?itemName=axelrindle.webp-converter)

> VSCode Extension for converting images into the WebP format.

Easily convert PNG, JPG and TIFF files into a [WebP file](https://developers.google.com/speed/webp).

## Usage

Right-click a PNG, JPG/JPEG or TIFF file and click on `Convert to WebP`.

In it's current state the extension will run the following command:

```shell
cwebp -preset photo <input> -o <output>.webp
```

## Commands

### `webp-converter.execute`

Does the file conversion. Access via file explorer.

### `webp-converter.binary-version`

Shows information about the installed binary.

### `webp-converter.download-binary`

Will download the chosen version of libwebp if no installation is present.

### `webp-converter.delete-binary`

Deletes the installed binary.

Use this if you want to install another version.

## Settings

### `webp-converter.preferSystemBinary`

Will use a globally available binary of cwebp if available.

## TODO

- Support flags like `-preset`, `-z` and `-m`

## License

[MIT](LICENSE)

## Acknowledgements

- Logo generated using [IconKitchen](https://icon.kitchen/i/H4sIAAAAAAAAAzVQQW7DIBD8y%2FaKKtsktexr1Hul%2BlZV1RoW2yoOLoa4UZS%2FZyEJF0bDzswyFzihjbRCewGN%2FrcbaSZoDdqVBJjhYKcFfUjPK%2FEFmgxGG0DApNyRCYUzefxB5q5J0Z0XNgD1EAroh4OzzjP3Uku1r%2FaZ%2Bxwxz61%2FET1lqqP%2FEBlzVnhC2PDE2wlOJw1t8Vo0sizLt7qumkbKndwJUE97mc99jQ%2FUejoO2cwt0FaFAD8NI%2F8hwd6F4OY7tmQym3XvxpAK3AesI2q3cXRInXB4LoWHZqejTZV9wUY9fF9vV%2BtssUUBAAA%3D)
