import { ExtensionContext, OutputChannel, QuickPickItem } from 'vscode'
import { COMPRESSION, PRESETS } from './constants'

export interface Context {
    extension: ExtensionContext
    channel: OutputChannel
}

export interface Version {
    name: string
    url: string
    platform: string
    arch: string
}

export interface IdentifyableQuickPickItem extends QuickPickItem {
    id: number
}

export interface ConversionOptions {
    preset?: typeof PRESETS
    quality?: number
    alphaQuality?: number
    compression?: typeof COMPRESSION

    [key: string]: any | undefined
}

export type ConversionMode = 'encode' | 'decode';
