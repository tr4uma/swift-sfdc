import * as vscode from 'vscode'
import ProfileFile from './metadatamanagement/profiles/structures/ProfileFile'
import ProfileFilesManager from './metadatamanagement/profiles/ProfileFilesManager'
import ApexPagesFileManager from './metadatamanagement/apexPages/apexPagesFileManager'
import ApexPageFile from './metadatamanagement/apexPages/structures/ApexPageFile'
import ProfilesFileMgr from './metadatamanagement/profiles/ProfileFilesManager'

async function pickProfile(profiles: ProfileFile[]): Promise<ProfileFile> {
  return new Promise(async (resolve, reject) => {
    const res: any | undefined = await vscode.window.showQuickPick(profiles, { ignoreFocusOut: true, placeHolder: 'Select the Profile you want to define Apex Class Access' })
    if (res !== undefined) {
      resolve(res)
    } else {
      reject('Profiles Configuration Aborted')
    }
  })
}

async function configureClassAccessForProfile(profile: string, classes: ApexPageFile[], preselectedClasses: string[]): Promise<any> {

  const classesOptions = classes.map(cls => {
    return { ...cls, picked: preselectedClasses.includes(cls.label) }
  })

  return new Promise(async (resolve, reject) => {
    const res: any | undefined = await vscode.window.showQuickPick(classesOptions, { ignoreFocusOut: true, placeHolder: `Select all Apex Classes you want to add access to profile ${profile}.`, canPickMany: true })
    if (res !== undefined) {
      // res.forEach((element: { picked: boolean }) => {
      //   delete element.picked
      // })
      resolve(res)
    } else {
      reject('Profiles Configuration Aborted')
    }
  })
}

export default async function configureProfilesApexClasses() {
  try {
    const profiles = ProfileFilesManager.getObjectsFromMetaData()
    const selectedProfile = await pickProfile(profiles)
    const unpackedProfile = await ProfileFilesManager.readProfileDefinitionFile(selectedProfile)
    const availableApexPages = await ApexPagesFileManager.getObjectsFromMetaData()
    const selectedApexPages = await configureClassAccessForProfile(selectedProfile.label, availableApexPages, unpackedProfile.Profile.pageAccesses.filter((cls: { enabled: any; }) => cls.enabled).map((pageAccess: { apexPage: any }) => pageAccess.apexPage))
    const selectedApexPagesNames = selectedApexPages.map((page: { label: any }) => page.label)
    ProfilesFileMgr.updateProfilesApexPagesAccess(selectedProfile, selectedApexPagesNames)
    vscode.window.showInformationMessage(`Updated Visualforce pages access on profile ${selectedProfile.label}`)
  } catch (err) {
    vscode.window.showErrorMessage(err)
    console.log(err)
  }
}