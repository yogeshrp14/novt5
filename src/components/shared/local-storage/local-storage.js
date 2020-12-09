import CryptoJS from "crypto-js";

let localStorageValidator = process.env.REACT_APP_LOCALSTORAGE_VALIDATOR_KEY;

export function EncryptLocalStorage(key, value) {
    const usuario = value.toString()
    let a1 = CryptoJS.AES.encrypt(usuario, localStorageValidator).toString();
    sessionStorage.setItem(key, a1)
}

export function DecryptLocalStorage(key) {
    if (sessionStorage.getItem(key) && sessionStorage.getItem(key) !== null && sessionStorage.getItem(key) !== '' && sessionStorage.getItem(key) !== 'null') {
        let localStorageData = sessionStorage.getItem(key)
        let bytes = CryptoJS.AES.decrypt(localStorageData, localStorageValidator);
        let decriptedData = bytes.toString(CryptoJS.enc.Utf8);
        return decriptedData
    }
    else return null
}

export function ValidateLocalStoragealue(value) {
    let storageValue = DecryptLocalStorage(value);
    if (storageValue != null && storageValue !== '' && storageValue !== 'null') {
        return true
    }
    if (storageValue === null || storageValue === '' || storageValue === 'null') {
        return false;
    }
}
