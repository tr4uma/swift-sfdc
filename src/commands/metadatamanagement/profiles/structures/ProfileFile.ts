import { PathLike } from "fs"

class ProfileFile {
  label: string
  fileName: string
  folder: PathLike
  extension: string

  constructor(fileName: string, folder: PathLike) {
    this.label = fileName.split('.')[0] //filename without the extension since saleforce names files like the profiles
    this.fileName = fileName //filename, e.g.: Account.profile
    this.folder = folder //Should be src/profiles
    this.extension = fileName.split('.')[1] //Should be .profile for salefsorce sobject metadata definition files
  }
}

export default ProfileFile