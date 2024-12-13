import bcrypt from 'bcryptjs';

interface User {
    id: number;
    username: string;
    password: string; // Hashed password
}

const users: User[] = [
    {
        id: 1,
        username: 'testuser',
        password: bcrypt.hashSync('password123', 10), // Pre-hashed password
    },
];

export const findUserByUsername = (username: string): User | undefined => {
    return users.find(user => user.username === username);
};
