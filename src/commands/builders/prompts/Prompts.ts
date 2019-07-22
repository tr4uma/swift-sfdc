import * as vscode from 'vscode'

async function promptForFieldLabel(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const fieldName: string | undefined = await vscode.window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: 'Insert Field Label',
      validateInput: (value: string): string | undefined => {
        return value.length > 40 || value.length < 1 ? 'Field Labels cannot exceed 40 characters' : undefined
      }
    })
    fieldName ? resolve(fieldName) : reject('Field Creation Aborted')
  })
}

async function promptForRequiredField(): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    const required = await vscode.window.showQuickPick([{ label: 'False', value: false }, { label: 'True', value: true }], { ignoreFocusOut: true, placeHolder: 'Is the field Required?' })
    required ? resolve(required.value) : reject('Field Creation Aborted')
  })
}

async function promptForFieldApiName(label: string, forbiddenApiNames: string[]): Promise<string> {
  //Removing spaces and accented characters and appending __c
  const escaped = label.normalize('NFD').replace(/[\u0300-\u036f]|\s*/g, '') + '__c'

  return new Promise(async (resolve, reject) => {
    const fieldName: string | undefined = await vscode.window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: 'Insert Field ApiName',
      value: escaped,
      valueSelection: [0, escaped.length - 3],
      prompt: 'Only normal letters and underscores are allowed. Must end with \'__c\'',
      validateInput: (value: string): string | undefined => {
        if (!(/^[[a-zA-Z0-9_]{3,40}(?<!_)__c$/.test(value))) { return 'Invalid Api Name. Must only use Uppercase or Lowercase Letters, numbers, underscores (\'_\') and terminate with \'__c\'.' }
        if (forbiddenApiNames.indexOf(value) !== -1) { return 'Another Field with the same Api Name already exists on the object.' }
        return undefined
      }
    })
    fieldName ? resolve(fieldName) : reject('Field Creation Aborted')
  })
}

async function promptForStringLength(minLength: number, maxLength: number, defaultValue: number): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const regex = new RegExp(`^[0-9]{${minLength.toString().length},${maxLength.toString().length}}$`)
    const fieldLength: string | undefined = await vscode.window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: 'Insert Field Maximum Length',
      value: defaultValue.toString(),
      valueSelection: [0, defaultValue.toString().length],
      prompt: `Insert a number between ${minLength} and ${maxLength}`,
      validateInput: (value: string): string | undefined => {
        if (!(regex.test(value)) || Number(value) > maxLength || Number(value) < minLength) { return `Only a number between ${minLength} and ${maxLength} is allowed.` }
        return undefined
      }
    })
    fieldLength ? resolve(fieldLength) : reject('Field Creation Aborted')
  })
}

async function promptForExternalIdField(): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    const isExternalId = await vscode.window.showQuickPick([{ label: 'False', value: false }, { label: 'True', value: true }], { ignoreFocusOut: true, placeHolder: 'Is the field an External ID?' })
    isExternalId ? resolve(isExternalId.value) : reject('Field Creation Aborted')
  })
}

async function promptForUniqueField(): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    const isUnique = await vscode.window.showQuickPick([{ label: 'False', value: false }, { label: 'True', value: true }], { ignoreFocusOut: true, placeHolder: 'Is the field Unique?' })
    isUnique ? resolve(isUnique.value) : reject('Field Creation Aborted')
  })
}

async function promptForDefaultValue(possibleValues: any[]): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const defaultValue = await vscode.window.showQuickPick(possibleValues, { ignoreFocusOut: true, placeHolder: 'What\s the default value of the field?' })
    defaultValue ? resolve(defaultValue.value) : reject('Field Creation Aborted')
  })
}

async function promptForPrecisionAndScale(): Promise<[number, number]> {
  return new Promise(async (resolve, reject) => {
    const regex = new RegExp(`^[0-9]{1,2},[0-9]{1,2}$`)
    const precisionAndScale: string | undefined = await vscode.window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: 'Insert Field Precision and Scale, separated by comma',
      value: '18,0',
      valueSelection: [0, 2],
      prompt: 'Format is: [Number of digits to the left of the decimal point],[Number of digits to the right of the decimal point]',
      validateInput: (value: string): string | undefined => {
        let [precision, scale] = value.split(',')
        if (!(regex.test(value)) || Number(precision) + Number(scale) > 18) { return 'Up to 18 digits are allowed, divided amongst digits to the left of the decimal point and digits to its right, in the format [digits to the left],[digits to the right]. i.e: 16,2' }
        return undefined
      }
    })
    if (precisionAndScale) {
      let [precision, scale] = precisionAndScale.split(',')
      resolve([Number(precision), Number(scale)])
    } else {
      reject('Field Creation Aborted')
    }
  })
}

export default {
  defaultValue: promptForDefaultValue,
  isUnique: promptForUniqueField,
  isExternalId: promptForExternalIdField,
  stringLength: promptForStringLength,
  apiName: promptForFieldApiName,
  isRequired: promptForRequiredField,
  label: promptForFieldLabel,
  precisionAndScale: promptForPrecisionAndScale
}