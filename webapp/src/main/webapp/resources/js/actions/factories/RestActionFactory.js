import APIClient from '../../APIClient'
import { CALL_API, Schemas } from '../../middleware/api'
import removeNullProperties from '../../functions/removeNullProperties'

/**
 * Convenience function for generating thunk actions
 * @param options
 * @returns {function()}
 */
export function generateApiAction(options) {
    return (dispatch) => {
        return dispatch({
            [CALL_API]: {
                types: [options.action, `${options.action}_SUCCESS`, `${options.action}_FAIL`],
                endpoint: options.endpoint,
                method: options.method,
                paginationContext: options.paginationContext,
                data: options.data,
                contentType: options.contentType,
                schema: options.schema
            }
        });
    }
}

/**
 * Expects options:
 * {
 *      requestType: LOAD_USERS,
 *      endpoint: "/users",
 *      paginationContext: "user-directory",
 *      schema: Schemas.USER_ARRAY,
 *      pageNum: 1,
 *      sorts: {fullName: "ASC"},
 *      filter: "bob"
 * }
 */
export function generatePaginatedApiAction(options) {
    if (!_.isString(options.paginationContext) || options.paginationContext.length == 0) {
        throw new Error("Invalid or empty pagination context specified");
    }

    let sorts = _.isString(options.sorts) ? APIClient.parseSort(options.sorts) : options.sorts;

    let params = removeNullProperties({
        page: options.pageNum ? options.pageNum - 1 : null,
        sort: APIClient.sortToQueryParam(sorts),
        filter: options.filter
    });

    return generateApiAction({
        action: options.requestType,
        paginationContext: options.paginationContext,
        endpoint: options.endpoint,
        method: "GET",
        data: params,
        schema: options.schema
    });
}
