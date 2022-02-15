import SwiftSfdcConfiguration from './config'
import * as path from 'path'
import * as vscode from 'vscode'
import * as fs from 'fs'
import MetadataStructure from '../commands/metadatamanagement/profiles/structures/MetadataStructure'

export default class ConfigManager {

  private static instance: ConfigManager

  static getInstance(): ConfigManager {
    if (this.instance === undefined) {
      this.instance = new ConfigManager()
    }
    return this.instance
  }

  private constructor() { this.init() }

  private getCfgPath = () => path.join(vscode.workspace.rootPath as string, '.swift-sfdc.json')

  private _currentConfig: any = undefined

  retrieveBackwardCompatibleRootFolder(): string {
    let projRoot = this.getConfig().projectRootFolder
    if(!projRoot) {
      this.setAntProjectStructure()
    }
    projRoot = this.getConfig().projectRootFolder
    return projRoot
  }

  private setSFDXProjectStructure() {
    this.getConfig().projectRootFolder = './force-app/main/default'
    this.getConfig().metadataStructure = MetadataStructure.SF_SFDX
    this.getConfig().packageLocation = './manifest/'
  }

  private setAntProjectStructure() {
    this.getConfig().projectRootFolder = 'src'
    this.getConfig().metadataStructure = MetadataStructure.SF_Original
    this.getConfig().packageLocation = './'
  }

  getConfig(): SwiftSfdcConfiguration {
    return this._currentConfig
  }

  readConfig(): SwiftSfdcConfiguration | undefined {
    if (vscode.workspace.rootPath && fs.existsSync(this.getCfgPath())) {
      const storedCfg = fs.readFileSync(this.getCfgPath(), 'utf8')
      const cfg: SwiftSfdcConfiguration = JSON.parse(storedCfg)
      return cfg
    }
    return undefined
  }

  private autodiscoverProjectStructure(): MetadataStructure {
    if(fs.existsSync('./src/package.xml')) {
      return MetadataStructure.SF_Original
    }
    else {
      return MetadataStructure.SF_SFDX
    }
  }

  private storeConfig(config: SwiftSfdcConfiguration): boolean {
    try {
      console.log('Storing configuration..')
      fs.writeFileSync(this.getCfgPath(), JSON.stringify(config))
      return true
    } catch (err) {
      return false
    }
  }

  private setConfig(config: SwiftSfdcConfiguration): boolean {
    try {
      const handler: ProxyHandler<SwiftSfdcConfiguration> = {
        get(target: any, property: PropertyKey) {
          return target[property]
        },
        set(target: any, property: PropertyKey, value: any): boolean {
          target[property] = value
          return ConfigManager.getInstance().storeConfig(target)
        }
      }
      this._currentConfig = new Proxy(config, handler)
      return true
    } catch (err) {
      return false
    }
  }

  init() {
    console.log('Initializing configuration..')
    if (this._currentConfig === undefined) {
      let config = this.readConfig()
      if (config === undefined) {
        console.log('Configuration not found, generating a new one')
        config = new SwiftSfdcConfiguration()
      }
      this.setConfig(config)
      this.storeConfig(this._currentConfig)
    }
  }

  resetToDefault() {
    console.log('Resetting config to default')
    this.setConfig(new SwiftSfdcConfiguration())
    this.storeConfig(this._currentConfig)
  }

  reloadConfig() {
    let config = this.readConfig()
    if (config === undefined) {
      console.log('Configuration not found, generating a new one')
      config = new SwiftSfdcConfiguration()
    }
    this.setConfig(config)
    this.storeConfig(this._currentConfig)
  }
}