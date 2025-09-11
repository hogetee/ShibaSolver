const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');   
const adminsRouter = require('./routers/admins_router');
const usersRouter  = require('./routers/users_router');

dotenv.config({ path: './config/config.env'});

const app = express();

(async () => {
        const pool = await connectDB();   
        app.locals.pool = pool;  
        app.get('/', (req, res) => {
                res.status(200).json({
                        success: true,
                        message: 'Welcome to ShibaSolver API'
                });
        });

        app.use('/api/v1/admins', adminsRouter);
        app.use('/api/v1/users', usersRouter);

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
        });
})();
