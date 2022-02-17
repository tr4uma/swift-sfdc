import ApexClassFile from './structures/ApexClassFile'
import * as path from 'path'
import * as vscode from 'vscode'
import * as fs from 'fs'
import { PathLike } from "fs"
import ConfigManager from '../../../config/config-manager'

export default {

    getObjectsFromMetaData: function (): ApexClassFile[] {
        const p = path.join(ConfigManager.getInstance().getVSCodeRoot() as string, ConfigManager.getInstance().retrieveBackwardCompatibleRootFolder(), 'classes')
        const files = fs.readdirSync(p)
        if (files.length === 0) { throw Error('No Apex Class definition file was found in folder ' + p) }
        return this.generateSObjectDefinitions(files, p)
    },

    generateSObjectDefinitions: function (fileNames: string[], path: PathLike): ApexClassFile[] {
        return fileNames.filter(el => el.endsWith('.cls')).map(filename => new ApexClassFile(filename, path))
    }
}