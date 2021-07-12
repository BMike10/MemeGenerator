const BASEURL = '/api';

//GET API:

async function getAllMemeTemplate() {
    const response = await fetch(BASEURL + '/memeTemplate');
    const memeTemplateJson = await response.json();
    if (response.ok) {
        //questionsJson.forEach(task => (task.deadline ? task.deadline = dayjs(task.deadline) : null));
        //setNewTasks(response);
        return memeTemplateJson;
    } else {
        throw memeTemplateJson;  // An object with the error coming from the server
    }
}

async function getAllMeme() {
    const response = await fetch(BASEURL + '/meme');
    const memeJson = await response.json();
    if (response.ok) {
        //questionsJson.forEach(task => (task.deadline ? task.deadline = dayjs(task.deadline) : null));
        //setNewTasks(response);
        return memeJson;
    } else {
        throw memeJson;  // An object with the error coming from the server
    }
}

async function getPublicMeme() {
    const response = await fetch(BASEURL + '/meme/publicMeme');
    const memeJson = await response.json();
    if (response.ok) {

        return memeJson;
    } else {
        throw memeJson;  // An object with the error coming from the server
    }
}


async function getMemeByCreator(creatorId) {
    const response = await fetch(BASEURL + '/creator/' + creatorId + '/meme');
    const memeJson = await response.json();
    if (response.ok) {
        //questionsJson.forEach(task => (task.deadline ? task.deadline = dayjs(task.deadline) : null));
        //setNewTasks(response);
        return memeJson;
    } else {
        throw memeJson;  // An object with the error coming from the server
    }
}

//ADD

//Add meme
function addMeme(meme) {
    return new Promise((resolve, reject) => {
        //Update DB
        fetch(BASEURL + "/meme", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(meme),
        }).then((response) => {
            if (response.ok) {
                console.log(response.clone().json());
                //Devo clonarla per non consumarla
                resolve(response.clone().json());
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

// //Add sentence
// function addSentence(sentence) {
//     return new Promise((resolve, reject) => {
//         //Update DB
//         fetch(BASEURL + "/sentences", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(sentence),
//         }).then((response) => {
//             if (response.ok) {
//                 resolve(null);
//             } else {
//                 // analyze the cause of error
//                 response.json()
//                     .then((obj) => { reject(obj); }) // error msg in the response body
//                     .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
//             }
//         }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
//     });
// }

//DELETE

//Delete meme
function deleteMeme(id) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/meme/' + id, {
            method: 'DELETE',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

// //Delete sentence
// function deleteSentence(id) {
//     return new Promise((resolve, reject) => {
//         fetch(BASEURL + '/sentences/' + id, {
//             method: 'DELETE',
//         }).then((response) => {
//             if (response.ok) {
//                 resolve(null);
//             } else {
//                 // analyze the cause of error
//                 response.json()
//                     .then((obj) => { reject(obj); }) // error msg in the response body
//                     .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
//             }
//         }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
//     });
// }

//LOGIN/LOGOUT API
async function logIn(credentials) {

    const response = await fetch(BASEURL + '/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {

        const user = await response.json();
        return user;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    await fetch(BASEURL + '/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
    const response = await fetch(BASEURL + '/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}


const API = {
    logIn,
    logOut,
    getUserInfo,
    getAllMemeTemplate,
    getAllMeme,
    getMemeByCreator,
    addMeme,
    /*addSentence,*/
    deleteMeme,
    /*deleteSentence,*/
    getPublicMeme
};

export default API;