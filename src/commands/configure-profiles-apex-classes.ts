import * as vscode from 'vscode'
import ProfileFile from './metadatamanagement/profiles/structures/ProfileFile'
import ProfileFilesManager from './metadatamanagement/profiles/ProfileFilesManager'
import ApexClassesFileManager from './metadatamanagement/apexClasses/apexClassesFileManager'
import ApexClassFile from './metadatamanagement/apexClasses/structures/ApexClassFile'
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

async function configureClassAccessForProfile(profile: string, classes: ApexClassFile[], preselectedClasses: string[]): Promise<any> {

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
    const availableApexClasses = await ApexClassesFileManager.getObjectsFromMetaData()
    const selectedApexClasses = await configureClassAccessForProfile(selectedProfile.label, availableApexClasses, unpackedProfile.Profile.classAccesses.filter((cls: { enabled: any; }) => cls.enabled).map((classAccess: { apexClass: any }) => classAccess.apexClass))
    const selectedApexClassesNames = selectedApexClasses.map((cls: { label: any }) => cls.label)
    ProfilesFileMgr.updateProfilesApexClassesAccess(selectedProfile, selectedApexClassesNames)
    vscode.window.showInformationMessage(`Updated classes access on profile ${selectedProfile.label}`)
  } catch (err) {
    vscode.window.showErrorMessage(err)
    console.log(err)
  }
}