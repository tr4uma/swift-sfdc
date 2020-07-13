import SObjectFieldDefinition from "../SObjectFieldDefinition"

export default class LongTextArea implements SObjectFieldDefinition {
  fullName: string
  externalId: boolean
  label: string
  type: string
  required: boolean
  length: string
  visibleLines: string

  constructor(fullName: string, label: string, externalId: boolean, required: boolean, length: string) {
    this.fullName = fullName
    this.externalId = externalId
    this.label = label
    this.type = 'LongTextArea'
    this.required = required
    this.length = length
    this.visibleLines = '3'
  }
}