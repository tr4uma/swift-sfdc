import * as vscode from 'vscode'
import ProfileFilesManager from './metadatamanagement/profiles/ProfileFilesManager'
import ApexClassesFileManager from './metadatamanagement/apexClasses/apexClassesFileManager'
import ApexClassFile from './metadatamanagement/apexClasses/structures/ApexClassFile'
import ProfilesFileMgr from './metadatamanagement/profiles/ProfileFilesManager'
import Prompts from './builders/prompts/Prompts'
import sObjFileMgr from './metadatamanagement/sObjects/SObjectFilesManager'
import SObjectFile from './metadatamanagement/sObjects/structures/SObjectFile'
import FieldPermission from './metadatamanagement/profiles/structures/profile-fields-templates/FieldPermission'
import { SObjectType } from './metadatamanagement/sObjects/structures/SObjectType'
import AccessType from './metadatamanagement/profiles/structures/AccessType'
import SObjectFieldDefinition from './metadatamanagement/sObjects/structures/SObjectFieldDefinition'

async function configureFLSForProfileAndSObject(profileName: string, sObjectName: string, objectDefinition: any, unpackedProfile: any): Promise<SObjectFieldDefinition> {
  return new Promise(async (resolve, reject) => {
    if (objectDefinition.CustomObject.fields) {
      const filteredSelectedObjFields = objectDefinition.CustomObject.fields.filter((field: any) => {
        return field.fullName.endsWith('__c') && !field.required
      })

      const fieldPermissions: FieldPermission[] = unpackedProfile.Profile.fieldPermissions
      const mappedPermissions = fieldPermissions.reduce((acc: any, current: any) => {
        if (current.field.startsWith(sObjectName)) { acc[current.field] = current }
        return acc
      }, {})

      const options = filteredSelectedObjFields.map((field: any) => {
        let opt = {
          label: field.fullName,
          description: '',
          detail: '',
          field: {
            editable: false,
            field: field.fullName,
            readable: false
          }
        }
        if (mappedPermissions[`${sObjectName}.${field.fullName}`]) {
          let perm = mappedPermissions[`${sObjectName}.${field.fullName}`]

          opt.description += perm.editable ? '✏️' : (perm.readable ? '👀' : '❌')
          opt.detail += perm.editable ? 'EDITABLE' : (perm.readable ? 'READABLE' : 'NO ACCESS')

          opt.field = field

        } else {
          opt.description = '🤷‍'
          opt.detail = 'NOT IN PROFILE'
        }
        return opt
      })



      const res: any | undefined = await vscode.window.showQuickPick(options, { ignoreFocusOut: true, placeHolder: `Select ${sObjectName} field you want to edit FLS for profile ${profileName}.`, matchOnDetail: true })
      if (res !== undefined) {
        resolve(res.field)
      } else {
        reject('Profiles FLS Configuration Aborted')
      }

    } else {
      reject(`No Fields were found for the SObject ${sObjectName}`)
    }

  })
}

async function configureFLSForField(field: string, profileName: string): Promise<AccessType> {
  return new Promise(async (resolve, reject) => {

    let options = [
      {
        label: 'READABLE',
        description: '👀',
        perm: AccessType.read
      },
      {
        label: 'EDITABLE',
        description: '✏️',
        perm: AccessType.edit
      },
      {
        label: 'NO ACCESS',
        description: '❌',
        perm: AccessType.none
      },
    ]

    const res: any | undefined = await vscode.window.showQuickPick(options, { ignoreFocusOut: true, placeHolder: `Select ${field} access level for profile ${profileName}.` })

    if (res !== undefined) {
      resolve(res.perm)
    } else {
      reject('Profiles FLS Configuration Aborted')
    }

  })
}

export default async function configureProfilesFLS() {
  try {
    const profiles = ProfileFilesManager.getObjectsFromMetaData()
    const selectedProfile = await Prompts.profiles.pickOne(profiles)
    const unpackedProfile = await ProfileFilesManager.readProfileDefinitionFile(selectedProfile)
    const SObjectFiles = await sObjFileMgr.getObjectsFromMetaData()
    // Filtering out custom metadata
    const pickedSObject: SObjectFile = await Prompts.sObjects.pickOne(SObjectFiles.filter((sObj) => sObj.sObjectType === SObjectType.SObject))
    const objectDefinition: any = await sObjFileMgr.readSObjectDefinitionFile(pickedSObject)

    const pickedField: SObjectFieldDefinition = await configureFLSForProfileAndSObject(selectedProfile.label, pickedSObject.label, objectDefinition, unpackedProfile)

    const permission: AccessType = await configureFLSForField(pickedField.fullName, selectedProfile.label)


    ProfilesFileMgr.updateProfilesVisibilityForField([selectedProfile], [{ sObject: pickedSObject, fields: [pickedField] }], permission)
    vscode.window.showInformationMessage(`Updated FLS on profile ${selectedProfile.label} for ${pickedSObject.label}.${pickedField.fullName}`)
  } catch (err) {
    vscode.window.showErrorMessage(err)
    console.log(err)
  }
}