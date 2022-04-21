import * as vscode from 'vscode'
import SObjectFile from './metadatamanagement/sObjects/structures/SObjectFile'
import SObjectFieldType from './metadatamanagement/sObjects/structures/SObjectFieldType'
import SObjectFieldDefinition from './metadatamanagement/sObjects/structures/SObjectFieldDefinition'
import SObjectFieldBuilders from './builders/SObjectFieldBuilders'
import sObjFileMgr from './metadatamanagement/sObjects/SObjectFilesManager'
import ProfilesFileMgr from './metadatamanagement/profiles/ProfileFilesManager'
import ConfigManager from '../config/config-manager'
import AccessType from './metadatamanagement/profiles/structures/AccessType'
import utils from './metadatamanagement/utils'
import Prompts from './builders/prompts/Prompts'
import { SObjectType } from './metadatamanagement/sObjects/structures/SObjectType'
import Monitor from '../monitoring/monitor'

async function fieldCreationWizard(otherFields: SObjectFieldDefinition[], availableSObjectsList: string[]): Promise<SObjectFieldDefinition> {
  let forbiddenApiNames = otherFields.map(field => field.fullName)
  return new Promise(async (resolve, reject) => {
    try {
      const pickedFieldType = await pickSObjectFieldType()
      let obj: SObjectFieldDefinition = await SObjectFieldBuilders[pickedFieldType](forbiddenApiNames, availableSObjectsList)
      obj.isNew = true
      resolve(obj)
    } catch (err) {
      reject(err)
    }
  })
}

async function pickSObjectFieldType(): Promise<SObjectFieldType> {
  return new Promise(async (resolve, reject) => {
    const res: any | undefined = await vscode.window.showQuickPick(Object.keys(SObjectFieldType).map(el => { return { label: el, value: el } }), { ignoreFocusOut: true, placeHolder: 'Select a Field Type' })
    res !== undefined ? resolve(res.value) : reject('Field Creation Aborted')
  })
}

// Main functionality
export default async function createField() {
  Monitor.getInstance().sendEvent('createField')
  try {
    const SObjectFiles = await sObjFileMgr.getObjectsFromMetaData()
    const pickedSObject: SObjectFile = await Prompts.sObjects.pickOne(SObjectFiles)

    const objectDefinition: any = await sObjFileMgr.readSObjectDefinitionFile(pickedSObject)
    const sObjectFieldDefinition: SObjectFieldDefinition = await fieldCreationWizard(objectDefinition.CustomObject.fields, SObjectFiles.map(file => file.label))
    

    objectDefinition.CustomObject.fields.push(sObjectFieldDefinition)
    objectDefinition.CustomObject.fields.sort((a: any, b: any) => utils.sortItemsByField(a, b, 'fullName'))

    await sObjFileMgr.writeSObjectDefinitionFile(pickedSObject, objectDefinition)

    if (pickedSObject.sObjectType === SObjectType.SObject) {
      ProfilesFileMgr.updateProfilesVisibilityForField(ConfigManager.getInstance().getConfig().defaultProfiles || [], [{ sObject: pickedSObject, fields: [sObjectFieldDefinition] }], AccessType.edit)
    }

    vscode.window.showInformationMessage(`Field '${sObjectFieldDefinition.fullName}' was created on SObject ${pickedSObject.label} and enabled as editable for profiles: ${(ConfigManager.getInstance().getConfig().defaultProfiles || []).map(p => p.label)}`)

  } catch (err) {
    vscode.window.showErrorMessage(err)
    Monitor.getInstance().sendError('createField', {message: err.message, name: err.name, stackTrace: err.stack})
    console.log(err)
  }
}