import SObjectFieldDefinition from "../SObjectFieldDefinition";

export default class Text implements SObjectFieldDefinition {
  fullName: string
  externalId: boolean
  caseSensitive: boolean | undefined
  label: string
  type: string
  required: boolean
  length: string
  unique: boolean

  constructor(fullName: string, label: string, externalId: boolean, required: boolean, length: string, unique: boolean) {
    this.fullName = fullName
    this.externalId = externalId
    if (this.externalId) {
      this.caseSensitive = true
    }
    this.label = label
    this.type = 'Text'
    this.required = required
    this.length = length
    this.unique = unique
  }
}