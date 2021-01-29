import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';

import {handleError, logRequests} from './middleware';
import router from './routes';

config();

const port = process.env.PORT || 5000;
const app = express();

app.listen(port);

console.log(`Server started, listening on port: ${port}`);

app.use(cors());
app.use(bodyParser.json());
app.use('/', logRequests);
app.use('/', router);
app.use(handleError);



