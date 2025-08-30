const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env'});

const app = express();

app.get('/', (req, res) => {
        res.status(200).json({
                success: true,
                message: 'Welcome to ShibaSolver API'
        });
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
});
