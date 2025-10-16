const express = require('express');
const cors = require('cors');
const port = 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api/eBird', require('./routes/eBird'));

app.listen(port, () => console.log(`Server started on port ${port}`));