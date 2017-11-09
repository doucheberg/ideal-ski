const express = require('express');
const app = express();

//app.get('/', (req, res) => res.send('Hello World!'));
app.use(express.static('ideal-ski-client/dist'));

app.get('/api', (req, res) => {
    res.send(new Date().toString());
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));