import _ from 'lodash'
import * as ActionTypes from '../actions'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import merge from 'deeply'

//import pagination from './pagination'
import principalUserId from './principalUserId'

// Updates an entity cache in response to any action with response.entities.
function entities(state = { users: {} }, action) {

    if (action.response && action.response.entities) {
        return merge.call({}, {}, state, action.response.entities);
    }

    return state
}

// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action) {
    const { type, error } = action;

    if (type === ActionTypes.RESET_ERROR_MESSAGE) {
        return null
    } else if (error) {
        return action.error
    }

    return state
}

const rootReducer = combineReducers({
    entities,
    errorMessage,
    principalUserId,
    routing
});

export default rootReducer
