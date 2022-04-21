import * as path from 'path'
import * as fs from 'fs'
import * as xml2js from 'xml2js'
import { parseBooleans } from 'xml2js/lib/processors'
import ConfigManager from '../config/config-manager'

function writeDiagramFile(diagram: any) {
    if(ConfigManager.getInstance().getVSCodeRoot() !== undefined) {
        const fileNamePath = path.join(ConfigManager.getInstance().getVSCodeRoot() || ConfigManager.getInstance().getConfig().sfRootFolder, 'ERDiagram.xml')
        const builder = new xml2js.Builder({ xmldec: { standalone: true, encoding: 'UTF-8', version: '1.0' }, renderOpts: {pretty: true, indent: '    ', newline: '\n'} })
        const xml = builder.buildObject(diagram)
        fs.writeFileSync(fileNamePath, xml, 'utf8')
    }
}

async function readTestXML() {
    const fileContent = fs.readFileSync(path.join(ConfigManager.getInstance().getVSCodeRoot() || './', 'festa.xml'), { encoding: 'utf-8' })
    const xmlParser = new xml2js.Parser({ explicitArray: false, valueProcessors: [parseBooleans] })
    const parsedFile: any = await new Promise((resolve, reject) => {
        xmlParser.parseString(fileContent, (err: any, result: any) => {
        if (err) { reject(err) }
        else { resolve(result) }
        })
    }) 
    fs.writeFileSync(path.join(ConfigManager.getInstance().getVSCodeRoot() || './', 'XML.JSON'), JSON.stringify(parsedFile))
}

function generateRandomId(length: Number) {
    let result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * (charactersLength - 1)))
    }
    return result
}

export default {
    async generateEntityDiagram(entitiesWithRels: any[]) {
        let erDiagram: any = { mxfile: {
        "$": {
            etag: generateRandomId(20),
        },
        diagram: {
            "$": {
                id: generateRandomId(20),
                name: 'Page-1'
            },
            mxGraphModel: {
                "$": { dx: '1000', dy: '1000', grid: '1', gridSize: '10', guides: '1', tooltips: '1', connect: '1', arrows: '1', fold: '1', page: '1', pageScale: '1', pageWidth: '1000', pageHeight: '1000', math: '0', shadow: '0' },
                root: { mxCell: [ { "$": { id: '0' } }, { "$": { id: '1', parent: '0' } } ] }
            }
        }}}

        const figuresId = generateRandomId(20)
        let entitiesMap: any = {}
        let i = 0

        // Main Entities
        for(i = 0; i < entitiesWithRels.length; i++) {
            let currentEntity = entitiesWithRels[i]
            currentEntity.graphId = `${figuresId}-${i+1}`
            entitiesMap[currentEntity.entityName] = currentEntity
            erDiagram.mxfile.diagram.mxGraphModel.root.mxCell.push(
                {
                    "$": {
                        id: currentEntity.graphId,
                        value: currentEntity.entityName,
                        style: "rounded=0;whiteSpace=wrap;html=1;",
                        vertex: '1',
                        parent: '1'
                    },
                    mxGeometry: { "$": { x: '80', y: '100', width: '120', height: '60', as: 'geometry' } }
                }
            )
        }
        // Relationships
        Object.values(entitiesMap).forEach((entity: any) => {
            entity.parents && entity.parents.forEach((parent: any) => {
                i+=1
                let arrowId = `${figuresId}-${i+1}`
                
                erDiagram.mxfile.diagram.mxGraphModel.root.mxCell.push(
                    {
                        "$": {
                            id: arrowId,
                            value: '',
                            style: "endArrow=classic;html=1;rounded=0;exitX=0.5;exitY=0.5;exitDx=0;exitDy=0;entryX=0.5;entryY=1;entryDx=0;entryDy=0;",
                            edge: '1',
                            parent: '1',
                            source: entity.graphId,
                            target: entitiesMap[parent.parentName] && entitiesMap[parent.parentName].graphId 
                        },
                        mxGeometry: {
                            "$": {
                                width: '50',
                                height: '50',
                                relative: '1',
                                as: 'geometry'
                            },
                            mxPoint: [
                                { "$": { x: '500', y: '500', as: 'sourcePoint' } },
                                { "$": { x: '500', y: '500', as: 'targetPoint' } }
                            ]
                        }
                    }
                )
                
                i+=1
                erDiagram.mxfile.diagram.mxGraphModel.root.mxCell.push(
                    {
                        "$": {
                            id: `${figuresId}-${i+1}`,
                            value: parent.relationshipField,
                            style: 'edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];',
                            vertex: '1',
                            connectable: '0',
                            parent: arrowId
                        },
                        mxGeometry: { "$": { x: '-0.1198', y: '-1', relative: '1', as: 'geometry' },
                            mxPoint: { "$": { x: '-3', as: 'offset' }
                            }
                        }
                    })
            })
        })

        writeDiagramFile(erDiagram)
    }   
}