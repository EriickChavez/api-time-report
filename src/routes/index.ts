import { Router } from 'express';
import authRoutes from './auth.routes';
import configFieldRoutes from './config-field.routes';
import timeEntryRoutes from './entry.routes';


const router = Router();

router.use('/auth', authRoutes);
router.use('/config-fields', configFieldRoutes);
router.use('/time-entry', timeEntryRoutes);

export default router;