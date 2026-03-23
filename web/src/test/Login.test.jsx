import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/Login';
import * as api from '../lib/api';
import * as auth from '../lib/auth';

vi.mock('../lib/api');
vi.mock('../lib/auth');

function renderLogin() {
    return render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>
    );
}

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders username and password fields', () => {
        renderLogin();
        expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    });

    it('calls login() with entered credentials and saves token on success', async () => {
        api.login.mockResolvedValue({ token: 'test-jwt' });
        const user = userEvent.setup();
        renderLogin();

        await user.type(screen.getByPlaceholderText('Enter your username'), 'Esun');
        await user.type(screen.getByPlaceholderText('Enter your password'), 'Esunadmin');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(api.login).toHaveBeenCalledWith('Esun', 'Esunadmin');
            expect(auth.saveToken).toHaveBeenCalledWith('test-jwt');
        });
    });

    it('shows error message on failed login', async () => {
        api.login.mockRejectedValue(new Error('Invalid credentials'));
        const user = userEvent.setup();
        renderLogin();

        await user.type(screen.getByPlaceholderText('Enter your username'), 'bad');
        await user.type(screen.getByPlaceholderText('Enter your password'), 'bad');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    it('disables the button while login is in progress', async () => {
        let resolve;
        api.login.mockReturnValue(new Promise((r) => { resolve = r; }));
        const user = userEvent.setup();
        renderLogin();

        await user.type(screen.getByPlaceholderText('Enter your username'), 'Esun');
        await user.type(screen.getByPlaceholderText('Enter your password'), 'Esunadmin');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        expect(screen.getByRole('button')).toBeDisabled();
        resolve({ token: 'tok' });
    });
});
