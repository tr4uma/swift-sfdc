import SwiftSfdcConfiguration from './config'
import * as path from 'path'
import * as vscode from 'vscode'
import * as fs from 'fs'

export default class ConfigManager {

  private static instance: ConfigManager

  static getInstance(): ConfigManager {
    if (this.instance === undefined) {
      this.instance = new ConfigManager()
    }
    return this.instance
  }

  private constructor() { this.init() }

  private getCfgPath = () => path.join(vscode.workspace.rootPath as string, '.swift💫sfdc.json')

  private _currentConfig: any = undefined

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

  private storeConfig(config: SwiftSfdcConfiguration): boolean {
    try {
      console.log('Storing configuration..')
      fs.writeFileSync(this.getCfgPath(), JSON.stringify(config))
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
      const handler: ProxyHandler<SwiftSfdcConfiguration> = {
        get(target: SwiftSfdcConfiguration, property: PropertyKey) {
          return target[property]
        },
        set(target: SwiftSfdcConfiguration, property: PropertyKey, value: any): boolean {
          target[property] = value
          return ConfigManager.getInstance().storeConfig(target)
        }
      }
      this._currentConfig = new Proxy(config, handler)
      this.storeConfig(this._currentConfig)
    }
  }
}