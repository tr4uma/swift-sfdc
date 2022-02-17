import ApexPageFile from './structures/ApexPageFile'
import * as path from 'path'
import * as fs from 'fs'
import { PathLike } from "fs"
import ConfigManager from '../../../config/config-manager'

export default {

    getObjectsFromMetaData: function (): ApexPageFile[] {
        const p = path.join(ConfigManager.getInstance().getVSCodeRoot() as string, ConfigManager.getInstance().retrieveBackwardCompatibleRootFolder(), 'pages')
        const files = fs.readdirSync(p)
        if (files.length === 0) { throw Error('No Visualforce Page definition file was found in folder ' + p) }
        return this.generateSObjectDefinitions(files, p)
    },

    generateSObjectDefinitions: function (fileNames: string[], path: PathLike): ApexPageFile[] {
        return fileNames.filter(el => el.endsWith('.page')).map(filename => new ApexPageFile(filename, path))
    }
}