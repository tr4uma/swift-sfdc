import * as vscode from 'vscode'
import TelemetryReporter from 'vscode-extension-telemetry'
const fesTa = Buffer.from('NDk1ZjYzOTItNzE1NC00MjNkLThlYzYtMDNhYmRmNjcyMDA3', 'base64').toString()

export default class Monitor {
    private monitor?: TelemetryReporter = undefined
    private static instance: Monitor

    static getInstance(): Monitor {
        if (this.instance === undefined) {
          this.instance = new Monitor()
        }
        return this.instance
      }

    init(context: vscode.ExtensionContext) {
        const extensionId = 'tr4uma.swift-sfdc'
        const extension = vscode.extensions.getExtension(extensionId)!
        const extensionVersion = extension.packageJSON.version
        this.monitor = new TelemetryReporter(extensionId, extensionVersion, fesTa)
        context.subscriptions.push(this.monitor)
    }

    sendEvent(tag: string, properties?: {[key: string]: string;}, measurements?: {[key: string]: number;}): void {
        try{
            if(this.monitor) { this.monitor.sendTelemetryEvent(tag, properties, measurements) }
        } catch (err) {
            console.log(err)
        }
    }

    sendError(tag: string, properties?: {[key: string]: string;}, measurements?: {[key: string]: number;}): void {
        try{
            if(this.monitor) { this.monitor.sendTelemetryErrorEvent(tag, properties, measurements) }
        } catch (err) {
            console.log(err)
        }
    }


    dispose(): void {
        try {
            if(this.monitor) { this.monitor.dispose() }
        } catch (err) {
            console.log(err)
        }
    }
}