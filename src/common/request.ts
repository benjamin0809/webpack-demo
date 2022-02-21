import axios from 'axios'



const request = (url: string, option = {}) => {
    return axios.request({
        url,
        ...option
    }) 
}

export default request