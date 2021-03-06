import axios from 'axios';

async function deleteResource(url){
    const response = await axios.delete(url).catch(error => {
        whatWentWrong(error);
    });
    if (response.status === 200) {
        return true;
    } else {
        let err = { status: response.status, errObj: response.data };
        throw err;  // An object with the error coming from the server
    }
}

function whatWentWrong(error){
    if (error.response) {
        let err = { status: error.response.status, errObj: error.response.data };
        throw err;  // An object with the error coming from the server
    } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
}

export {deleteResource, whatWentWrong}