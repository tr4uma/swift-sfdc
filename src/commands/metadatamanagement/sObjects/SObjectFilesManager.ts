import SObjectFile from './structures/SObjectFile'
import * as path from 'path'
import * as fs from 'fs'
import * as xml2js from 'xml2js'
import { parseBooleans } from 'xml2js/lib/processors'
import ConfigManager from '../../../config/config-manager'
import utils from '../utils'

export default {

  getObjectsFromMetaData: function (): SObjectFile[] {
    const p = path.join(ConfigManager.getInstance().getVSCodeRoot() as string, ConfigManager.getInstance().retrieveBackwardCompatibleRootFolder(), 'objects')
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
        
        const fields = fs.existsSync(path.join(filePath, 'fields')) ? fs.readdirSync(path.join(filePath, 'fields')) : []
        const objFilePath = path.join(objDef.folder.toString(), objDef.fileName, `${objDef.fileName}.object-meta.xml`)
        let parsedFile: any
        try {
          const xmlParser = new xml2js.Parser({ explicitArray: false, valueProcessors: [parseBooleans] })
          if(!fs.existsSync(objFilePath)) throw new Error(`File ${objFilePath} was not found`)
          const fileContent = fs.readFileSync(objFilePath, { encoding: 'utf-8' })
          parsedFile = await new Promise((resolve, reject) => {
            xmlParser.parseString(fileContent, (err: any, result: any) => {
              if (err) { reject(err) }
              else { resolve(result) }
            })
          })
        } catch (err) {
          resolve({ CustomObject: { fields: [] as any } })
        }
        let sObjDef = parsedFile
        if (sObjDef === undefined) {
          sObjDef = { CustomObject: { fields: [] as any } }
        }
        const fieldsArr = await Promise.all(fields.map(field => {
          return new Promise((resolve, reject) => {
            const fileContent = fs.readFileSync(path.join(filePath, 'fields', field), { encoding: 'utf-8' })
            const xmlParserFields = new xml2js.Parser({ explicitArray: false, valueProcessors: [parseBooleans] })
            try {
              const parsedFile: any = xmlParserFields.parseString(fileContent, (err: any, result: any) => {
                if (err) { reject(err) }
                else { resolve(result.CustomField) }
              })
            } catch (err) {
              reject(err)
            }
          })
        }))
        sObjDef.CustomObject.fields = fieldsArr
        sObjDef.CustomObject.fields.sort((a: any, b: any) => utils.sortItemsByField(a, b, 'fullName'))
        resolve(sObjDef)
        
      }
    })
  },

  writeSObjectDefinitionFile: async function (sObjFile: SObjectFile, stuffToWrite: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if(!sObjFile.isDirectory) {
        try {
          const fileNamePath = path.join(sObjFile.folder.toString(), sObjFile.fileName)
          const builder = new xml2js.Builder({ xmldec: { standalone: undefined, encoding: 'UTF-8', version: '1.0' } })
          //Probably there's a bug in the builder class
          const xml = builder.buildObject(stuffToWrite)
          //130 is the number of characters of the first two lines containing header + root object definition
          let escaped = xml.substr(0, 130) + xml.substr(130, xml.length - 130).replace(/"/g, '&quot;').replace(/'/g, '&apos;')
          fs.writeFileSync(fileNamePath.toString(), escaped, 'utf8')
          resolve()
        } catch (err) {
          reject(err)
        }
      } else {
        let fieldsToAdd = stuffToWrite.CustomObject.fields.filter((el: { isNew: boolean }) => el.isNew)
        await Promise.all(fieldsToAdd.map((fieldToAdd: { fullName: any, isNew: any, $: any }) => {
          return new Promise((resolve, reject) => {
            try {
            const fileNamePath = path.join(sObjFile.folder.toString(), sObjFile.fileName, 'fields', `${fieldToAdd.fullName}.field-meta.xml`)
            const builder = new xml2js.Builder({ xmldec: { standalone: undefined, encoding: 'UTF-8', version: '1.0' }, renderOpts: {pretty: true, indent: '    ', newline: '\n'} })
            
            delete fieldToAdd.isNew
            fieldToAdd['$'] = { xmlns: 'http://soap.sforce.com/2006/04/metadata'}
            let fieldObj = { CustomField: fieldToAdd}
            const xml = builder.buildObject(fieldObj)
            fs.writeFileSync(fileNamePath.toString(), xml, 'utf8')
            resolve(true)
            } catch (err) {
              reject(false)
            }
          })
        }))
        resolve()
      }
    })
    
  }
}