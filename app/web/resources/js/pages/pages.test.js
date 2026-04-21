import { fireEvent, render, screen } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import AppLayout from '../layouts/AppLayout.vue';
import Dashboard from './Dashboard.vue';
import Landing from './Landing.vue';
import Login from './Login.vue';
import Profile from './Profile.vue';

const user = {
  name: 'Marko User',
  email: 'demo@example.com',
  role: 'Admin',
  joined: 'January 2024',
  location: 'San Francisco, CA',
  bio: 'Full-stack developer exploring Marko.',
};

describe('Vue skeleton pages', () => {
  test('Landing renders the primary calls to action', () => {
    render(Landing);

    expect(
      screen.getByRole('heading', {
        name: 'Vue pages from Marko controllers.',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Open dashboard' }),
    ).toHaveAttribute('href', '/dashboard');
  });

  test('Login submits credentials through Inertia form state', async () => {
    render(Login);

    await fireEvent.update(screen.getByLabelText('Email'), 'demo@example.com');
    await fireEvent.update(screen.getByLabelText('Password'), 'password');
    await fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(globalThis.__markoInertiaVue.formPost).toHaveBeenCalledWith(
      '/login',
    );
  });

  test('Dashboard renders user data and activity props', () => {
    render(Dashboard, {
      props: {
        user,
        chartData: [45, 62, 38],
        activities: [{ title: 'Deployment complete', time: '2 hours ago' }],
      },
    });

    expect(screen.getByText('Welcome back, Marko User!')).toBeInTheDocument();
    expect(screen.getByText('Deployment complete')).toBeInTheDocument();
  });

  test('Profile renders account details', () => {
    render(Profile, {
      props: {
        user,
      },
    });

    expect(screen.getByText('demo@example.com')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
  });

  test('AppLayout renders navigation and posts logout', async () => {
    render(AppLayout, {
      slots: {
        default: '<p>Child page</p>',
      },
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(screen.getByText('Child page')).toBeInTheDocument();
    expect(globalThis.__markoInertiaVue.routerPost).toHaveBeenCalledWith(
      '/logout',
    );
  });
});
