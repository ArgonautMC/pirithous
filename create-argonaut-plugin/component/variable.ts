import {Config} from "./config";
import {Manifest} from "./manifest";

export enum Variables {
    PLUGIN_NAME = 'plugin_name'
}

export function loadVariables(config: Config, manifest: Manifest): Record<string, string> {
    let result: Record<string, string> = {}

    const keys = manifest.variables
    keys.map(key => {
        const value = config.variables[key]
        if (!value) throw Error(`config doesn't declare variable value of '${key}'`)
        result[key] = config.variables[key]
    })

    return result
}

export function applyVariables(template: string, variables: Record<string, string>): string {
    let result = template

    for (const [key, value] of Object.entries(variables)) {
        const placeholder = new RegExp(`%${key}%`, 'gi')
        result = result.replace(placeholder, value)
    }

    return result
}