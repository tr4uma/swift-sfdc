import SObjectFieldDefinition from "../SObjectFieldDefinition";

export default class Phone implements SObjectFieldDefinition {
  fullName: string
  externalId: boolean
  caseSensitive: boolean | undefined
  label: string
  type: string
  required: boolean

  constructor(fullName: string, label: string, externalId: boolean, required: boolean) {
    this.fullName = fullName
    this.externalId = externalId
    if (this.externalId) {
      this.caseSensitive = true
    }
    this.label = label
    this.type = 'Phone'
    this.required = required
  }
}