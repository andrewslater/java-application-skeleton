export default function getSelectedText() {
    let text = '';
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if(document.getSelection) {
        text = document.getSelection().toString();
    } else if(document.selection) {
        text = document.selection.createRange().text;
    }
    return text;
}
