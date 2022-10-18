import axios from "axios";

// we will use this amazing free api and declare our client
const client = (() => {
    return axios.create({
        baseURL: "https://api.openbrewerydb.org/"
    });
})();

// the request function which will destructure the response
const request = async function (options, store) {
    // success handler
    const onSuccess = function (response) {
        const {
            data
        } = response;
        return data;
    };

    // error handler
    const onError = function (error) {
        return Promise.reject(error.response);
    };

    // adding success and error handlers to client
    return client(options).then(onSuccess).catch(onError);
};

export default request;
