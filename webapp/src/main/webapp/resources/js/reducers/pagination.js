import APIClient from '../APIClient'

// TODO: Simplify this logic!
/**
 * Maintains the pagination state which looks like:
 *
 * {
 *      users: {
 *          "admin/list-users": { ... pagination state },
 *          "user-directory": { ... pagination state},
 *          "friends": { ... pagination state}
 *      },
 *      orders: {
 *          "admin/list-orders": { ... pagination state },
 *          "recent-orders": { ... pagination state }
 *      }
 * }
 *
 * "pagination state" contains details like which page is currently being viewed, how many pages are available,
 * how the list is sorted and filtered, and how many items there are total in the collection. The actual elements
 * themselves (the users, orders, etc -- whatever you are listing within the pages) are not present however!
 * We use normalizr (https://www.npmjs.com/package/normalizr) and instead keep pointers to the real elements.
 *
 * This allows us to keep track of many paginated requests for parts of the UI. They are namespaced by schema type.
 * The string identifier e.g. "admin/list-orders" is what we call a 'pagination context'
 *
 * @param state
 * @param action
 * @returns {*}
 */
const pagination = (state = {}, action) => {

    // Handle pagination loading actions
    if (action.loadingPaginationContext && action.loadingPaginationSchema) {
        const key = action.loadingPaginationSchema._itemSchema._key;
        let query = action.loadingPaginationQuery;

        query.sort = APIClient.parseSort(query.sort);

        const loc = `${key}.${action.loadingPaginationContext}`;
        const existingPagination = _.merge({}, _.get(state, loc), {loading: true, loadingQuery: query});
        const pagination = _.merge({}, state, {[key]: {[action.loadingPaginationContext]: existingPagination}});
        return pagination;
    }

    // Handle pagination load success actions
    if (action.loadedPaginationContext) {
        let pagination = action.response ? action.response.pagination : {};
        let entities = action.response ? action.response.entities : {};
        let result = action.response ? action.response.result : {};

        // The API uses 0-based page indexing but the app uses 1-based indexing
        pagination = Object.assign({}, pagination, {
            sort: APIClient.parseSort(pagination.sort),
            number: pagination.number + 1,
            content: result
        });

        const key = _.keys(entities)[0];
        return Object.assign({}, state, {[key]: {[pagination.paginationContext]: pagination}});
    }

    // TODO: Handle pagination load failure actions

    return state;

};

export default pagination;
