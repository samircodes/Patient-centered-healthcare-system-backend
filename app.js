
import express from 'express';

import cors from 'cors';

import { patientRoutes } from './routes/patient-routes.js';


import { doctorRoutes } from './routes/doctor-routes.js';

const app = express();

//middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.options('*', cors());


app.use('/api',patientRoutes)

app.use('/api',doctorRoutes)

app.get('/', (req, res) => 
    {
        res.send('okay');
    });


    app.listen(8080, () => console.log('App is listening on url http://localhost:8080'));
