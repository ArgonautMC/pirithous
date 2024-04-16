import {packagePath, projectPath} from "./const";
import fs from "fs";
import {Config} from "./config";
import {write, WriteRequest} from "./file";
import fsPromise from "fs/promises";
import {Manifest} from "./manifest";
import {applyVariables, loadVariables, Variables} from "./variable";

const templateDir = `${packagePath}/@templates`
const variableTemplateDir = `${packagePath}/@templates/@variables`

export async function buildCopyTemplatesFunction(
    manifest: Manifest,
    config: Config,
): Promise<() => Promise<void>> {
    const variables = loadVariables(config, manifest)
    const pluginName = variables[Variables.PLUGIN_NAME]
    const variableTemplates = loadVariableTemplates(config, manifest)

    const variableMap = { ...variables, ...variableTemplates }
    const requests = await buildWriteRequests(manifest, variableMap, pluginName)

    return () => write(requests)
}

async function buildWriteRequests(
    manifest: Manifest,
    variableMap: { [p: string]: string },
    pluginName: string
): Promise<WriteRequest[]> {
    const promises = manifest.templates.map(async ({src, dest}) => {
        const content = await fsPromise.readFile(`${templateDir}/${src}`, 'utf-8')

        const destWithVariables = applyVariables(dest, variableMap)
        const contentWithVariable = applyVariables(content, variableMap)

        return {
            dest: `${projectPath}/${pluginName}/${destWithVariables}`,
            content: contentWithVariable,
        }
    })
    return await Promise.all(promises)
}

function loadVariableTemplates(config: Config, manifest: Manifest): Record<string, string> {
    let result: Record<string, string> = {}

    manifest.variableTemplates.map((variableTemplate) => {
        const { key, src } = variableTemplate

        const use = isUsingInTemplate(config, key)
        result[key] = use
            ? loadVariableTemplate(src)
            : ''
    })

    return result
}

function isUsingInTemplate(config: Config, key: string) {
    const use = key.split(".").reverse().at(0)
    return use!! && config.use.includes(use as Config["use"][0])
}

function loadVariableTemplate(src: string): string {
    return fs.readFileSync(`${variableTemplateDir}/${src}`, 'utf-8')
}
