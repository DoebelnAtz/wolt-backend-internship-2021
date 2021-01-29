import express from 'express'
import {discovery} from "../controllers";

const router = express.Router();

router.get('/discovery', discovery);

export default router;