import { AxiosProgressEvent } from 'axios';

export interface Version {
    name: string
    url: string
    platform: string
    arch: string
}

export type AxiosProgressCallback = (event: AxiosProgressEvent) => void;
