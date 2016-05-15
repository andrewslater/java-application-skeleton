import { Schemas } from '../middleware/api'
import { generatePaginatedApiAction } from "./factories/RestActionFactory"

export const ADMIN_LOAD_USERS = "ADMIN_LOAD_USERS";
export const ADMIN_LOAD_USERS_SUCCESS = "ADMIN_LOAD_USERS_SUCCESS";
export const ADMIN_LOAD_USERS_FAIL = "ADMIN_LOAD_USERS_FAIL";

export function loadUsers(paginationContext, pageNum, sorts, filter) {
    return generatePaginatedApiAction({
        requestType: ADMIN_LOAD_USERS,
        endpoint: "admin/users",
        schema: Schemas.USER_ARRAY,
        paginationContext,
        pageNum,
        sorts,
        filter
    });
}
