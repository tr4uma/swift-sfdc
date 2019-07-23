import SObjectFieldDefinition from "../SObjectFieldDefinition";

export default class Lookup implements SObjectFieldDefinition {
  fullName: string
  externalId: boolean
  label: string
  type: string
  required: boolean
  deleteConstraint: string
  referenceTo: string
  relationshipLabel: string
  relationshipName: string

  constructor(fullName: string, label: string, required: boolean, referenceTo: string, relationshipLabel: string, relationshipName: string) {
    this.fullName = fullName
    this.externalId = false
    this.label = label
    this.type = 'Lookup'
    this.required = required
    this.deleteConstraint = 'setNull'
    this.referenceTo = referenceTo
    this.relationshipLabel = relationshipLabel
    this.relationshipName = relationshipName

  }
}