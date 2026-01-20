import { Router } from 'express';
import { ConfigFieldsController } from '../controllers/config-field.controller';

const router = Router();
const configFieldsController = new ConfigFieldsController();

router.get('/', configFieldsController.getConfigsByUserId);

router.post('/create', configFieldsController.saveConfigs);

router.delete('/delete', configFieldsController.deleteConfig);

export default router;