import _ from 'lodash'

export default function removeNullProperties(obj) {
    return _.pickBy(obj, _.identity);
}
