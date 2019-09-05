import ApexClassFile from './structures/ApexClassFile'
import * as path from 'path'
import * as vscode from 'vscode'
import * as fs from 'fs'
import { PathLike } from "fs"

export default {

    getObjectsFromMetaData: function (): ApexClassFile[] {
        const p = path.join(vscode.workspace.rootPath as string, 'src', 'classes')
        const files = fs.readdirSync(p)
        if (files.length === 0) { throw Error('No Apex Class definition file was found in folder ' + p) }
        return this.generateSObjectDefinitions(files, p)
    },

    generateSObjectDefinitions: function (fileNames: string[], path: PathLike): ApexClassFile[] {
        return fileNames.filter(el => el.endsWith('.cls')).map(filename => new ApexClassFile(filename, path))
    }
}