import * as vscode from 'vscode'
import ProfileFilesManager from './metadatamanagement/profiles/ProfileFilesManager'
import Prompts from './builders/prompts/Prompts'
import UserPermission from './metadatamanagement/profiles/structures/profile-fields-templates/UserPermission'

async function configureProfilesForPermission(profileMetas: { name: string, meta: any }[], permission: string): Promise<string> {

  const options = profileMetas.map(prof => {
    let picked = false
    let found = false
    if (prof.meta.Profile.userPermissions) {
      found = prof.meta.Profile.userPermissions.find((perm: UserPermission) => {
        return perm.name === permission
      })
      if (found) { picked = true }
    }
    return {
      label: prof.name,
      picked,
      description: `(${picked ? 'Enabled on profile' : (found ? 'Disabled on profile' : 'Not in profile')})`
    }
  })

  return new Promise(async (resolve, reject) => {
    const res: any | undefined = await vscode.window.showQuickPick(options, { ignoreFocusOut: true, placeHolder: `Select all Profiles you want to enable permission ${permission}.`, canPickMany: true })
    if (res !== undefined) {
      resolve(res.map((el: { label: any; }) => el.label))
    } else {
      reject('Profiles Configuration Aborted')
    }
  })
}

/**
 * The behaviour is: we check the files and pre-select the enabled ones.
 * Then we show the user the entire list and prompt for selection
 * In the end, we turn off all the permissions already contained in the profile metadata file, 
 * turning then on the selected ones and adding the missing ones
 * No disabled new permission is added
 */
export default async function configureProfilesApexClasses() {
  try {
    const permission = await Prompts.profiles.pickUserPermission()
    const profiles = ProfileFilesManager.getObjectsFromMetaData()

    const unpackedProfileMetas = await Promise.all(profiles.map(async prof => {
      return {
        name: prof.label,
        meta: await ProfileFilesManager.readProfileDefinitionFile(prof)
      }
    }))

    const selectedProfiles = await configureProfilesForPermission(unpackedProfileMetas, permission)

    await Promise.all(profiles.map(async prof => {
      await ProfileFilesManager.updateProfileSinglePermission(prof, permission, selectedProfiles.includes(prof.label))
    }))

    vscode.window.showInformationMessage(`Updated user permissions for ${permission} on all profiles`)

  } catch (err) {
    vscode.window.showErrorMessage(err)
    console.log(err)
  }
}