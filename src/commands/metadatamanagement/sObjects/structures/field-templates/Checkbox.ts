import SObjectFieldDefinition from "../SObjectFieldDefinition";

export default class Checkbox implements SObjectFieldDefinition {
  fullName: string
  defaultValue: boolean
  externalId: boolean
  label: string
  type: string
  required: boolean

  constructor(fullName: string, label: string, required: boolean, defaultValue: boolean) {
    this.fullName = fullName
    this.externalId = false
    this.label = label
    this.type = 'Checkbox'
    this.required = required
    this.defaultValue = defaultValue
  }
}