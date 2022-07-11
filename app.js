// importation / require
const express = require("express");
const favicon = require("serve-favicon");
const path = require('path');
const config = require("./config");

const app = express();

// Globale Route
app.use(express.json());
app.use("/views",express.static("public/views"));
app.use(favicon(path.join(config.root, 'public', 'views','img', 'favicon.ico')));


// root paths
app.get("/", (req, res, next) => {
  //res.sendFile(config.root+"/public/views/home/loginPage.html");        // test Anim
  res.sendFile(config.root+"/public/views/home/rotatif.html");        // test Anim
  //res.sendFile(config.root+"/public/views/lib/anim/animExample.html");// test Component
});

// setting 
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
 
module.exports = app;