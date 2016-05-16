import _ from 'lodash'
import { connect } from 'react-redux'
import { Schema, arrayOf, normalize } from 'normalizr'
import { denormalize as _denormalize} from 'denormalizr'

import APIClient from '../APIClient'

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
function callApi(endpoint, method, options, schema) {
    var app = require('../app');
    return app.client.ajax(endpoint, method, options)
        .then(data => {
            if (data.totalPages !== undefined) {
                let { filter, sort } = options.data;
                const pagination = Object.assign({endpoint, filter}, _.omit(data, "content"), {sort: APIClient.parseSort(sort)});
                const normalizedContent = data.content.length > 0 ? normalize(data.content, schema) : {entities: {[schema._itemSchema._key]: {}}, result: []};
                data = Object.assign({pagination: pagination}, normalizedContent);
            } else {
                data = normalize(data, schema)
            }
            return Object.assign({}, data);
        }, error => {
            console.log("API Error", error);
            return error;
        });
}

/**
 * Fetches pagination model from the application state. Within our application there is a frequent need to display
 * paginated lists of objects returned by the API. Viewing a list of projects, notifications in a dropdown in the header,
 * or a list of users in a selector dropdown to name a few examples. The 'pagination context' is simply a unique
 * string identifying the context for which the paginated data will be used. The 'schema' passed is a Normalizr
 * schema and is used to namespace the pagination contexts. For example:
 *
 * // TODO: provide detailed example
 *
 * Returns null if no pagination exists or a pagination object which looks like:
 *
 * {
 *      paginationContext: "admin/list-users",
 *      content: [],
 *      number: 2,
 *      filter: "bob",
 *      sort: { email: "ASC" },
 *      first: true,
 *      last: false,
 *      numberOfElements: 10,
 *      size: 10,
 *      totalElements: 401,
 *      totalPages: 41
 * }
 *
 * @param paginationContext the string identifier for the context the pagination will be used
 * @param schema the Normalizr schema for the paginated data
 * @param state Redux state
 * @returns {*}
 */
export function getPagination(paginationContext = '', schema, state = {}) {
    if (!schema) {
        throw Error("No Schema provided to getPagination");
    }
    const entityName = schema._key;
    const pagination = _.get(state, `pagination.${entityName}.${paginationContext}`);
    if (pagination) {
        const entities = _.get(state, `entities.${entityName}`, {});
        let denormalizedContent = _.map(pagination.content, (entityId) => {
            return _denormalize(entities[entityId], state.entities, schema);
        });

        return Object.assign({}, pagination, {content: denormalizedContent});
    }

    return pagination;
}

/**
 * Wraps the redux connect() function providing the component with the details
 * necessary to support pagination.
 * @param component
 * @param paginationContext
 * @param schema
 * @param loadPage
 * @returns {*}
 */
export function connectToPagination(component, paginationContext, schema, loadPage) {

    const mapStateToProps = (state) => {
        return {
            pagination: getPagination(paginationContext, schema, state)
        };
    };

    const _loadPage = (pageNum, sortQuery, filter) => {
        return loadPage(paginationContext, pageNum, sortQuery, filter);
    };

    return connect(mapStateToProps, {
        loadPage: _loadPage
    })(component)
}

// We use these Normalizr schemas to transform API responses from a nested form
// to a flat form where models are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/gaearon/normalizr

const userSchema = new Schema('users', {
    idAttribute: 'userId'
});

const systemSettingsSchema = new Schema('systemSettings');

// Schemas for Github API responses.
export const Schemas = {
    SYSTEM_SETTINGS: systemSettingsSchema,
    USER: userSchema,
    USER_ARRAY: arrayOf(userSchema)
};

export function denormalize(state, entityPath, schema) {

    const entity = _.get(state, `${entityPath}`);

    if (_.isEmpty(entity)) {
        return null;
    }

    return _denormalize(entity, state.entities, schema);
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API');

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
    const callAPI = action[CALL_API];
    if (typeof callAPI === 'undefined') {
        return next(action)
    }

    let { endpoint } = callAPI;
    const { paginationContext, method, data, contentType, schema, types } = callAPI;
    const [ requestType, successType, failureType ] = types;

    if (typeof endpoint === 'function') {
        endpoint = endpoint(store.getState())
    }
    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.')
    }
    if (!schema) {
        throw new Error('Specify one of the exported Schemas.')
    }
    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types.')
    }
    if (!types.every(type => typeof type === 'string')) {
        throw new Error('Expected action types to be strings.')
    }

    function actionWith(info) {
        if (info.response && info.response.pagination) {
            info.response.pagination.paginationContext = paginationContext;
        }
        const finalAction = Object.assign({}, action, info);
        delete finalAction[CALL_API];
        return finalAction
    }

    let loadAction = { type: requestType };

    if (paginationContext) {
        loadAction.loadingPaginationContext = paginationContext;
        loadAction.loadingPaginationSchema = schema;
        loadAction.loadingPaginationQuery = Object.assign({}, data);
    }

    next(actionWith(loadAction));

    let options = { };

    if (data) {
        options.data = data;
    }
    if (contentType) {
        options.contentType = contentType;
    }

    return callApi(endpoint, method, options, schema).then(
        response => next(actionWith({
            type: successType,
            loadedPaginationContext: paginationContext,
            response
        })),
        error => next(actionWith({
            type: failureType,
            error: error.message || 'Something bad happened'
        }))
    )
}
