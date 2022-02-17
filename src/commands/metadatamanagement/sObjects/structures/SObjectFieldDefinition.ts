interface SObjectFieldDefinition {
  fullName: string
  //defaultValue: string
  externalId: boolean
  label: string
  type: string
  required: boolean
  //valueSet: string
  //formula: string
  //formulaTreatBlanksAs: string
  //precision: string
  //scale: string
  //unique: string
  //length: string
  //deleteConstraint: string
  //lookupFilter: string
  //referenceTo: string
  //relationshipLabel: string
  //relationshipName: string
  //visibleLines: string
  //caseSensitive: string
  //trackHistory: string
  //summaryFilterItems: string
  //summaryForeignKey: string
  //summaryOperation: string
  //summarizedField: string
  //description: string
  //inlineHelpText: string
  //displayFormat: string
  isNew?: boolean //for internal purposes
}

export default SObjectFieldDefinition