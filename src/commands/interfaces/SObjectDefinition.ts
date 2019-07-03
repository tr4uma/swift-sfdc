import { PathLike } from "fs"

enum SObjectType {
  SObject,
  CustomMetadata
}

class SObjectDefinition {
  label: string
  fileName: string
  folder: PathLike
  extension: string
  sObjectType: SObjectType
  constructor(fileName: string, folder: PathLike) {
    this.label = fileName.split('.')[0]
    this.fileName = fileName
    this.folder = folder
    this.extension = fileName.split('.')[1]
    this.sObjectType = this.label.endsWith('__mdt') ? SObjectType.CustomMetadata : SObjectType.SObject
  }
}

export default SObjectDefinition