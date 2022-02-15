import SObjectFile from './structures/SObjectFile'
import * as path from 'path'
import * as vscode from 'vscode'
import * as fs from 'fs'
import * as xml2js from 'xml2js'
import { parseBooleans } from 'xml2js/lib/processors'
import { PathLike } from "fs"
import ConfigManager from '../../../config/config-manager'
import utils from '../utils'

export default {

  getObjectsFromMetaData: function (): SObjectFile[] {
    const p = path.join(vscode.workspace.rootPath as string, ConfigManager.getInstance().retrieveBackwardCompatibleRootFolder(), 'objects')
    const files = fs.readdirSync(p, { withFileTypes: true })
    if (files.length === 0) { throw Error('No SObject definition file was found in folder ' + p) }
    return this.generateSObjectDefinitions(files, p)
  },

  generateSObjectDefinitions: function (files: fs.Dirent[], path: fs.PathLike): SObjectFile[] {
    return files.map(file => new SObjectFile(file, path))
  },

  readSObjectDefinitionFile: async function (objDef: SObjectFile): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const filePath = path.join(objDef.folder.toString(), objDef.fileName)
      if(!objDef.isDirectory) {
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
      } else {
        const fields = fs.readdirSync(path.join(filePath, 'fields'))
        let objDef = { CustomObject: {  fields: [] as any } } //fake SObject definition cause we only care about fields
        const xmlParser = new xml2js.Parser({ explicitArray: false, valueProcessors: [parseBooleans] })
        const fieldsArr = await Promise.all(fields.map(field => {
          return new Promise((resolve, reject) => {
            const fileContent = fs.readFileSync(path.join(filePath, 'fields', field), { encoding: 'utf-8' })
            try {
              const parsedFile: any = xmlParser.parseString(fileContent, (err: any, result: any) => {
                if (err) { reject(err) }
                else { resolve(result.CustomField) }
              })
            } catch (err) {
              reject(err)
            }
          })
        }))
        objDef.CustomObject.fields = fieldsArr
        objDef.CustomObject.fields.sort((a: any, b: any) => utils.sortItemsByField(a, b, 'fullName'))
        console.log(objDef.CustomObject.fields[0])
        resolve(objDef)
        
      }
    })
  },

  writeSObjectDefinitionFile: function (sObjFile: SObjectFile, stuffToWrite: any) {
    const fileNamePath = path.join(sObjFile.folder.toString(), sObjFile.fileName)
    const builder = new xml2js.Builder({ xmldec: { standalone: undefined, encoding: 'UTF-8', version: '1.0' } })
    //Probably there's a bug in the builder class
    const xml = builder.buildObject(stuffToWrite)
    //130 is the number of characters of the first two lines containing header + root object definition
    let escaped = xml.substr(0, 130) + xml.substr(130, xml.length - 130).replace(/"/g, '&quot;').replace(/'/g, '&apos;')
    fs.writeFileSync(fileNamePath.toString(), escaped, 'utf8')
  }
}