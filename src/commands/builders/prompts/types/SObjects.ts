import * as vscode from 'vscode'
import SObjectFile from "../../../metadatamanagement/sObjects/structures/SObjectFile"

async function pickSObjectType(sObjectDefinitions: SObjectFile[]): Promise<SObjectFile> {

  return new Promise(async (resolve, reject) => {
    const res: SObjectFile | undefined = await vscode.window.showQuickPick(sObjectDefinitions, { ignoreFocusOut: true, placeHolder: 'Select an SObject Type' })
    if (res !== undefined) {
      resolve(res)
    } else {
      reject('SObject selection Aborted')
    }
  })
}

async function pickSObjectTypes(sObjectDefinitions: SObjectFile[]): Promise<SObjectFile[]> {

  const sobjOptions = sObjectDefinitions.map(sobj => {
    return { ...sobj, picked: false }
  })

  return new Promise(async (resolve, reject) => {
    const res: SObjectFile[] | undefined = await vscode.window.showQuickPick(sobjOptions, { ignoreFocusOut: true, placeHolder: 'Pick SObjects to include in the diagram', canPickMany: true })
    if (res !== undefined) {
      resolve(res)
    } else {
      reject('SObjects selection Aborted')
    }
  })
}

export default {
  pickOne: pickSObjectType,
  pickMany: pickSObjectTypes
}