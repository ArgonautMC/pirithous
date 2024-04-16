import {copy, copyDirectory} from "./file";
import {packagePath, projectPath} from "./const";
import {Manifest} from "./manifest";
import {Config} from "./config";
import {loadVariables, Variables} from "./variable";

export async function buildCopyBoilerplatesFunction(manifest: Manifest, config: Config): Promise<() => Promise<void>> {
    const variables = loadVariables(config, manifest)
    const pluginName = variables[Variables.PLUGIN_NAME]
    const boilerplateDir = `${packagePath}/@boilerplates`
    const copyRequests = await copyDirectory(
        boilerplateDir, "", projectPath + `/${pluginName}`
    )
    return () => copy(copyRequests)
}