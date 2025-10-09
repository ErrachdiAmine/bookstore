import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState } from "react";

const API_LINK = import.meta.env.VITE_API_URL


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

        const access = response.data.access
        const decode = jwtDecode(access)
        const exp = decode.exp

        localStorage.setItem('access', response.data.access)
        localStorage.setItem('refresh', response.data.refresh)
        localStorage.setItem('expires-at', exp*1000)

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

        const access = response.data.access
        const decode = jwtDecode(access)
        const exp = decode.exp

        localStorage.setItem('access', response.data.access)
        localStorage.setItem('refresh', response.data.refresh)
        localStorage.setItem('expires-at', exp)

    } catch (error) {
        throw error.response.data;
    }
}


export const refresh_token = async (refresh, exptime) => {
    try {
        const meantime = Math.floor(Date.now() / 1000)
        const remaining = exptime - meantime;

        console.log(`Token expires in: ${remaining}`)

        if (remaining == 5) {

            const response = await axios.post(API_LINK, refresh)

            localStorage.setItem('success', response.data.success)
        }
        
    } catch (error) {
        throw error.response.data;
    }
}


const token = localStorage.getItem('access')

console.log(token)


const getPassphrase = () => {
    const passphrase = axios.post(`${API_LINK}/api/auth/verification/`, {}, {
        headers: {
        'Authorization': `Bearer ${token}` ,
        'accept': 'application/json'

        }}
    ) 
    console.log(passphrase)
    return passphrase;
}

getPassphrase()