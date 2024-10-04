import aes256 from "aes256";
import key from "../constants/key";


export const decrypt = (data) => {
    let decryptBuffer=aes256.decrypt(key, data);
    let ans=""
    return ans=decryptBuffer.toString('utf-8');
}