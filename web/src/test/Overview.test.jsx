import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import OverviewPage from '../pages/Overview';
import * as api from '../lib/api';

vi.mock('../lib/api');

function renderOverview() {
    return render(
        <MemoryRouter>
            <OverviewPage />
        </MemoryRouter>
    );
}

describe('OverviewPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows no-data state when API returns empty array', async () => {
        api.fetchDailyMetrics.mockResolvedValue([]);
        renderOverview();

        await waitFor(() => {
            expect(screen.getByText(/no data for selected date range/i)).toBeInTheDocument();
        });
    });

    it('renders data rows in the table when API returns points', async () => {
        api.fetchDailyMetrics.mockResolvedValue([
            { date: '2024-01-01', value: 100 },
            { date: '2024-01-02', value: 200 },
        ]);
        renderOverview();

        await waitFor(() => {
            expect(screen.getByText('2024-01-01')).toBeInTheDocument();
            expect(screen.getByText('2024-01-02')).toBeInTheDocument();
        });
    });

    it('shows error message when API call fails', async () => {
        api.fetchDailyMetrics.mockRejectedValue(new Error('Network error'));
        renderOverview();

        await waitFor(() => {
            expect(screen.getByText('Network error')).toBeInTheDocument();
        });
    });

    it('re-fetches when Apply filters is clicked', async () => {
        api.fetchDailyMetrics.mockResolvedValue([]);
        const user = userEvent.setup();
        renderOverview();

        await waitFor(() => expect(api.fetchDailyMetrics).toHaveBeenCalledTimes(1));

        await user.click(screen.getByRole('button', { name: /apply filters/i }));

        await waitFor(() => expect(api.fetchDailyMetrics).toHaveBeenCalledTimes(2));
    });
});
