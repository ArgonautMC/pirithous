import {packagePath} from "./const";
import fs from "fs";
import {z} from "zod";

export type Manifest = z.infer<typeof ManifestSchema>

const ManifestSchema = z.object({
    variables: z.array(z.string()),
    variableTemplates: z.array(z.object({
        key: z.string(),
        src: z.string(),
    })),
    templates: z.array(z.object({
        src: z.string(),
        dest: z.string(),
    })),
})

export function loadManifest(): Manifest {
    const manifestSrc = `${packagePath}/@templates/templates.manifest.json`
    const manifestStr = fs.readFileSync(manifestSrc, "utf-8")
    const manifestJson = JSON.parse(manifestStr)

    return ManifestSchema.parse(manifestJson)
}
