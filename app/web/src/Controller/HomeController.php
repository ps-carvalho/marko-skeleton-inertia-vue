<?php

declare(strict_types=1);

namespace App\Web\Controller;

use Marko\Authentication\Middleware\GuestMiddleware;
use Marko\Inertia\Inertia;
use Marko\Inertia\Middleware\InertiaMiddleware;
use Marko\Routing\Attributes\Get;
use Marko\Routing\Attributes\Middleware;
use Marko\Routing\Http\Request;
use Marko\Routing\Http\Response;

#[Middleware([InertiaMiddleware::class])]
class HomeController
{
    private const ASSET_ENTRY = 'app/web/resources/js/app.js';

    public function __construct(
        private Inertia $inertia,
    ) {}

    #[Get('/')]
    public function index(Request $request): Response
    {
        return $this->inertia->render($request, 'Landing', assetEntry: self::ASSET_ENTRY);
    }

    #[Get('/login', middleware: [GuestMiddleware::class])]
    public function login(Request $request): Response
    {
        return $this->inertia->render($request, 'Login', assetEntry: self::ASSET_ENTRY);
    }

    #[Get('/about')]
    public function about(): Response
    {
        return Response::json([
            'name' => 'Marko Skeleton',
            'description' => 'A modular PHP framework with attribute-based routing.',
        ]);
    }
}
