import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import User, { IUser } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { transporter } from '../utils/mailer.js';
import dotenv from 'dotenv';
dotenv.config();

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fullName, userName, email, password } = req.body;
    if (!fullName || !userName || !email || !password) {
      res.status(400).json({
        general: 'Full name, user name, email, password are required!',
      });
      return;
    }

    const fieldErrors: { [key: string]: string } = {};

     if (!password || password.length < 6) {
      fieldErrors.password = 'Password must be at least 6 characters long';
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      fieldErrors.email = 'User with this email already exists';
    }

    const existingUserByUserName = await User.findOne({ userName });
    if (existingUserByUserName) {
      fieldErrors.userName = 'User with this username already exists';
    }

   

    if (Object.keys(fieldErrors).length > 0) {
      res.status(400).json({ fields: fieldErrors });
      return;
    }

    const newUser = new User({ fullName, userName, email, password });
    await newUser.save();
    res.status(201).json({
      message: 'User registered successfully',
      user: { _id: newUser._id, userName, email },
    });
  } catch (error) {
    console.error(
      'Error registering user:',
      error instanceof Error ? error.message : error
    );

    res.status(500).json({
      general: 'Error with registering user',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required!' });
      return;
    }
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Incorrect email or password' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Incorrect email or password' });
      return;
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.cookie('token', token, {
      httpOnly: true, // нельзя читать через JS
      secure: false,
      sameSite: 'strict', //защита от CSRF
      maxAge: 1000 * 60 * 60 * 24, // 1 day in ms
    });
    res.json({
      message: 'User logged in successfully',
      user: { _id: user._id },
    });
  } catch (error) {
    console.error('Error with login user');
    res.status(500).json({
      message: 'Server error with login user',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const logoutUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
    res.json({ message: 'Logged out successfully', userId: req.userId });
  } catch (error) {
    console.error('Error with logout user');

    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found. Please register!' });
      return;
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000);
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetCode = code;
    user.resetCodeExpires = expires;
    await user.save();

    // Send email
    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password reset code',
      html: `<p>Your password reset code is: <b>${code}</b></p>
             <p>Expires in 10 minutes.</p>`,
    });

    res.json({ message: 'Reset code sent to email' });
  } catch (error) {
    console.error('Error with sending reset code');
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetCode !== code ||
      !user.resetCodeExpires ||
      Date.now() > user.resetCodeExpires
    ) {
      res.status(400).json({ message: 'Invalid data or expired code' });
      return;
    }

    // Hash new password
    const hashPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.json({ message: 'Password successfully updated' });
  } catch (error) {
    console.error('Error with  reset password');
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};
