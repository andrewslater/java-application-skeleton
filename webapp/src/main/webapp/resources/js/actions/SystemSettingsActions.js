import { Schemas } from '../middleware/api'
import { generateApiAction } from "./factories/RestActionFactory"

export const LOAD_SYSTEM_SETTINGS = "LOAD_SYSTEM_SETTINGS";
export const LOAD_SYSTEM_SETTINGS_SUCCESS = "LOAD_SYSTEM_SETTINGS_SUCCESS";
export const LOAD_SYSTEM_SETTINGS_FAIL = "LOAD_SYSTEM_SETTINGS_FAIL";

export function loadSettings() {
    return generateApiAction({
        action: LOAD_SYSTEM_SETTINGS,
        endpoint: "admin/settings",
        schema: Schemas.SYSTEM_SETTINGS
    });
}

export const PATCH_SYSTEM_SETTINGS = "PATCH_SYSTEM_SETTINGS";
export const PATCH_SYSTEM_SETTINGS_SUCCESS = "PATCH_SYSTEM_SETTINGS_SUCCESS";
export const PATCH_SYSTEM_SETTINGS_FAIL = "PATCH_SYSTEM_SETTINGS_FAIL";

export function patchSettings(settings) {
    return generateApiAction({
        action: PATCH_SYSTEM_SETTINGS,
        endpoint: "admin/settings",
        method: "PATCH",
        data: JSON.stringify(settings),
        schema: Schemas.SYSTEM_SETTINGS
    });
}
