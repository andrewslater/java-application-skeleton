import { LOAD_PRINCIPAL_USER_SUCCESS } from "../actions/PrincipalActions"

const principalUserId = (state = null, action) => {
    switch (action.type) {
        case LOAD_PRINCIPAL_USER_SUCCESS:
            return action.response.result;
        default:
            return state;
    }
};

export default principalUserId
