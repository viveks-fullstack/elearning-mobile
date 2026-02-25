import { getProfile, updateProfile, changePassword } from './profile.controller.js';
import { updateProfileSchema, changePasswordSchema } from './profile.validation.js';
import { validate } from '../../utils/validate.js';

export default async function (app) {
    // All profile routes require authentication
    app.addHook('onRequest', app.authenticate);

    // Get current user profile
    app.get('/me', getProfile);

    // Update profile
    app.put('/me', { preHandler: validate(updateProfileSchema) }, updateProfile);

    // Change password
    app.post('/change-password', { preHandler: validate(changePasswordSchema) }, changePassword);
}
