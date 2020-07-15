import * as vscode from 'vscode'
import ProfileFilesManager from './metadatamanagement/profiles/ProfileFilesManager'
import ApexClassesFileManager from './metadatamanagement/apexClasses/apexClassesFileManager'
import ApexClassFile from './metadatamanagement/apexClasses/structures/ApexClassFile'
import ProfilesFileMgr from './metadatamanagement/profiles/ProfileFilesManager'
import Prompts from './builders/prompts/Prompts'
import Monitor from '../monitoring/monitor'

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
  Monitor.getInstance().sendEvent('configureProfilesApexClasses')
  try {
    const profiles = ProfileFilesManager.getObjectsFromMetaData()
    const selectedProfile = await Prompts.profiles.pickOne(profiles)
    const unpackedProfile = await ProfileFilesManager.readProfileDefinitionFile(selectedProfile)
    const availableApexClasses = await ApexClassesFileManager.getObjectsFromMetaData()
    const selectedApexClasses = await configureClassAccessForProfile(selectedProfile.label, availableApexClasses, unpackedProfile.Profile.classAccesses.filter((cls: { enabled: any; }) => cls.enabled).map((classAccess: { apexClass: any }) => classAccess.apexClass))
    const selectedApexClassesNames = selectedApexClasses.map((cls: { label: any }) => cls.label)
    ProfilesFileMgr.updateProfilesApexClassesAccess(selectedProfile, selectedApexClassesNames)
    vscode.window.showInformationMessage(`Updated classes access on profile ${selectedProfile.label}`)
  } catch (err) {
    vscode.window.showErrorMessage(err)
    Monitor.getInstance().sendError('configureProfilesApexClasses', {message: err.message, name: err.name, stackTrace: err.stack})
    console.log(err)
  }
}