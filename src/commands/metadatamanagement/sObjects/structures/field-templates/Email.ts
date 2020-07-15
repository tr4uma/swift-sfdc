import SObjectFieldDefinition from "../SObjectFieldDefinition"

export default class Email implements SObjectFieldDefinition {
  fullName: string
  externalId: boolean
  caseSensitive: boolean | undefined
  label: string
  type: string
  required: boolean
  unique: boolean

  constructor(fullName: string, label: string, externalId: boolean, required: boolean, unique: boolean) {
    this.fullName = fullName
    this.externalId = externalId
    if (this.externalId) {
      this.caseSensitive = false
    }
    this.label = label
    this.type = 'Email'
    this.required = required
    this.unique = unique
  }
}