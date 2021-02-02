import axios from "axios";

export function save(appDataObj) {
    return localStorage.setItem('prplAppData', JSON.stringify(appDataObj));
}

export function load() {
    return JSON.parse(localStorage.getItem('prplAppData'));
}

export function updateDB(newStuff) {
    // Push user's self to the backend to the backend
    return axios.post('/user/update', newStuff)
            .then(res => console.log(res.data.message))
            .catch(err => console.log(`Problem updating to backend: ${err}`));
}

export function mountEvent(event) {
    // May or may not use this bad boy.
}

export function dateToString(date) {
    // Purpose of this function is to return today's date in the format MMDDYYYY as a string, with consistent indexing (i.e. January isn't 0)
    let dateToUse, MM, DD, YYYY;
    if (date) dateToUse = date
        else dateToUse = new Date();

    MM = dateToUse.getMonth() + 1;
    if (MM < 10) MM = '0' + MM
        else MM += '';

    DD = dateToUse.getDate();
    if (DD < 10) DD = '0' + DD
        else DD += '';

    YYYY = dateToUse.getFullYear() + '';

    return MM + DD + YYYY;
}