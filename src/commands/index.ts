import createField from './create-field'
import configureDefaultFieldsProfiles from './configure-default-fields-profiles'
import configureProfilesApexClasses from './configure-profiles-apex-classes'
import configureProfilesApexPages from './configure-profiles-apex-pages'
import configureProfilesUserPermissions from './configure-profiles-user-permissions'
import configureCrossProfileUserPermission from './configure-cross-profile-user-permission'
import configureProfilesFLS from './configure-profiles-fls'
import resetConfig from './reset-config'
import reloadConfig from './reload-config'
import generateEntityDiagram from './generate-entity-diagram'

export default {
  createField,
  configureDefaultFieldsProfiles,
  configureProfilesApexClasses,
  configureProfilesApexPages,
  configureProfilesUserPermissions,
  configureCrossProfileUserPermission,
  configureProfilesFLS,
  resetConfig,
  reloadConfig,
  generateEntityDiagram
}