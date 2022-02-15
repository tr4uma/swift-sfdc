import { PathLike, Dirent } from "fs"
import { SObjectType } from "./SObjectType"

class SObjectFile {
  label: string
  fileName: string
  folder: PathLike
  extension: string
  sObjectType: SObjectType
  isDirectory: boolean
  constructor(file: Dirent, folder: PathLike) {
    let fileName = file.name
    this.label = fileName.split('.')[0] //filename without the extension since saleforce names files like the objects
    this.fileName = fileName //filename, e.g.: Account.object
    this.folder = folder //depends on project structure
    this.isDirectory = file.isDirectory()
    this.extension = fileName.split('.')[1] //Should be .object for salefsorce sobject metadata definition files
    this.sObjectType = this.label.endsWith('__mdt') ? SObjectType.CustomMetadata : SObjectType.SObject
  }
}

export default SObjectFile