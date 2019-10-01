import * as vscode from 'vscode'
import SObjectFile from "../../../metadatamanagement/sObjects/structures/SObjectFile"

async function pickSObjectType(sObjectDefinitions: SObjectFile[]): Promise<SObjectFile> {

  return new Promise(async (resolve, reject) => {
    const res: SObjectFile | undefined = await vscode.window.showQuickPick(sObjectDefinitions, { ignoreFocusOut: true, placeHolder: 'Select an SObject Type' })
    if (res !== undefined) {
      resolve(res)
    } else {
      reject('SObject Selection Aborted')
    }
  })
}

export default {
  pickOne: pickSObjectType
}