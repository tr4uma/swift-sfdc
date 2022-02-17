import * as vscode from 'vscode'
import * as path from 'path'
import Monitor from '../monitoring/monitor'
import ConfigManager from '../config/config-manager'
import Prompts from './builders/prompts/Prompts'

// Main functionality
export default async function reloadConfig() {
  Monitor.getInstance().sendEvent('reloadConfig')
  try {
    let result = await Prompts.utils.confirmation()
    ConfigManager.getInstance().reloadConfig()
    vscode.window.showInformationMessage(`Configuration file was reloaded.`)
  } catch (err) {
    vscode.window.showErrorMessage(err)
    Monitor.getInstance().sendError('reloadConfig', {message: err.message, name: err.name, stackTrace: err.stack})
    console.log(err)
  }
}