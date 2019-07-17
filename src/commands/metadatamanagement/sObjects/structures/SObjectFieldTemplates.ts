import SObjectFieldDefinition from "./SObjectFieldDefinition"
class Checkbox implements SObjectFieldDefinition {
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

class Text implements SObjectFieldDefinition {
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

export { Checkbox, Text }