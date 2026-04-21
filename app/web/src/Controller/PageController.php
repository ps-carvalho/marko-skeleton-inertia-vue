<?php

declare(strict_types=1);

namespace App\Web\Controller;

use App\Web\Model\User;
use Marko\Authentication\AuthManager;
use Marko\Authentication\Middleware\AuthMiddleware;
use Marko\Inertia\Inertia;
use Marko\Inertia\Middleware\InertiaMiddleware;
use Marko\Routing\Attributes\Get;
use Marko\Routing\Attributes\Middleware;
use Marko\Routing\Http\Request;
use Marko\Routing\Http\Response;

#[Middleware([InertiaMiddleware::class, AuthMiddleware::class])]
class PageController
{
    private const ASSET_ENTRY = 'app/web/resources/js/app.js';

    public function __construct(
        private Inertia $inertia,
        private AuthManager $auth,
    ) {}

    #[Get('/dashboard')]
    public function dashboard(Request $request): Response
    {
        $user = $this->auth->user();

        return $this->inertia->render(
            request: $request,
            component: 'Dashboard',
            props: [
                'user' => $user instanceof User ? $user->toArray() : [],
                'chartData' => [45, 62, 38, 75, 52, 88, 67],
                'activities' => [
                    ['title' => 'Deployed new version to production', 'time' => '2 hours ago'],
                    ['title' => 'New user registration spike detected', 'time' => '4 hours ago'],
                    ['title' => 'Database backup completed successfully', 'time' => '6 hours ago'],
                    ['title' => 'API response time optimized by 24%', 'time' => '8 hours ago'],
                    ['title' => 'Security patch applied to all nodes', 'time' => '12 hours ago'],
                ],
            ],
            assetEntry: self::ASSET_ENTRY,
        );
    }

    #[Get('/profile')]
    public function profile(Request $request): Response
    {
        $user = $this->auth->user();

        return $this->inertia->render(
            request: $request,
            component: 'Profile',
            props: [
                'user' => $user instanceof User ? $user->toArray() : [],
            ],
            assetEntry: self::ASSET_ENTRY,
        );
    }
}
