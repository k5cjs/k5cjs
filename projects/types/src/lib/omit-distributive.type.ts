// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OmitDistributive<T, K extends keyof T> = T extends any ? Omit<T, K> : never;
