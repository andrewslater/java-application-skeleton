import { CALL_API, Schemas } from '../middleware/api'
import { generateApiAction } from "./factories/RestActionFactory"

export const LOAD_PRINCIPAL_USER = "LOAD_PRINCIPAL_USER";
export const LOAD_PRINCIPAL_USER_SUCCESS = "LOAD_PRINCIPAL_USER_SUCCESS";
export const LOAD_PRINCIPAL_USER_FAIL = "LOAD_PRINCIPAL_USER_FAIL";

export function loadPrincipalUser() {
    return generateApiAction({
        action: LOAD_PRINCIPAL_USER,
        endpoint: "user",
        schema: Schemas.USER
    });
}
