import * as SObjectFieldTemplates from './SObjectFieldTemplates'
import * as vscode from 'vscode'

async function promptForFieldLabel(): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const fieldName: string | undefined = await vscode.window.showInputBox({ ignoreFocusOut: true, placeHolder: 'Insert Field Label' })
        fieldName && resolve(fieldName) || reject('No Label was selected for the field')
    })
}

async function promptForFieldApiName(label: string): Promise<string> {

    //Removing spaces and accented characters and appending __c
    const escaped = label.normalize('NFD').replace(/[\u0300-\u036f]|\s*/g, '') + '__c'

    return new Promise(async (resolve, reject) => {
        const fieldName: string | undefined = await vscode.window.showInputBox({ ignoreFocusOut: true, placeHolder: 'Insert Field ApiName', value: escaped, valueSelection: [0, escaped.length - 3], prompt: 'Only normal letters and underscores are allowed. Must end with \'__c\'' })
        fieldName && resolve(fieldName) || reject('No ApiName was selected for the field')
    })
}

async function checkboxBuilder(): Promise<SObjectFieldTemplates.Checkbox> {
    return new Promise(async (resolve, reject) => {
        let label = await promptForFieldLabel()
        let apiName = await promptForFieldApiName(label)
        console.log(label, apiName)
    })
}

export default { checkboxBuilder }