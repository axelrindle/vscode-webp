import { AxiosProgressEvent } from 'axios'
import { PRESETS } from './constants'
import { COMPRESSION } from './constants'
import { QuickPickItem } from 'vscode'

export interface Version {
    name: string
    url: string
    platform: string
    arch: string
}

export type AxiosProgressCallback = (event: AxiosProgressEvent) => void;

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
