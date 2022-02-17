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

  private getCfgPath = () => path.join(this.getVSCodeRoot() as string, '.swift-sfdc.json')

  private _currentConfig: any = undefined

  retrieveBackwardCompatibleRootFolder(): string {
    let projRoot = this.getConfig().sfRootFolder
    if(!projRoot) {
      if(this.autodiscoverProjectStructure() === MetadataStructure.SF_Original) {
        this.setAntProjectStructure(this.getConfig())
      } else {
        this.setSFDXProjectStructure(this.getConfig())
      }
      
    }
    projRoot = this.getConfig().sfRootFolder
    return projRoot
  }

  private setSFDXProjectStructure(config: SwiftSfdcConfiguration) {
    config.sfRootFolder = './force-app/main/default'
    config.metadataStructure = MetadataStructure.SF_SFDX
    config.packageLocation = './manifest/'
  }

  private setAntProjectStructure(config: SwiftSfdcConfiguration) {
    config.sfRootFolder = 'src'
    config.metadataStructure = MetadataStructure.SF_Original
    config.packageLocation = './'
  }

  getConfig(): SwiftSfdcConfiguration {
    return this._currentConfig
  }

  readConfig(): SwiftSfdcConfiguration | undefined {
    if (this.getVSCodeRoot() && fs.existsSync(this.getCfgPath())) {
      const storedCfg = fs.readFileSync(this.getCfgPath(), 'utf8')
      const cfg: SwiftSfdcConfiguration = JSON.parse(storedCfg)
      return cfg
    }
    return undefined
  }

  private autodiscoverProjectStructure(): MetadataStructure {
    console.log('Autodiscoverying Project Structure..')
    let projStructure = MetadataStructure.SF_SFDX //defaulting to new structure
    if(fs.existsSync(`${this.getVSCodeRoot()}/src/package.xml`)) {
      projStructure = MetadataStructure.SF_Original
    }
    console.log(`Configured ${projStructure} project structure`)
    return projStructure
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
        if(this.autodiscoverProjectStructure() === MetadataStructure.SF_Original) {
          this.setAntProjectStructure(config)
        } else {
          this.setSFDXProjectStructure(config)
        }
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

  getVSCodeRoot(): string | undefined {
    return vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri.path
  }
}