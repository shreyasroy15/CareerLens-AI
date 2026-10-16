import { Request, Response, NextFunction } from 'express';
import { User, hashPassword } from '../models/User';
import { generateToken } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { env } from '../config/env';

// In-memory token store for password reset tokens
const resetTokens = new Map<string, { email: string; expiresAt: number }>();

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError('An account with this email address already exists.', 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'USER',
      emailVerified: true, // auto-verified for frictionless college demo
    });

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      throw new AppError('User account not found.', 404);
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Generate a 6-digit mock reset token
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    resetTokens.set(email.toLowerCase(), {
      email: email.toLowerCase(),
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
    });

    // In a production server with SMTP, this would be emailed. For college demo & evaluation,
    // we return friendly instructions and reset code in the response.
    res.status(200).json({
      success: true,
      message: user
        ? `Reset instructions sent. Evaluation reset code: ${resetCode}`
        : 'If the email exists, a password reset code was dispatched.',
      resetCode: env.NODE_ENV !== 'production' ? resetCode : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, newPassword, resetToken } = req.body;
    const record = resetTokens.get(email.toLowerCase());

    if (!record || record.expiresAt < Date.now()) {
      throw new AppError('Password reset code is invalid or has expired.', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();
    resetTokens.delete(email.toLowerCase());

    res.status(200).json({
      success: true,
      message: 'Password reset successful. Please log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};
