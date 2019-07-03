import * as vscode from 'vscode'
import * as xml2js from 'xml2js'
import * as path from 'path'
import * as fs from 'fs'
import SObjectDefinition from './interfaces/SObjectDefinition'
import { firstCharLowerCase } from 'xml2js/lib/processors';

function getObjectsFromMetaData(): SObjectDefinition[] {
  const p = path.join(vscode.workspace.rootPath as string, 'src', 'objects')
  const files = fs.readdirSync(p)
  if (files.length === 0) { throw Error('No SObject definition file was found in folder ' + p) }
  return generateSObjectDefinitions(files, p)
}

function generateSObjectDefinitions(fileNames: string[], path: fs.PathLike): SObjectDefinition[] {
  return fileNames.map(filename => new SObjectDefinition(filename, path))
}

async function pickSObjectType(sObjectDefinitions: SObjectDefinition[]): Promise<SObjectDefinition | undefined> {
  const res: SObjectDefinition | undefined = await vscode.window.showQuickPick(sObjectDefinitions, { ignoreFocusOut: true })
  return res
}

async function readSObjectDefinitionFile(objDef: SObjectDefinition): Promise<Object> {
  return new Promise(async (resolve, reject) => {
    const filePath = path.join(objDef.folder.toString(), objDef.fileName)
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const xmlParser = new xml2js.Parser({
      /*'tagNameProcessors': [firstCharLowerCase], 'attrNameProcessors': [firstCharLowerCase], */
      mergeAttrs: true
    })
    try {
      const parsedFile: any = await new Promise((resolve, reject) => {
        xmlParser.parseString(fileContent, (err: any, result: any) => {
          if (err) reject(err)
          else resolve(result)
        })
      })
      resolve(parsedFile)
    } catch (err) {
      reject(err)
    }
  })
}


export default async function createField() {
  const sObjectDefinitions = await getObjectsFromMetaData()
  const pickedSObject: SObjectDefinition | undefined = await pickSObjectType(sObjectDefinitions)
  if (pickedSObject) {
    vscode.window.showInformationMessage('You Picked ' + pickedSObject.label)
    try {
      const objectDefinition = await readSObjectDefinitionFile(pickedSObject)
      if (objectDefinition) {

      }
    } catch (err) {
      console.log(err)
    }
  }
}
//async function pickObject(): Promise<String>