<?php

declare(strict_types=1);

namespace App\Web\Auth;

use App\Web\Model\User;
use Marko\Authentication\AuthenticatableInterface;
use Marko\Authentication\Contracts\UserProviderInterface;

class InMemoryUserProvider implements UserProviderInterface
{
    private User $demoUser;

    public function __construct()
    {
        $this->demoUser = new User(
            id: 1,
            email: 'demo@example.com',
            password: '$2y$12$93h16eFmIpXZK7hBCcu.deY3C9WgB/5dxi.H3Rpz4fl4iNBCaxYPe',
            name: 'Marko User',
            role: 'Admin',
            location: 'San Francisco, CA',
            joined: 'January 2024',
            bio: 'Full-stack developer exploring the Marko framework.',
        );
    }

    public function retrieveById(int|string $identifier): ?AuthenticatableInterface
    {
        if ((string) $identifier === '1') {
            return $this->demoUser;
        }

        return null;
    }

    /**
     * @param array<string, mixed> $credentials
     */
    public function retrieveByCredentials(array $credentials): ?AuthenticatableInterface
    {
        $email = $credentials['email'] ?? null;

        if ($email === 'demo@example.com') {
            return $this->demoUser;
        }

        return null;
    }

    /**
     * @param array<string, mixed> $credentials
     */
    public function validateCredentials(AuthenticatableInterface $user, array $credentials): bool
    {
        $password = $credentials['password'] ?? '';

        return is_string($password) && password_verify($password, $user->getAuthPassword());
    }

    public function retrieveByRememberToken(int|string $identifier, string $token): ?AuthenticatableInterface
    {
        // Not implemented for demo
        return null;
    }

    public function updateRememberToken(AuthenticatableInterface $user, ?string $token): void
    {
        $user->setRememberToken($token);
    }
}
