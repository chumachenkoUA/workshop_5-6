import { Router } from 'express';

import { createDispatcher, destroy, edit, list, show } from 'controllers/users';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validatorRegister } from 'middleware/validation/auth';
import { validatorEdit } from 'middleware/validation/users';

const router = Router();

router.get('/', [checkJwt, checkRole(['ADMINISTRATOR'])], list);

router.post('/dispatchers', [checkJwt, checkRole(['ADMINISTRATOR']), validatorRegister], createDispatcher);

router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true)], show);

router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true), validatorEdit], edit);

router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true)], destroy);

export default router;
