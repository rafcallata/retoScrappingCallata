export function getCookie(tokenKey, cookieString){
    return cookieString
    .split(';')
    .find(cookie => cookie.includes(tokenKey))
    .replace(tokenKey+'=','')
    .replaceAll('"','')
    .trim()
}