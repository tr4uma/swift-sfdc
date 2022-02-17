import * as vscode from 'vscode'
import * as path from 'path'
import Monitor from '../monitoring/monitor'
import ConfigManager from '../config/config-manager'
import Prompts from './builders/prompts/Prompts'

// Main functionality
export default async function resetConfig() {
  Monitor.getInstance().sendEvent('resetConfig')
  try {
    let result = await Prompts.utils.confirmation()
    ConfigManager.getInstance().resetToDefault()
    vscode.window.showInformationMessage(`Configuration file was reset to default.`)
  } catch (err) {
    vscode.window.showErrorMessage(err)
    Monitor.getInstance().sendError('resetConfig', {message: err.message, name: err.name, stackTrace: err.stack})
    console.log(err)
  }
}