import ProfileFile from './structures/ProfileFile'
import * as path from 'path'
import * as vscode from 'vscode'
import * as fs from 'fs'
import * as xml2js from 'xml2js'
import { parseBooleans } from 'xml2js/lib/processors'
import { PathLike } from "fs"
import SObjectFieldDefinition from '../sObjects/structures/SObjectFieldDefinition'
import AccessType from './structures/AccessType'
import SObjectFile from '../sObjects/structures/SObjectFile'
import utils from '../utils'
import UserPermission from './structures/profile-fields-templates/UserPermission'
import FieldPermission from './structures/profile-fields-templates/FieldPermission'
import ConfigManager from '../../../config/config-manager'

export default {

  getObjectsFromMetaData: function (): ProfileFile[] {
    const p = path.join(vscode.workspace.rootPath as string, ConfigManager.getInstance().retrieveBackwardCompatibleRootFolder(), 'profiles')
    const files = fs.readdirSync(p)
    if (files.length === 0) { throw Error('No Profile definition file was found in folder ' + p) }
    return this.generateProfilesDefinitions(files, p)
  },

  generateProfilesDefinitions: function (fileNames: string[], path: fs.PathLike): ProfileFile[] {
    return fileNames.map(filename => new ProfileFile(filename, path))
  },

  readProfileDefinitionFile: async function (objDef: ProfileFile): Promise<any> {
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

  writeProfileDefinitionFile: function (fileNamePath: PathLike, stuffToWrite: any) {
    const builder = new xml2js.Builder({ xmldec: { standalone: undefined, encoding: 'UTF-8', version: '1.0' }, renderOpts: {pretty: true, indent: '    ', newline: '\n'} })
    //Probably there's a bug in the builder class
    const xml = builder.buildObject(stuffToWrite)
    //130 is the number of characters of the first two lines containing header + root object definition
    let escaped = xml.substr(0, 130) + xml.substr(130, xml.length - 130).replace(/"/g, '&quot;').replace(/'/g, '&apos;')
    fs.writeFileSync(fileNamePath.toString(), escaped, 'utf8')
  },

  updateProfilesVisibilityForField: async function (profiles: ProfileFile[], fieldsInfos: { sObject: SObjectFile, fields: [SObjectFieldDefinition] }[], accessType: AccessType) {
    try {
      profiles.forEach(async profileFile => {
        const prof = await this.readProfileDefinitionFile(profileFile)
        const mappedFields = prof.Profile.fieldPermissions.reduce((acc: any, curr: FieldPermission) => {
          acc[curr.field] = curr
          return acc
        }, {})
        fieldsInfos.forEach(fieldInfo => {
          fieldInfo.fields.forEach(fieldMeta => {
            let currField = `${fieldInfo.sObject.label}.${fieldMeta.fullName}`
            console.log(currField)
            if (!mappedFields[currField]) {
              prof.Profile.fieldPermissions.push({
                readable: accessType !== AccessType.none,
                field: `${fieldInfo.sObject.label}.${fieldMeta.fullName}`,
                editable: accessType === AccessType.edit
              })
            } else {
              mappedFields[currField].readable = accessType !== AccessType.none
              mappedFields[currField].editable = accessType === AccessType.edit
            }
          })
        })
        prof.Profile.fieldPermissions.sort((a: any, b: any) => utils.sortItemsByField(a, b, 'field'))
        this.writeProfileDefinitionFile(path.join(profileFile.folder.toString(), profileFile.fileName), prof)
      })
    } catch (err) {
      throw Error(`Error updating field-level security for profiles: ${profiles.map(prf => prf.label)}`)
    }
  },

  updateProfilesApexClassesAccess: async function (profile: ProfileFile, enabledClasses: string[]) {
    try {
      const prof = await this.readProfileDefinitionFile(profile)
      prof.Profile.classAccesses.forEach((classAccess: { enabled: boolean; apexClass: string; }) => {
        classAccess.enabled = enabledClasses.includes(classAccess.apexClass)
      })
      prof.Profile.classAccesses.sort((a: any, b: any) => utils.sortItemsByField(a, b, 'apexClass'))
      this.writeProfileDefinitionFile(path.join(profile.folder.toString(), profile.fileName), prof)
    } catch (err) {
      throw Error(`Error updating Apex Class Access for profile: ${profile.label}`)
    }
  },

  updateProfilesApexPagesAccess: async function (profile: ProfileFile, enabledPages: string[]) {
    try {
      const prof = await this.readProfileDefinitionFile(profile)
      prof.Profile.pageAccesses.forEach((pageAccess: { enabled: boolean; apexPage: string; }) => {
        pageAccess.enabled = enabledPages.includes(pageAccess.apexPage)
      })
      prof.Profile.pageAccesses.sort((a: any, b: any) => utils.sortItemsByField(a, b, 'apexPage'))
      this.writeProfileDefinitionFile(path.join(profile.folder.toString(), profile.fileName), prof)
    } catch (err) {
      throw Error(`Error updating Visualforce Page Access for profile: ${profile.label}`)
    }
  },

  /**
   * The behaviour is: we check the files and pre-selected the enabled ones.
   * Then we show the user the entire list and we allow him/her to select the enabled ones
   * In the end, we turn everything off, turning then on the selected ones and adding the missing ones in
   * the original file
   */
  updateProfilesUserPermissions: async function (profile: ProfileFile, enabledPermissions: string[]) {
    try {
      const prof = await this.readProfileDefinitionFile(profile)

      const userPermissions: UserPermission[] = prof.Profile.userPermissions
      const mappedPermissions = userPermissions.reduce((acc: any, current: any) => {
        acc[current.name] = current
        return acc
      }, {})

      //Turn off the ones which are already in the profile metadata file
      userPermissions.forEach(perm => {
        perm.enabled = false
      })

      //Turning on the selected ones, adding the missing ones in the file
      enabledPermissions.forEach((permission: string) => {
        if (mappedPermissions[permission]) { mappedPermissions[permission].enabled = true }
        else { userPermissions.push({ enabled: true, name: permission }) }
      })

      userPermissions.sort((a: any, b: any) => utils.sortItemsByField(a, b, 'name'))

      prof.Profile.userPermissions = userPermissions

      this.writeProfileDefinitionFile(path.join(profile.folder.toString(), profile.fileName), prof)
    } catch (err) {
      throw Error(`Error updating Visualforce Page Access for profile: ${profile.label}`)
    }
  },

  updateProfileSinglePermission: async function (profile: ProfileFile, permission: string, enabled: boolean) {
    try {
      const prof = await this.readProfileDefinitionFile(profile)

      const userPermissions: UserPermission[] = prof.Profile.userPermissions
      let perm = userPermissions.find((perm) => perm.name === permission)

      if (perm) { perm.enabled = enabled }
      else if (perm === undefined && enabled) {
        perm = { enabled: true, name: permission }
        userPermissions.push(perm)
      }

      userPermissions.sort((a: any, b: any) => utils.sortItemsByField(a, b, 'name'))
      prof.Profile.userPermissions = userPermissions

      this.writeProfileDefinitionFile(path.join(profile.folder.toString(), profile.fileName), prof)
    } catch (err) {
      throw Error(`Error updating Visualforce Page Access for profile: ${profile.label}`)
    }
  }
}