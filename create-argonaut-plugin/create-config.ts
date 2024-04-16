#!/usr/bin/env node

import {copy} from "./component/file";
import {packagePath, projectPath} from "./component/const";

async function main() {
    await copy([
        {
            src: `${packagePath}/create-argonaut-plugin.config.json`,
            dest: `${projectPath}/create-argonaut-plugin.config.json`,
        }
    ])
}

main().then(() => console.log("config template created!"))