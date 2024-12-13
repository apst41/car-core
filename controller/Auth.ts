import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { findUserByUsername } from '../utils/Users';
import { generateToken } from '../utils/Utils'

export const login = (req: Request, res: Response): void => {
    const { username, password } = req.body;

    // Validate user input
    if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
    }

    // Find user by username
    const user = findUserByUsername(username);
    if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }

    // Check password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }

    // Generate JWT token
    const token = generateToken({ id: user.id, username: user.username });
    res.status(200).json({ message: 'Login successful', token });
};
