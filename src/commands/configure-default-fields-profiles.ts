import ConfigManager from '../config/config-manager'
import * as vscode from 'vscode'
import ProfileFile from './metadatamanagement/profiles/structures/ProfileFile'
import ProfileFilesManager from './metadatamanagement/profiles/ProfileFilesManager'
import Prompts from './builders/prompts/Prompts'
import Monitor from '../monitoring/monitor'

export default async function configureDefaultFieldsProfiles() {
  Monitor.getInstance().sendEvent('configureDefaultFieldsProfiles')
  try {
    const profiles = ProfileFilesManager.getObjectsFromMetaData()
    let preselected: string[] = []

    if (ConfigManager.getInstance().getConfig().defaultProfiles !== undefined) {
      let stored = ConfigManager.getInstance().getConfig().defaultProfiles || []
      preselected = stored.map(el => el.label)
    }
    const selectedProfiles = await Prompts.profiles.pickMany(profiles, preselected)
    ConfigManager.getInstance().getConfig().defaultProfiles = selectedProfiles
  } catch (err) {
    vscode.window.showErrorMessage(err)
    console.log(err)
  }

}