import axios from "axios"

export const registerUser = async (firstname, lastname, username, email, password, confirmPassword, address ) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth/signup/', {
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
        const response = await axios.post('http://127.0.0.1:8000/api/auth/token/', {
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}





const getPassphrase = () => {
        const passphrase = axios.post('http://127.0.0.1:8000/api/auth/verification/', {}, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU3MDA3NDg1LCJpYXQiOjE3NTcwMDcxODUsImp0aSI6IjE1ODlmNGRkODQ3ZTRjZGE4ZDJjODM0MWMyYTBkNmY2IiwidXNlcl9pZCI6IjQwIn0.elhtAEbbZj16NcOzbCdeRvspJTI1S8nmOcN3rA8u5s4',
            'accept': 'application/json'

          }}
        ) 
        return passphrase;
      }

  getPassphrase();
