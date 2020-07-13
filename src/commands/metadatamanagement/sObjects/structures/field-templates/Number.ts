import SObjectFieldDefinition from "../SObjectFieldDefinition"

export default class Number implements SObjectFieldDefinition {
  fullName: string
  externalId: boolean
  label: string
  type: string
  required: boolean
  unique: boolean
  precision: number
  scale: number

  constructor(fullName: string, label: string, externalId: boolean, required: boolean, unique: boolean, precision: number, scale: number) {
    this.fullName = fullName
    this.externalId = externalId
    this.label = label
    this.type = 'Number'
    this.required = required
    this.unique = unique
    this.precision = precision
    this.scale = scale
  }
}