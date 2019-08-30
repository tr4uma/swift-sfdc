# 💫 swift-sfdc README

Do you ever feel like working with the salesforce.com platform wastes a lot of time?
Are you tired of switching continuously between the IDE and the platform to create (and retrieve!) the metadata you need?

The <b>swift-sfdc</b> vscode extension aims to make working with the salesforce.com platform <b>lightning fast</b>!
<b>Stop waiting for metadata retrieval and start creating the metadata directly in your local project</b>, without waiting ages to synchronize it from the cloud!

Integrate with other extensions, like ForceCode or MavensMate, to deploy the updated xml files directly to salesforce and create the best developer experience!

## How it works
swift-sfdc is designed to interact with the standard salesforce project structure which you can download using tools like ant, mavensmate or forcecode, where every metadata type is contained within a subfolder of the /src/ root folder:

![Folder Structure](/images/folder_structure.png)

Given this folder structure to your project, the extension is then able to interact with the XML metadata definitions provided by the salesforce API.
You're then free to use your favourite deployment tool to update the code in your org. (Metadata deployment coming soon!)

## Features

### Field Creation
Allows default and basic field configuration to save time while developing apex classes

#### Field Creation: XML Definition Manipulation

Interact with the XML definition of your SObjects and start creating fields directly in your local metadata. Stop with the annoying and boring retrieval process and start pushing metadata straightforward to the platform, saving one round-trip!
Keeping in mind the fast-development goal, fields are usually created with a default configuration. For example, String fields are always created with a default length of 255.
You'll be free to edit the XML metadata on your own or change those configurations directly in salesforce and retrieve them again.

#### Field Creation: Default Profiles!

You have finally managed to save time by creating those custom fields straightforward into the SFDC metadata files. Now you can configure field-level security directly on the profiles metadata, saving even <b>more</b> time! 🎉🎉🎉
<b>Field-level security defaults to edit.<b>This is done on purpose to allow developers saving time, leaving these kind of configurations to admins later on, which will simply have to edit the existing configuration instead of creating it from scratch.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

---------------------------------------------------------------------------------------------------------------

## Release Notes

### 0.0.8
Extension Icon

### 0.0.7
License and webpack configuration

### 0.0.6
Minor bugfixes

### 0.0.5
Minor bugfixes

### 0.0.4
Supporting these types for field creation:
* Lookup
* Number

### 0.0.3

Supporting these types for field creation:
* Checkbox
* Date
* DateTime
* Email
* Text
* TextArea
* LongTextArea
* Phone

And updating configured profiles with their FLS

### 0.0.2

Profile Configuration

### 0.0.1

Field Creation