import express, { Request, Response, Router } from "express";
import ctrlWrapper from '../../middlewares/ctrlWrapper';
import controllers from '../../controllers';

const router: Router = express.Router();

router.get('/', ctrlWrapper(controllers.users.getAll));

router.post('/', ctrlWrapper(controllers.users.add));

export default router;
