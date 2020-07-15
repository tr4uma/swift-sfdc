import * as vscode from 'vscode'
import ProfileFile from './metadatamanagement/profiles/structures/ProfileFile'
import ProfileFilesManager from './metadatamanagement/profiles/ProfileFilesManager'
import ApexPagesFileManager from './metadatamanagement/apexPages/apexPagesFileManager'
import ApexPageFile from './metadatamanagement/apexPages/structures/ApexPageFile'
import ProfilesFileMgr from './metadatamanagement/profiles/ProfileFilesManager'
import Prompts from './builders/prompts/Prompts'
import Monitor from '../monitoring/monitor'

async function configureClassAccessForProfile(profile: string, classes: ApexPageFile[], preselectedPages: string[]): Promise<any> {

  const pagesOptions = classes.map(cls => {
    return { ...cls, picked: preselectedPages.includes(cls.label) }
  })

  return new Promise(async (resolve, reject) => {
    const res: any | undefined = await vscode.window.showQuickPick(pagesOptions, { ignoreFocusOut: true, placeHolder: `Select all Apex Classes you want to add access to profile ${profile}.`, canPickMany: true })
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

export default async function configureProfilesApexPages() {
  Monitor.getInstance().sendEvent('configureProfilesApexPages')
  try {
    const profiles = ProfileFilesManager.getObjectsFromMetaData()
    const selectedProfile = await Prompts.profiles.pickOne(profiles)
    const unpackedProfile = await ProfileFilesManager.readProfileDefinitionFile(selectedProfile)
    const availableApexPages = await ApexPagesFileManager.getObjectsFromMetaData()
    const selectedApexPages = await configureClassAccessForProfile(selectedProfile.label, availableApexPages, unpackedProfile.Profile.pageAccesses.filter((cls: { enabled: any; }) => cls.enabled).map((pageAccess: { apexPage: any }) => pageAccess.apexPage))
    const selectedApexPagesNames = selectedApexPages.map((page: { label: any }) => page.label)
    ProfilesFileMgr.updateProfilesApexPagesAccess(selectedProfile, selectedApexPagesNames)
    vscode.window.showInformationMessage(`Updated Visualforce pages access on profile ${selectedProfile.label}`)
  } catch (err) {
    vscode.window.showErrorMessage(err)
    Monitor.getInstance().sendError('configureProfilesApexPages', {message: err.message, name: err.name, stackTrace: err.stack})
    console.log(err)
  }
}