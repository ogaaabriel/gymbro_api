import axios from "axios";

import { Address } from "../types/address";

const reverseGeocode = async (latitude: number, longitude: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

    try {
        const response = await axios.get(url);
        const address: Address = await response.data.address;
        return `${address.road}, ${address.suburb}, ${address.city} - ${address.state} , ${address.country}`;
    } catch (error) {
        console.error(error);
        return '';
    }
}

export const getAddress = async (latitude: number, longitude: number) => {
    const address = await reverseGeocode(latitude, longitude);
    return address;
}