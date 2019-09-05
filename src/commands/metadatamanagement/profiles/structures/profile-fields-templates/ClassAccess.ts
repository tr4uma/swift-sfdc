export default class ClassAccess {
    apexClass: string
    enabled: boolean

    constructor(apexClass: string, enabled: boolean) {
        this.apexClass = apexClass
        this.enabled = enabled
    }
}