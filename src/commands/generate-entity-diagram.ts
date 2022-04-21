import * as vscode from 'vscode'
import sObjFileMgr from './metadatamanagement/sObjects/SObjectFilesManager'
import Prompts from './builders/prompts/Prompts'
import Monitor from '../monitoring/monitor'
import SObjectFile from './metadatamanagement/sObjects/structures/SObjectFile'
import DiagramManager from '../misc/DiagramManager'

async function pickRelationships(entity: any): Promise<any[]> {
  return new Promise(async (resolve, reject) => {
    const opts = entity.parents.map( (el: { relationshipField: any; parentName: any }) => {
      return {
        ...el,
        picked: true,
        label: el.relationshipField,
        description: `related to ${el.parentName}`
      }
    })
    console.log(entity)
    const res: any[] | undefined = await vscode.window.showQuickPick(opts, { ignoreFocusOut: true, placeHolder: `Pick relationships to include in the diagram for ${entity.entityName}`, canPickMany: true })
    if (res !== undefined) {
      resolve({
        ...entity,
        parents: res
        }
      )
    } else {
      reject('SObjects selection Aborted')
    }
  })
}

// Main functionality
export default async function resetConfig() {
  Monitor.getInstance().sendEvent('generateER')
  try {
    const SObjectFiles = await sObjFileMgr.getObjectsFromMetaData()
    const pickedSObjects: SObjectFile[] = await Prompts.sObjects.pickMany(SObjectFiles)
    const selectedSObjectNames = new Set(pickedSObjects.map(sObj => sObj.label))
    const entitiesWithRels: any = await Promise.all(pickedSObjects.map(async sObj => {
      const sObjDef: any = await sObjFileMgr.readSObjectDefinitionFile(sObj)
      const entityWithRel = {
        entityName: sObj.label,
        parents: sObjDef.CustomObject.fields.filter((field: { type: any; referenceTo: any; fullName: any }) => {
          let parentName = field.referenceTo
          if((field.type === 'Lookup' || field.type === 'MasterDetail') && parentName === undefined) parentName = field.fullName.substring(0, field.fullName.length - 2)
          return parentName !== undefined && selectedSObjectNames.has(parentName) && (field.type === 'Lookup' || field.type === 'MasterDetail')
        }).map((field: { referenceTo: any; fullName: any }) => {
          return {
            parentName: field.referenceTo || field.fullName.substring(0, field.fullName.length - 2),
            relationshipField: field.fullName
          }
        })
      }
      return entityWithRel
    }))
    let rels = []
    const selectRelationships = await Prompts.utils.selectRels()
    if(selectRelationships) {
      for ( const entity of Object.values(entitiesWithRels)) {
        let filtered = await pickRelationships(entity)
        console.log(filtered)
        rels.push(filtered)
      }
    } else {
      rels = entitiesWithRels
    }

    DiagramManager.generateEntityDiagram(rels)

    vscode.window.showInformationMessage(`Entity Diagram has been generated in the project root folder.`)
  } catch (err) {
    vscode.window.showErrorMessage(err.message)
    Monitor.getInstance().sendError('generateER', {message: err.message, name: err.name, stackTrace: err.stack})
  }
}