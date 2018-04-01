import config from "../../config/config";

export const connectUserAPI = code => {
    return fetch(`${config.serverEndpoint}/session?code=${code}`)
        .then(response => response.json())
        .catch(response => response);
};
