import * as vscode from 'vscode'
import ProfileFilesManager from './metadatamanagement/profiles/ProfileFilesManager'
import Prompts from './builders/prompts/Prompts'
import ProfileUserPermission from './metadatamanagement/profiles/structures/ProfileUserPermission'
import UserPermission from './metadatamanagement/profiles/structures/profile-fields-templates/UserPermission'
import Monitor from '../monitoring/monitor'

async function configureUserPermissions(profile: string, userPermissions: string[], preselectedPermissionsMap: any): Promise<any> {

  const permissionOptions = userPermissions.map(perm => {
    let picked = preselectedPermissionsMap[perm] && preselectedPermissionsMap[perm].enabled
    let found = !!preselectedPermissionsMap[perm]
    return { label: perm, picked, description: `(${picked ? 'Enabled on profile' : (found ? 'Disabled on profile' : 'Not in profile')})` }
  })

  return new Promise(async (resolve, reject) => {
    const res: any | undefined = await vscode.window.showQuickPick(permissionOptions, { ignoreFocusOut: true, placeHolder: `Select all user permissions for profile ${profile}.`, canPickMany: true })
    if (res !== undefined) {
      // res.forEach((element: { picked: boolean }) => {
      //   delete element.picked
      // })
      resolve(res)
    } else {
      reject('Profile User Permission Configuration Aborted')
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
export default async function configureProfilesUserPermissions() {
  Monitor.getInstance().sendEvent('configureProfilesUserPermissions')
  try {
    const profiles = ProfileFilesManager.getObjectsFromMetaData()
    const selectedProfile = await Prompts.profiles.pickOne(profiles)
    const unpackedProfile = await ProfileFilesManager.readProfileDefinitionFile(selectedProfile)
    const userPermissions: UserPermission[] = unpackedProfile.Profile.userPermissions
    const mappedPermissions = userPermissions.reduce((acc: any, current: any) => {
      acc[current.name] = current
      return acc
    }, {})

    const enabledPermissions: string[] = (await configureUserPermissions(selectedProfile.label, Object.keys(ProfileUserPermission), mappedPermissions) || []).map((el: { label: string }) => el.label)

    ProfileFilesManager.updateProfilesUserPermissions(selectedProfile, enabledPermissions)

    vscode.window.showInformationMessage(`Updated user permissions on profile ${selectedProfile.label}`)
  } catch (err) {
    vscode.window.showErrorMessage(err)
    console.log(err)
  }
}