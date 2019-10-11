# 💫 swift-sfdc README

## 👉🏼 Please rate/review the extension to show support! 👈🏼 

Do you ever feel like working with the salesforce.com platform wastes a lot of time?
Are you tired of switching continuously between the IDE and the platform to create (and retrieve!) the metadata you need?

<b>STOP RETRIEVING, START PUSHING!</b>

The <b>swift-sfdc</b> vscode extension aims to make working with the salesforce.com platform <b>lightning fast</b>!
<b>Stop waiting for metadata retrieval and start creating the metadata directly in your local project</b>, without waiting ages to synchronize it locally from the cloud!

Feel free to integrate swift-sfdc with other extensions, like ForceCode or MavensMate, to deploy the updated xml files directly to salesforce and create the best developer experience!

## How it works
swift-sfdc is designed to interact with the standard salesforce project structure which you can download using tools like ant, mavensmate or forcecode, where every metadata type is contained within a subfolder of the /src/ root folder:

![Folder Structure](/images/folder_structure.png)

Given this folder structure to your project, the extension is then able to interact with the XML metadata definitions provided by the salesforce API.
You're then free to use your favourite deployment tool to update the code in your org. (Metadata deployment coming soon!)

## Features

### Field Creation
Allows default and basic field configuration to save time while developing apex classes.

#### XML Definition Manipulation

![Field Creation](/images/fieldcreation.gif)

Interact with the XML definition of your SObjects and start creating fields directly in your local metadata. Stop with the annoying and boring retrieval process and start pushing metadata straightforward to the platform, saving one round-trip!
Keeping in mind the fast-development goal, fields are usually created with a default configuration. For example, String fields are always created with a default length of 255.
You'll be free to edit the XML metadata on your own or change those configurations directly in salesforce and retrieve them again.

#### Default Profiles for FLS when creating new fields!

You have finally managed to save time by creating those custom fields straightforward into the SFDC metadata files. Now you can configure field-level security directly on the profiles metadata, saving even <b>more</b> time! 🎉🎉🎉
<b>Field-level security defaults to edit.</b> This is done on purpose to allow developers saving time, leaving these kind of configurations to admins later on, which will simply have to edit the existing configuration instead of creating it from scratch.

### Profiles Configuration

Configure profiles directly in your local project.

#### Apex Classes & Visualforce Pages access

In-editor manipulation of your profiles' files to manage apex classes and visualforce page accesses.

#### User Permissions and cross-profile User Permission management

Not only you're going to be able to manage User Permissions for a Profile...

![Profile User Permissions](/images/user_single.png)

..but you'll be able to check them cross-profile as well:

![Cross-Profile Permission](/images/user_cross.png)

These features are designed to simply add new permissions when they are enabled, leaving everything else as-is.
Based on a pre-defined list of permissions, you'll be able to check a single profile for all permissions or all profiles for a specific one.
A permission gets added to the profiles metadata files only if you enable it.
Basically it's not going to be possible to add a piece of metadata where you disable a permission if it wasn't previously retrieved.
It's only possible to enable new non-previously-retrieved permissions (and add them to the metadata) or disable currently enabled permissions.
This is done to somehow emulate salesforce behaviour on metadata retrieval and avoid polluting files with non-useful metadata.

#### Field-Level Security management

Edit your profiles' Field-Level Security directly from the extension. It supports search for access level. You'll be finally able to find fields with no access and easily update them!

![Field-Level Security](/images/fls_mgmt.png)

## Known Issues

User Permission list might be outdated/not complete, feel free to pull request!

---------------------------------------------------------------------------------------------------------------

## Release Notes

### 0.0.16
Minor Bugfix (Visible Lines for long text areas)

### 0.0.15
Minor Bugfixes

### 0.0.14
Field-Level Security Management

### 0.0.13
Minor BugFixes (old systems config files compatibility)

### 0.0.12
Profiles' User Permissions management

### 0.0.11
Profiles' Visualforce Pages Access management

### 0.0.10
Profiles' Apex Classes Access management

### 0.0.9
Minor fixes and new icon

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