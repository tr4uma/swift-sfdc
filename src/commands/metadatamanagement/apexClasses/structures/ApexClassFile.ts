import { PathLike } from "fs"

class ApexClassFile {
    label: string
    fileName: string
    folder: PathLike
    extension: string
    constructor(fileName: string, folder: PathLike) {
        this.label = fileName.split('.')[0] //filename without the extension since saleforce names files like the objects
        this.fileName = fileName //filename, e.g.: Account.object
        this.folder = folder //Should be src/objects
        this.extension = fileName.split('.')[1] //Should be .cls for salefsorce sobject metadata definition files
    }
}

export default ApexClassFile