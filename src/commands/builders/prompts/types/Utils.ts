import * as vscode from 'vscode'


async function askConfirmation(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const confirmed = await vscode.window.showQuickPick([{ label: 'Yes', value: true }, { label: 'No', value: false }], { ignoreFocusOut: true, placeHolder: 'Are you sure?' })
        confirmed ? resolve(confirmed.value) : reject('Operation Aborted')
    })
}

async function askIfWantsToSelect(): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
      const confirmed = await vscode.window.showQuickPick([{ label: 'Yes', value: true }, { label: 'No', value: false }], { ignoreFocusOut: true, placeHolder: 'Would you like to select the relationships to extract?' })
      confirmed ? resolve(confirmed.value) : reject('Operation Aborted')
  })
}

export default {
  confirmation: askConfirmation,
  selectRels: askIfWantsToSelect
}