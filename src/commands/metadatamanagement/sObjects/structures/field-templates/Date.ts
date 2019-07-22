import SObjectFieldDefinition from "../SObjectFieldDefinition";

export default class Date implements SObjectFieldDefinition {
  fullName: string
  externalId: boolean
  label: string
  type: string
  required: boolean

  constructor(fullName: string, label: string, externalId: boolean, required: boolean) {
    this.fullName = fullName
    this.externalId = externalId
    this.label = label
    this.type = 'Date'
    this.required = required
  }
}