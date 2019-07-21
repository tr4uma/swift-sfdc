import SObjectFieldDefinition from "../SObjectFieldDefinition";

export default class Text implements SObjectFieldDefinition {
  fullName: string
  externalId: boolean
  label: string
  type: string
  required: boolean
  length: string
  unique: boolean

  constructor(fullName: string, label: string, externalId: boolean, required: boolean, length: string, unique: boolean) {
    this.fullName = fullName
    this.externalId = externalId
    this.label = label
    this.type = 'Text'
    this.required = required
    this.length = length
    this.unique = unique
  }
}