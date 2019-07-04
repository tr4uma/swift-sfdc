import { PathLike } from "fs"

enum SObjectType {
  SObject,
  CustomMetadata
}

class SObjectFile {
  label: string
  fileName: string
  folder: PathLike
  extension: string
  sObjectType: SObjectType
  constructor(fileName: string, folder: PathLike) {
    this.label = fileName.split('.')[0] //filename without the extension since saleforce names files like the objects
    this.fileName = fileName //filename, e.g.: Account.object
    this.folder = folder //Should be src/objects
    this.extension = fileName.split('.')[1] //Should be .object for salefsorce sobject metadata definition files
    this.sObjectType = this.label.endsWith('__mdt') ? SObjectType.CustomMetadata : SObjectType.SObject
  }
}

export default SObjectFile