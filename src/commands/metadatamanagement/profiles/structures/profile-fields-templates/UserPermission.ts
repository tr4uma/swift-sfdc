export default class UserPermission {
    enabled: boolean
    name: string

    constructor(enabled: boolean, name: string) {
        this.enabled = enabled
        this.name = name
    }
}