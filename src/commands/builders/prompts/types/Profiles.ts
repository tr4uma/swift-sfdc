import * as vscode from 'vscode'
import ProfileFile from '../../../metadatamanagement/profiles/structures/ProfileFile'
import ProfileUserPermission from '../../../metadatamanagement/profiles/structures/ProfileUserPermission';

async function pickOne(profiles: ProfileFile[]): Promise<ProfileFile> {
  return new Promise(async (resolve, reject) => {
    const res: any | undefined = await vscode.window.showQuickPick(profiles, { ignoreFocusOut: true, placeHolder: 'Select the Profile you want to define Apex Class Access' })
    if (res !== undefined) {
      resolve(res)
    } else {
      reject('Profiles Configuration Aborted')
    }
  })
}

async function pickMany(profiles: ProfileFile[], preselected: string[] = []): Promise<ProfileFile[]> {
  let selected: string[] = preselected || []

  const profilesOptions = profiles.map(prof => {
    return { ...prof, picked: selected.includes(prof.label) }
  })

  return new Promise(async (resolve, reject) => {
    const res: any | undefined = await vscode.window.showQuickPick(profilesOptions, { ignoreFocusOut: true, placeHolder: 'Select all Profiles you want to add fields visibility after creation by default.', canPickMany: true })
    if (res !== undefined) {
      res.forEach((element: { picked: boolean }) => {
        delete element.picked
      })
      resolve(res)
    } else {
      reject('Profiles Configuration Aborted')
    }
  })
}

async function pickUserPermission(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const res: any | undefined = await vscode.window.showQuickPick(Object.keys(ProfileUserPermission), { ignoreFocusOut: true, placeHolder: 'Select the User Permission you want to check on all profiles' })
    if (res !== undefined) {
      resolve(res)
    } else {
      reject('User Permission choice Aborted')
    }
  })
}

export default {
  pickOne,
  pickMany,
  pickUserPermission
}