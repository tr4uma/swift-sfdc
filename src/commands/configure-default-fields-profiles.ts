import ConfigManager from '../config/config-manager'
import * as vscode from 'vscode'
import ProfileFile from './metadatamanagement/profiles/structures/ProfileFile'
import ProfileFilesManager from './metadatamanagement/profiles/ProfileFilesManager';

async function pickProfiles(profiles: ProfileFile[]): Promise<ProfileFile[]> {
  let selected: string[] = []
  if (ConfigManager.getInstance().getConfig().defaultProfiles !== undefined) {
    let stored = ConfigManager.getInstance().getConfig().defaultProfiles || []
    selected = stored.map(el => el.label)
  }

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

export default async function configureDefaultFieldsProfiles() {
  try {
    const profiles = ProfileFilesManager.getObjectsFromMetaData()
    const selectedProfiles = await pickProfiles(profiles)
    ConfigManager.getInstance().getConfig().defaultProfiles = selectedProfiles
  } catch (err) {
    vscode.window.showErrorMessage(err)
    console.log(err)
  }

}