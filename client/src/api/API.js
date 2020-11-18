const baseURL = "/";
async function isAuthenticated() {
    let url = "login";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if (response.ok) {
        return userJson;
    } else {
        let err = { status: response.status, errObj: userJson };
        throw err;  // An object with the error coming from the server
    }
}
async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: username, password: password }),
        }).then((response) => {
            console.log(response)
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}
async function userLogout(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + 'logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}
const API = { isAuthenticated, userLogin, userLogout};
export default API;
