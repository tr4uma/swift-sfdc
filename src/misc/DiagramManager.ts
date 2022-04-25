import * as path from 'path'
import * as fs from 'fs'
import * as xml2js from 'xml2js'
import { parseBooleans } from 'xml2js/lib/processors'
import ConfigManager from '../config/config-manager'
import { minBy } from 'lodash'

const entityBoxWidth = 120
const entityBoxHeight = 60
const minBoxDistance = 100

function computeDeltaAngle(entityNumber: number) {
    return 360 / entityNumber
}

function computeRadius(entityNumber: number) {
    return Math.ceil((90 / (computeDeltaAngle(entityNumber))) * (Math.max(entityBoxHeight, entityBoxWidth) + minBoxDistance))
}

function computeBoxX(radius: number, angle: number, centerX: number) {
    return centerX + Math.ceil(radius * Math.sin(Math.PI * 2 * angle / 360))
}

function computeBoxY(radius: number, angle: number, centerY: number) {
    return centerY - Math.ceil(radius * Math.cos(Math.PI * 2 * angle / 360))
}

function writeDiagramFile(diagram: any) {
    if(ConfigManager.getInstance().getVSCodeRoot() !== undefined) {
        const fileNamePath = path.join(ConfigManager.getInstance().getVSCodeRoot() || ConfigManager.getInstance().getConfig().sfRootFolder, 'ERDiagram.xml')
        const builder = new xml2js.Builder({ xmldec: { standalone: true, encoding: 'UTF-8', version: '1.0' }, renderOpts: {pretty: true, indent: '    ', newline: '\n'} })
        const xml = builder.buildObject(diagram)
        fs.writeFileSync(fileNamePath, xml, 'utf8')
    }
}

