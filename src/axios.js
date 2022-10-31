import axios from 'axios'

const instance = axios.create({
    timeout: 5000,
    baseURL: "https://sound-of-time-2-default-rtdb.firebaseio.com/"
})

export default instance