import * as SObjectFieldTemplates from '../metadatamanagement/sObjects/structures/SObjectFieldTemplates'
import Prompt from './prompts/Prompts'

async function checkboxBuilder(forbiddenApiNames: string[], availableSObjectsList: string[]): Promise<SObjectFieldTemplates.Checkbox> {
  return new Promise(async (resolve, reject) => {
    try {
      let label: string = await Prompt.label()
      let apiName: string = await Prompt.apiName(label, forbiddenApiNames)
      let required: boolean = await Prompt.isRequired()
      let defaultValue: any = await Prompt.defaultValue([{ label: 'False', value: false }, { label: 'True', value: true }])
      resolve(new SObjectFieldTemplates.Checkbox(apiName, label, required, defaultValue))
    } catch (err) {
      reject('Field Creation Aborted')
    }
  })
}

async function textBuilder(forbiddenApiNames: string[], availableSObjectsList: string[]): Promise<SObjectFieldTemplates.Text> {
  return new Promise(async (resolve, reject) => {
    try {
      let label: string = await Prompt.label()
      let apiName: string = await Prompt.apiName(label, forbiddenApiNames)
      let length: string = await Prompt.stringLength(1, 255, 255)
      let required: boolean = await Prompt.isRequired()
      let externalId: boolean = await Prompt.isExternalId()
      let unique: boolean = await Prompt.isUnique()
      resolve(new SObjectFieldTemplates.Text(apiName, label, externalId, required, length, unique))
    } catch (err) {
      reject('Field Creation Aborted')
    }
  })
}

async function emailBuilder(forbiddenApiNames: string[], availableSObjectsList: string[]): Promise<SObjectFieldTemplates.Email> {
  return new Promise(async (resolve, reject) => {
    try {
      let label: string = await Prompt.label()
      let apiName: string = await Prompt.apiName(label, forbiddenApiNames)
      let required: boolean = await Prompt.isRequired()
      let externalId: boolean = await Prompt.isExternalId()
      let unique: boolean = await Prompt.isUnique()
      resolve(new SObjectFieldTemplates.Email(apiName, label, externalId, required, unique))
    } catch (err) {
      reject('Field Creation Aborted')
    }
  })
}

async function dateBuilder(forbiddenApiNames: string[], availableSObjectsList: string[]): Promise<SObjectFieldTemplates.Date> {
  return new Promise(async (resolve, reject) => {
    try {
      let label: string = await Prompt.label()
      let apiName: string = await Prompt.apiName(label, forbiddenApiNames)
      let required: boolean = await Prompt.isRequired()
      let externalId: boolean = await Prompt.isExternalId()
      resolve(new SObjectFieldTemplates.Date(apiName, label, externalId, required))
    } catch (err) {
      reject('Field Creation Aborted')
    }
  })
}

async function datetimeBuilder(forbiddenApiNames: string[], availableSObjectsList: string[]): Promise<SObjectFieldTemplates.DateTime> {
  return new Promise(async (resolve, reject) => {
    try {
      let label: string = await Prompt.label()
      let apiName: string = await Prompt.apiName(label, forbiddenApiNames)
      let required: boolean = await Prompt.isRequired()
      let externalId: boolean = await Prompt.isExternalId()
      resolve(new SObjectFieldTemplates.DateTime(apiName, label, externalId, required))
    } catch (err) {
      reject('Field Creation Aborted')
    }
  })
}

async function phoneBuilder(forbiddenApiNames: string[], availableSObjectsList: string[]): Promise<SObjectFieldTemplates.Phone> {
  return new Promise(async (resolve, reject) => {
    try {
      let label: string = await Prompt.label()
      let apiName: string = await Prompt.apiName(label, forbiddenApiNames)
      let required: boolean = await Prompt.isRequired()
      let externalId: boolean = await Prompt.isExternalId()
      resolve(new SObjectFieldTemplates.Phone(apiName, label, externalId, required))
    } catch (err) {
      reject('Field Creation Aborted')
    }
  })
}

async function textAreaBuilder(forbiddenApiNames: string[], availableSObjectsList: string[]): Promise<SObjectFieldTemplates.TextArea> {
  return new Promise(async (resolve, reject) => {
    try {
      let label: string = await Prompt.label()
      let apiName: string = await Prompt.apiName(label, forbiddenApiNames)
      let required: boolean = await Prompt.isRequired()
      let externalId: boolean = await Prompt.isExternalId()
      resolve(new SObjectFieldTemplates.TextArea(apiName, label, externalId, required))
    } catch (err) {
      reject('Field Creation Aborted')
    }
  })
}

async function longTextAreaBuilder(forbiddenApiNames: string[], availableSObjectsList: string[]): Promise<SObjectFieldTemplates.LongTextArea> {
  return new Promise(async (resolve, reject) => {
    try {
      let label: string = await Prompt.label()
      let apiName: string = await Prompt.apiName(label, forbiddenApiNames)
      let length: string = await Prompt.stringLength(256, 131072, 32768)
      let required: boolean = await Prompt.isRequired()
      let externalId: boolean = await Prompt.isExternalId()
      resolve(new SObjectFieldTemplates.LongTextArea(apiName, label, externalId, required, length))
    } catch (err) {
      reject('Field Creation Aborted')
    }
  })
}

export default { Checkbox: checkboxBuilder, Text: textBuilder, Email: emailBuilder, Date: dateBuilder, DateTime: datetimeBuilder, Phone: phoneBuilder, TextArea: textAreaBuilder, LongTextArea: longTextAreaBuilder }