/** `false`: everything is shown and you filter yourself (async). A function gets the query, value and keywords. */
export type CommandFilter = false | ((query: string, value: string, keywords: string[]) => boolean)
