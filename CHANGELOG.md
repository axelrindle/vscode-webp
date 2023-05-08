# Change Log

All notable changes to the "webp-converter" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to
structure this file.

## Unreleased

## [v0.4.0](https://github.com/axelrindle/vscode-webp/releases/tag/v0.4.0) - 2023-05-08

### Changed

- The libwebp binaries are now stored in a global location which eliminates the need to
reinstall the binaries after every extension update.

## [v0.3.0](https://github.com/axelrindle/vscode-webp/releases/tag/v0.3.0) - 2023-05-06

### Added

- Support for `.tif` extension ([#3](https://github.com/axelrindle/vscode-webp/pull/3))

### Fixed

- Extension crash for files containing a space in it's name
([#3](https://github.com/axelrindle/vscode-webp/pull/3))

## [v0.2.0](https://github.com/axelrindle/vscode-webp/releases/tag/v0.2.0) - 2023-04-12

### Added

- Binary Download: Instead of relying on the `cwebp` binary being installed on the system, the
extension will now download a binary itself.

- Prefer System Binary: A user may configure to prefer a binary found on the system. The default
is to use the downloaded binary.

- Convert multiple files at once.


## [v0.1.0](https://github.com/axelrindle/vscode-webp/releases/tag/v0.1.0) - 2023-03-17

- Initial release 🎉
