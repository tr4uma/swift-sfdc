import * as vscode from 'vscode'
import * as xml2js from 'xml2js'
import { parseBooleans } from 'xml2js/lib/processors'
import * as path from 'path'
import * as fs from 'fs'
import SObjectFile from './interfaces/sObjects/SObjectFile'
import { PathLike } from 'fs'
import SObjectFieldType from './interfaces/sObjects/SObjectFieldType'
import SObjectFieldDefinition from './interfaces/sObjects/SObjectFieldDefinition'
import SObjectFieldBuilders from './builders/SObjectFieldBuilders'


// SFDC Metadata types selection
async function pickSObjectType(sObjectDefinitions: SObjectFile[]): Promise<SObjectFile | undefined> {
  const res: SObjectFile | undefined = await vscode.window.showQuickPick(sObjectDefinitions, { ignoreFocusOut: true, placeHolder: 'Select an SObject Type' })
  return res
}

async function fieldCreationWizard(otherFields: SObjectFieldDefinition[], availableSObjectsList: string[]): Promise<SObjectFieldDefinition> {
  let forbiddenApiNames = otherFields.map(field => field.fullName)
  return new Promise(async (resolve, reject) => {
    try {
      const pickedFieldType = await pickSObjectFieldType()
      let obj: SObjectFieldDefinition = await SObjectFieldBuilders[pickedFieldType](forbiddenApiNames, availableSObjectsList)
      resolve(obj)
    } catch (err) {
      reject(err)
    }
  })
}

async function pickSObjectFieldType(): Promise<SObjectFieldType> {
  return new Promise(async (resolve, reject) => {
    const res: any | undefined = await vscode.window.showQuickPick(Object.keys(SObjectFieldType).map(el => { return { label: el, value: el } }), { ignoreFocusOut: true, placeHolder: 'Select a Field Type' })
    res !== undefined ? resolve(res.value) : reject('Field Creation Aborted')
  })
}

// File I/O
function getObjectsFromMetaData(): SObjectFile[] {
  const p = path.join(vscode.workspace.rootPath as string, 'src', 'objects')
  const files = fs.readdirSync(p)
  if (files.length === 0) { throw Error('No SObject definition file was found in folder ' + p) }
  return generateSObjectDefinitions(files, p)
}

function generateSObjectDefinitions(fileNames: string[], path: fs.PathLike): SObjectFile[] {
  return fileNames.map(filename => new SObjectFile(filename, path))
}

async function readSObjectDefinitionFile(objDef: SObjectFile): Promise<any> {
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

function writeSObjectDefinitionFile(fileNamePath: PathLike, stuffToWrite: any) {
  const builder = new xml2js.Builder({ xmldec: { standalone: undefined, encoding: 'UTF-8', version: '1.0' } })
  //Probably there's a bug in the builder class
  const xml = builder.buildObject(stuffToWrite)
  //130 is the number of characters of the first two lines containing header + root object definition
  let escaped = xml.substr(0, 130) + xml.substr(130, xml.length - 130).replace(/"/g, '&quot;').replace(/'/g, '&apos;')
  fs.writeFileSync(fileNamePath.toString(), escaped, 'utf8')
}

// Main functionality
export default async function createField() {
  const SObjectFiles = await getObjectsFromMetaData()
  const pickedSObject: SObjectFile | undefined = await pickSObjectType(SObjectFiles)
  if (pickedSObject) {
    try {

      const objectDefinition: any = await readSObjectDefinitionFile(pickedSObject)
      const sobjectFieldDefinition: any = await fieldCreationWizard(objectDefinition.CustomObject.fields, SObjectFiles.map(file => file.label))

      objectDefinition.CustomObject.fields.push(sobjectFieldDefinition)
      objectDefinition.CustomObject.fields.sort((a: any, b: any) => { return a.fullName.localeCompare(b.fullName) })
      //vscode.window.showInformationMessage('file read from system')

      writeSObjectDefinitionFile(path.join(pickedSObject.folder.toString(), pickedSObject.fileName), objectDefinition)

    } catch (err) {
      vscode.window.showErrorMessage(err)
      console.log(err)
    }
  }
}


/*
const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
//Styandard initialization
const xmlParser = new xml2js.Parser()

//parsing the file and putting it into string
const parsedFile: any = await new Promise((resolve, reject) => {
  xmlParser.parseString(fileContent, (err: any, result: any) => {
    if (err) { reject(err) }
    else { resolve(result) }
  })
})

//Standard builder initialization
const builder = new xml2js.Builder()
const xml = builder.buildObject(parsedFile)
//Writing xml back to file
fs.writeFileSync(filePath, xml, 'utf8')
*/