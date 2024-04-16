import {z} from "zod";
import {projectPath} from "./const";
import fs from "fs";

export type Config = z.infer<typeof ConfigSchema>

const ConfigSchema = z.object({
    use: z.array(z.string()),
    variables: z.record(z.string())
})

export function loadConfig(): Config {
    const configSrc = `${projectPath}/create-argonaut-plugin.config.json`
    const configStr = fs.readFileSync(configSrc, 'utf-8')
    const configJson = JSON.parse(configStr)

    return ConfigSchema.parse(configJson)
}
