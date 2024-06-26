import { AxiosResponse } from "axios";
import { SimpleAxios } from "..";

const axios = new SimpleAxios({
    baseURL: 'https://etestback.hcehr.com',
    timeout: 10 * 1000,
    responseType: 'json',
    headers: {
        Accept: 'application/json',
    },
    token: '123',
    responseDataHandle: (res: AxiosResponse) => {
        return res.data
    }

})



const API = {
    login:()=>axios.request('POST', '/backend/api/v1/login', {
    image_captcha: "d2en",
    image_key: "eyJpdiI6Ik5RN3NwalFLRDl1ZDdaSVd2dVdtNlE9PSIsInZhbHVlIjoiRWx3SXdRNWg4M2k0eG5PK2htZ29IcG1pUGN6ZC9BWWwrRkxQVXRTOEFaTzRvcTJETGM5LzVuTFRyOXIzYWxpcmhMOTRtcE5PZjFPME9PdkVTUU5PMEYwRy84b2ZJYWR2ZWt4VmtDZ1ZVelU9IiwibWFjIjoiMzk4MzE5OGE2MDU5Y2NmOTZlZGI1OGQzNjFhMTEyODcyM2QzZmJmZWI2MDczNTE3YmFmMzk0ZjI2MjA5YTA4ZCIsInRhZyI6IiJ9",
    password:"31231",
    username:"31231"
})
}
const test = async () => { 
    const res = await API.login()
    console.log(res,'------');
    
}
test()