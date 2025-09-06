import axios from "axios"
import { jwtDecode } from "jwt-decode"

const API_LINK = import.meta.env.VITE_API_URL
console.log(API_LINK)

export const registerUser = async (firstname, lastname, username, email, password, confirmPassword, address ) => {
    try {
        const response = await axios.post(`${API_LINK}/api/auth/signup/`, {
            first_name: firstname,
            last_name: lastname,
            username,
            email,
            password,
            confirmPassword,
            address 
        });
        return response.data;
    } catch (error) {
        throw error.response.data;  
    }
}

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_LINK}/api/auth/token/`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const get_token = async (email, password) => {
    try {
        const response = await axios.post(`${API_LINK}/api/auth/token/`, {
            email,
            password
        });
        return response.data;
        localStorage.setItem('access', response.access)
        localStorage.setItem('refresh', response.refresh)
    } catch (error) {
        throw error.response.data;
    }
}

const token = await get_token('lasty@gmail.com', '00000000')

const access = token.access
const exp = jwtDecode(access).exp

console.log(new Date(exp * 1000))

const getPassphrase = () => {
        const passphrase = axios.post(`${API_LINK}/api/auth/verification/`, {}, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU3MDA3NDg1LCJpYXQiOjE3NTcwMDcxODUsImp0aSI6IjE1ODlmNGRkODQ3ZTRjZGE4ZDJjODM0MWMyYTBkNmY2IiwidXNlcl9pZCI6IjQwIn0.elhtAEbbZj16NcOzbCdeRvspJTI1S8nmOcN3rA8u5s4',
            'accept': 'application/json'

          }}
        ) 
        return passphrase;
      }

  getPassphrase();
