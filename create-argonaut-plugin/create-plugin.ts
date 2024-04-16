#!/usr/bin/env node
import {buildCopyBoilerplatesFunction} from "./component/boilerplate";
import {projectPath} from "./component/const";
import {buildCopyTemplatesFunction} from "./component/template";
import {loadManifest} from "./component/manifest";
import {loadConfig} from "./component/config";

async function main() {
    const manifest = loadManifest()
    const config = loadConfig()
    const copyTemplates = await buildCopyTemplatesFunction(manifest, config)
    const copyBoilerplates = await buildCopyBoilerplatesFunction(manifest, config)
    await Promise.all([
        copyTemplates(),
        copyBoilerplates(),
    ])
}

console.log(`create argonaut plugin project at '${projectPath}'`)
main().then(() => console.log("create project success!"))