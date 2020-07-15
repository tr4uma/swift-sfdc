'use strict'
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import cmd from './commands'
import ConfigManager from './config/config-manager'
import Monitor from './monitoring/monitor'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  console.log('Managing configuration...')

  const cfgMgr = ConfigManager.getInstance()

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.createField', cmd.createField))
  context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.configureDefaultFieldsProfiles', cmd.configureDefaultFieldsProfiles))
  context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.configureProfilesApexClasses', cmd.configureProfilesApexClasses))
  context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.configureProfilesApexPages', cmd.configureProfilesApexPages))
  context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.configureProfilesUserPermissions', cmd.configureProfilesUserPermissions))
  context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.configureCrossProfileUserPermission', cmd.configureCrossProfileUserPermission))
  context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.configureProfilesFLS', cmd.configureProfilesFLS))


  vscode.commands.executeCommand('setContext', 'swift-sfdc-active', true)

  Monitor.getInstance().init(context)

  Monitor.getInstance().sendEvent('init')

  console.log('Congratulations, your extension "swift-sfdc" is now active!')
}

// this method is called when your extension is deactivated
export function deactivate() { 
  Monitor.getInstance().dispose()
 }
