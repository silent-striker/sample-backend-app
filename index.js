const express = require('express');
const router = require('./Routes/userRoutes.js');

const app = express();
const port = 3000;

app.use(express.json());
app.use(router);

app.listen(port, () => {
    console.log("App is listening on port: ", port);
});

/*
    Citations
    https://www.digitalocean.com/community/tutorials/use-expressjs-to-get-url-and-post-parameters
    
*/