const express = require('express');
const config = require('./config');
const cors = require('cors');
const connectionDB = require('./db.js')
const routes = require('./routes/routes');


const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.get("/",(req,res) => res.send("Hello , Welcome "))
app.use(`/api`, routes.routes);




const ports = config.port || 8080
app.listen(config.port, () => console.log("App Listening on url http://localhost:" + ports));
connectionDB()





