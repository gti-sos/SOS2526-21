let express = require('express');
let cool = require('cool-ascii-faces');

const app = express();

let PORT = process.env.PORT || 3000;

app.use('/about', express.static('./static/about.html'))

app.get('/cool',(req, res) => {
    res.send(`<html><body><h1>
    ${cool()}
    </h1></body></html>`)
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});