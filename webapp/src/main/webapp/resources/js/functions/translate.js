import $ from 'jquery'

export default function translate(key) {
    const a = Array.from(arguments);
    for (var i = a.length; i < 7; i++) {
        a.push(null);
    }
    return $.i18n.prop(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
}