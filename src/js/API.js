import axios from 'axios';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoxMjl9.uH_fONvgDZcyNlrsAnaJCuT51XAEfto6Dmtp_xlp3dk"

export const API_ = {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoxMjl9.uH_fONvgDZcyNlrsAnaJCuT51XAEfto6Dmtp_xlp3dk"
}

export const API = (method, url, data, onSuccess) => {
    axios({
        "method": method,
        "url": url,
        "data": data,
        "headers": {
            "Authorization": token
        }
    })
    .then( (response) => {
        // console.log(response);
        onSuccess(response);
    }, (error) => {
        console.log(error);
    });
};