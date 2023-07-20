require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const axios = require('axios').default;
const moment = require('moment');

const ZEROSSL_APIKEY = process.env.ZEROSSL_APIKEY;

async function getAllSSLs(){

    let page = 1;
    const certificate_status = "issued";
    const limit = 100;

    let result = await axios.get(`https://api.zerossl.com/certificates?access_key=${ZEROSSL_APIKEY}&certificate_status=${certificate_status}&page=${page}&limit=${limit}`);
    let ssls = result.data.results;

    while (ssls.length < result.data.total_count) {
        page++;
        let result = await axios.get(`https://api.zerossl.com/certificates?access_key=${ZEROSSL_APIKEY}&certificate_status=${certificate_status}&page=${page}&limit=${limit}`);
        ssls = ssls.concat(result.data.results);
            
    } 
    return ssls;
}


async function main() {
    const ssls = await getAllSSLs();

    const expiresSSL = ssls.filter(ssl => {
        //console.log(ssl.expires)
        const currentDate = moment();
        const targetDate = moment(ssl.expires, 'YYYY-MM-DD HH:mm:ss');
        const daysDifference = targetDate.diff(currentDate, 'days');
        if (daysDifference < 30) {
            return ssl;
        }
    });

    console.log(expiresSSL)
}

main();