import bcrypt from 'bcrypt';
import User from '../user/user.model.js';
import { success } from '../../utils/response.js';
import { NotFoundError, AuthenticationError } from '../../utils/customErrors.js';
import { BCRYPT_ROUNDS } from '../../utils/constants.js';
import { logger } from '../../utils/logger.js';

/**
 * Get current user profile
 */
export const getProfile = async (req, reply) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId)
            .select('-password')
            .populate('parents', 'fatherName motherName');

        if (!user) {
            throw new NotFoundError('User not found');
        }

        logger.info(`Profile retrieved for user: ${userId}`);

        return success(reply, user, 'Profile retrieved successfully');
    } catch (err) {
        throw err;
    }
};

/**
 * Update current user profile
 */
export const updateProfile = async (req, reply) => {
    try {
        const userId = req.user.id;
        const { name, email, phone, profileImage } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Check for duplicate email or phone (excluding current user)
        if (email || phone) {
            const duplicate = await User.findOne({
                _id: { $ne: userId },
                $or: [
                    ...(email ? [{ email }] : []),
                    ...(phone ? [{ phone }] : [])
                ]
            });

            if (duplicate) {
                const field = duplicate.email === email ? 'Email' : 'Phone';
                throw new Error(`${field} already exists`);
            }
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (profileImage !== undefined) user.profileImage = profileImage;

        await user.save();

        logger.info(`Profile updated for user: ${userId}`);

        // Return updated user without password
        const updatedUser = await User.findById(userId).select('-password');

        return success(reply, updatedUser, 'Profile updated successfully');
    } catch (err) {
        throw err;
    }
};

/**
 * Change user password
 */
export const changePassword = async (req, reply) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await User.findById(userId).select('+password');

        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            throw new AuthenticationError('Current password is incorrect');
        }

        // Check if new password is same as current
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            throw new Error('New password must be different from current password');
        }

        // Hash and update password
        user.password = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
        await user.save();

        logger.info(`Password changed for user: ${userId}`);

        return success(reply, null, 'Password changed successfully');
    } catch (err) {
        throw err;
    }
};