function computeArrowAttributes(sourceX: number, sourceY: number, targetX: number, targetY: number, boxTolerance: number, radius: number): any {
    let result = {} as any
    let deltaX = sourceX - targetX
    let deltaXAbs = Math.abs(deltaX)
    let deltaY = sourceY - targetY
    let deltaYAbs = Math.abs(deltaY)

    // Self relationship
    if (sourceX === targetX && sourceY === targetY) {
        
        if(sourceX <= radius && sourceY <= radius) { // Top - Left corner
            result.exitX = '0'
            result.exitY = '0'
            result.entryX = '0'
            result.entryY = '0'
            result.points = [
                {x: sourceX - 30, y: sourceY - 30},
                {x: sourceX - 60, y: sourceY},
                {x: sourceX - 30, y: sourceY + 30}
            ]
        } else if (sourceX <= radius && sourceY > radius) { // Bottom - Left corner
            result.exitX = '0'
            result.exitY = '1'
            result.entryX = '0'
            result.entryY = '1'
            result.points = [
                {x: sourceX - 30, y: sourceY + entityBoxHeight + 30},
                {x: sourceX - 60, y: sourceY + entityBoxHeight},
                {x: sourceX - 30, y: sourceY + entityBoxHeight - 30}
            ]
        } else if (sourceX > radius && sourceY <= radius) { // Top - Right corner
            result.exitX = '1'
            result.exitY = '0'
            result.entryX = '1'
            result.entryY = '0'
            result.points = [
                {x: sourceX + entityBoxWidth + 30, y: sourceY - 30},
                {x: sourceX + entityBoxWidth + 60, y: sourceY},
                {x: sourceX + entityBoxWidth + 30, y: sourceY + 30}
            ]
        } else { // Bottom - Right corner
            result.exitX = '1'
            result.exitY = '1'
            result.entryX = '1'
            result.entryY = '1'
            result.points = [
                {x: sourceX + entityBoxWidth + 30, y: sourceY + entityBoxHeight + 30},
                {x: sourceX + entityBoxWidth + 60, y: sourceY + entityBoxHeight},
                {x: sourceX + entityBoxWidth + 30, y: sourceY + entityBoxHeight - 30}
            ]
        }
        result.relType = 'self'
        result.style = `edgeStyle=orthogonalEdgeStyle;orthogonalLoop=1;jettySize=auto;html=1;exitX=${result.exitX};exitY=${result.exitY};exitDx=0;exitDy=0;curved=1;entryX=${result.entryX};entryY=${result.entryY};entryDx=0;entryDy=0;`
    } else {
        
        if (deltaXAbs <= boxTolerance) { // Source is right below/above target
            if(deltaY > 0) {  // Source is below target
                result.exitX = '0.75'
                result.exitY = '0'
                result.entryX = '0.75'
                result.entryY = '1'
            } else { // Source is above target
                result.exitX = '0.25'
                result.exitY = '1'
                result.entryX = '0.25'
                result.entryY = '0'
            }
        } else if (deltaX > 0) { // Source is right side to target        
            result.exitX = '0'
            result.exitY = '0.25'
            result.entryX = '1'
            result.entryY = '0.25'
        } else { // Source is left side to target
            result.exitX = '1'
            result.exitY = '0.75'
            result.entryX = '0'
            result.entryY = '0.75'
        }
        result.relType = 'link'
        result.style = `endArrow=classic;html=1;rounded=0;exitX=${result.exitX};exitY=${result.exitY};exitDx=0;exitDy=0;entryX=${result.entryX};entryY=${result.entryY};entryDx=0;entryDy=0;`
    }

    return result
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

        const radius = computeRadius(entitiesWithRels.length)
        const centerX = radius + minBoxDistance
        const centerY = radius + minBoxDistance
        const deltaAngle = computeDeltaAngle(entitiesWithRels.length)

        // Main Entities
        for(i = 0; i < entitiesWithRels.length; i++) {
            let currentEntity = entitiesWithRels[i]
            currentEntity.graphId = `${figuresId}-${i+1}`
            currentEntity.x = computeBoxX(radius, deltaAngle * i, centerX)
            currentEntity.y = computeBoxY(radius, deltaAngle * i, centerY)
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
                    mxGeometry: { "$": { x: currentEntity.x, y: currentEntity.y, width: entityBoxWidth, height: entityBoxHeight, as: 'geometry' } }
                }
            )
        }
        const boxTolerance = Math.ceil(Math.cos(deltaAngle / 2) * radius)
        // Relationships
        Object.values(entitiesMap).forEach((entity: any) => {
            // tslint:disable-next-line: no-unused-expression
            entity.parents && entity.parents.forEach((parent: any) => {
                i += 1
                let arrowId = `${figuresId}-${i + 1}`
                const source = entity
                const target = entitiesMap[parent.parentName]

                const arrowAttrs = computeArrowAttributes(source.x, source.y, target.x, target.y, boxTolerance, radius)

                const arrow = {
                    "$": {
                        id: arrowId,
                        value: '',
                        style: arrowAttrs.style,
                        edge: '1',
                        parent: '1',
                        source: source.graphId,
                        target: target && target.graphId
                    },
                    mxGeometry: {
                        "$": {
                            //width: '50',
                            //height: '50',
                            relative: '1',
                            as: 'geometry'
                        },
                        mxPoint: [] as any
                    } as any
                }
                if(arrowAttrs.relType === 'self') {
                    arrow.mxGeometry.mxPoint.push({ "$": { x: source.x, y: source.y, as: 'targetPoint' }})
                    arrow.mxGeometry.Array = { "$": { as: 'points'}, mxPoint: arrowAttrs.points.map((el: any) => {
                        return { "$": el }
                        })
                    }
                } else {
                    arrow.mxGeometry.mxPoint.push({ "$": { x: '500', y: '500', as: 'sourcePoint' } },
                    { "$": { x: '500', y: '500', as: 'targetPoint' } })
                }
                erDiagram.mxfile.diagram.mxGraphModel.root.mxCell.push(arrow)

                i += 1
                let arrowLabelId = `${figuresId}-${i + 1}`
                erDiagram.mxfile.diagram.mxGraphModel.root.mxCell.push(
                    {
                        "$": {
                            id: arrowLabelId,
                            value: parent.relationshipField,
                            style: 'edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];',
                            vertex: '1',
                            connectable: '0',
                            parent: arrowId
                        },
                        mxGeometry: {
                            "$": { x: '-0.1198', y: '-1', relative: '1', as: 'geometry' },
                            mxPoint: {
                                "$": { x: '-3', as: 'offset' }
                            }
                        }
                    })
            })
        })

        writeDiagramFile(erDiagram)
    }   
}