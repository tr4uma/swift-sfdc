import SObjectFieldDefinition from "../SObjectFieldDefinition";

export default class Phone implements SObjectFieldDefinition {
  fullName: string
  externalId: boolean
  label: string
  type: string
  required: boolean

  constructor(fullName: string, label: string, externalId: boolean, required: boolean) {
    this.fullName = fullName
    this.externalId = externalId
    this.label = label
    this.type = 'Phone'
    this.required = required
  }
}