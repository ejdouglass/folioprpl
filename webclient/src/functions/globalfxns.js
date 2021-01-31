export function save(appDataObj) {
    return localStorage.setItem('prplAppData', JSON.stringify(appDataObj));
}

export function load() {
    return JSON.parse(localStorage.getItem('prplAppData'));
}