import key from "../constants/key";
import aes256 from "aes256";


export const encrypt = (data) => {
    let encryptBuffer=aes256.encrypt(key, data);
    let ans=""
    return ans=encryptBuffer.toString('utf-8');
}