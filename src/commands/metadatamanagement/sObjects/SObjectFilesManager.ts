import SObjectFile from './structures/SObjectFile'
import * as path from 'path'
import * as vscode from 'vscode'
import * as fs from 'fs'
import * as xml2js from 'xml2js'
import { parseBooleans } from 'xml2js/lib/processors'
import { PathLike } from "fs"

export default {

  getObjectsFromMetaData: function (): SObjectFile[] {
    const p = path.join(vscode.workspace.rootPath as string, 'src', 'objects')
    const files = fs.readdirSync(p)
    if (files.length === 0) { throw Error('No SObject definition file was found in folder ' + p) }
    return this.generateSObjectDefinitions(files, p)
  },

  generateSObjectDefinitions: function (fileNames: string[], path: fs.PathLike): SObjectFile[] {
    return fileNames.map(filename => new SObjectFile(filename, path))
  },

  readSObjectDefinitionFile: async function (objDef: SObjectFile): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const filePath = path.join(objDef.folder.toString(), objDef.fileName)
      const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
      const xmlParser = new xml2js.Parser({ explicitArray: false, valueProcessors: [parseBooleans] })
      try {
        const parsedFile: any = await new Promise((resolve, reject) => {
          xmlParser.parseString(fileContent, (err: any, result: any) => {
            if (err) { reject(err) }
            else { resolve(result) }
          })
        })
        resolve(parsedFile)
      } catch (err) {
        reject(err)
      }
    })
  },

  writeSObjectDefinitionFile: function (fileNamePath: PathLike, stuffToWrite: any) {
    const builder = new xml2js.Builder({ xmldec: { standalone: undefined, encoding: 'UTF-8', version: '1.0' } })
    //Probably there's a bug in the builder class
    const xml = builder.buildObject(stuffToWrite)
    //130 is the number of characters of the first two lines containing header + root object definition
    let escaped = xml.substr(0, 130) + xml.substr(130, xml.length - 130).replace(/"/g, '&quot;').replace(/'/g, '&apos;')
    fs.writeFileSync(fileNamePath.toString(), escaped, 'utf8')
  }
}