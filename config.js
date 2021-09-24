'use strict';

const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

const {
    PORT,
    HOST,
    HOST_URL,
    MONGO_URL,
    TOKEN_SECRET,
    CLOUNDINARY_CLOUD_NAME,
    CLOUNDINARY_API_KEY,
    CLOUNDINARY_API_SEARCH,
    EMAIL,
    PASS


} = process.env

assert(PORT,'PORT is required');
assert(HOST,'HOST is required');



module.exports = {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    mongo_url: MONGO_URL,
    TOKEN_SECRET: TOKEN_SECRET,
    cloud_name: CLOUNDINARY_CLOUD_NAME,
    api_key: CLOUNDINARY_API_KEY,
    api_secret : CLOUNDINARY_API_SEARCH,
    email : EMAIL,
    pass : PASS
}
