import ProfileFile from "../commands/metadatamanagement/profiles/structures/ProfileFile"
import MetadataStructure from "../commands/metadatamanagement/profiles/structures/MetadataStructure"

export default class SwiftSfdcConfiguration {
  defaultProfiles: ProfileFile[] | undefined = undefined
  metadataStructure: MetadataStructure | undefined = MetadataStructure.SF_SFDX
  packageLocation: string =  './manifest/'
  projectRootFolder: string = './force-app/main/default'
  constructor() {
  }
}