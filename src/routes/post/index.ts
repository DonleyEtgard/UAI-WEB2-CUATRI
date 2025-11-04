import express from 'express';

import controllers from './controllers';
import validationMiddleware from '../../middlewares/validator';
import { createPostValidationSchema } from './validations';
import { authenticateFirebase } from '../../middlewares/authenticateFirebase';

const router = express.Router();

router.post('/', authenticateFirebase, validationMiddleware(createPostValidationSchema), controllers.createPost);
router.get('/', controllers.getAllPosts);
router.get('/:id', controllers.getPostById);
router.patch('/:id', controllers.updatePost);
router.delete('/hard/:id', controllers.hardDeletePost);
router.patch('/soft/:id', controllers.softDeletePost);

export default router;