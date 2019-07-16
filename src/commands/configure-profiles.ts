import ConfigManager from '../config/config-manager'
import * as path from 'path'
import * as vscode from 'vscode'
import * as fs from 'fs'
import ProfileFile from './interfaces/profiles/ProfileFile'
import * as xml2js from 'xml2js'
import { parseBooleans } from 'xml2js/lib/processors'

function getProfiles(): ProfileFile[] {
  const p = path.join(vscode.workspace.rootPath as string, 'src', 'profiles')
  const files = fs.readdirSync(p)
  if (files.length === 0) { throw Error('No SObject definition file was found in folder ' + p) }
  return generateProfileFilesDefinitions(files, p)
}

function generateProfileFilesDefinitions(fileNames: string[], path: fs.PathLike): ProfileFile[] {
  return fileNames.map(filename => new ProfileFile(filename, path))
}

async function readProfilesDefinitionFiles(objDef: ProfileFile): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const filePath = path.join(objDef.folder.toString(), objDef.fileName)
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const xmlParser = new xml2js.Parser({ explicitArray: false, valueProcessors: [parseBooleans] })
    try {
      const parsedFile: any = await new Promise((resolve, reject) => {
        xmlParser.parseString(fileContent, (err: any, result: any) => {
          if (err) { reject(err) }
          else { resolve(result) }
        })
      })
      resolve(parsedFile)
    } catch (err) {
      reject(err)
    }
  })
}

async function pickProfiles(profiles: ProfileFile[]): Promise<ProfileFile[]> {
  let selected: string[] = []
  if (ConfigManager.getInstance().getConfig().defaultProfiles !== undefined) {
    let stored = ConfigManager.getInstance().getConfig().defaultProfiles || []
    selected = stored.map(el => el.label)
  }

  const profilesOptions = profiles.map(prof => {
    return { ...prof, picked: selected.includes(prof.label) }
  })

  return new Promise(async (resolve, reject) => {
    const res: any | undefined = await vscode.window.showQuickPick(profilesOptions, { ignoreFocusOut: true, placeHolder: 'Select all Profiles you want to add fields visibility after creation by default.', canPickMany: true })
    if (res !== undefined) {
      res.forEach((element: { picked: boolean }) => {
        delete element.picked
      })
      resolve(res)
    } else {
      reject('Profiles Configuration Aborted')
    }
  })
}

export default async function configureProfiles() {
  try {
    const profiles = getProfiles()
    const selectedProfiles = await pickProfiles(profiles)
    ConfigManager.getInstance().getConfig().defaultProfiles = selectedProfiles
  } catch (err) {
    vscode.window.showErrorMessage(err)
    console.log(err)
  }

}