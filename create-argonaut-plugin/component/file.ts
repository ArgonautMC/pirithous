import fsPromise from "fs/promises";
import fs from "fs";
import path from "node:path";

export type CopyRequest = {
    src: string,
    dest: string,
}

export type WriteRequest = {
    dest: string,
    content: string,
}

export async function copyDirectory(defaultSrc: string, src: string, defaultDest: string): Promise<CopyRequest[]> {
    const elements = await fsPromise.readdir(`${defaultSrc}/${src}`, {withFileTypes: true})
    const copies: CopyRequest[] = []
    const currentSrc = `${defaultSrc}/${src}`
    for (const element of elements) {
        if (element.isFile()) {
            copies.push({
                src: `${currentSrc}/${element.name}`,
                dest: `${defaultDest}/${element.name}`
            })
        } else if (element.isDirectory()) {
            if (!fs.existsSync(`${defaultDest}/${element.name}`))
                await fsPromise.mkdir(`${defaultDest}/${element.name}`, { recursive: true })
            const copiesInDir = await copyDirectory(
                defaultSrc,
                `${src}/${element.name}`,
                `${defaultDest}/${element.name}`
            )
            copies.push(...copiesInDir)
        }
    }
    return copies
}

export async function copy(requests: CopyRequest[]) {
    const tasks = requests.map(({src, dest}) => fsPromise.copyFile(src, dest))
    await Promise.all(tasks)
}

export async function write(requests: WriteRequest[]) {
    const promises = requests.map(
        async ({dest, content}) => {
            const dirSrc = path.resolve(dest, '..')
            if (!fs.existsSync(dirSrc))
                await fsPromise.mkdir(dirSrc, {recursive: true})
            await fsPromise.writeFile(dest, content, 'utf-8')
        }
    )
    await Promise.all(promises)
}