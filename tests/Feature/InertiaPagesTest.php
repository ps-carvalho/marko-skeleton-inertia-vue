<?php

declare(strict_types=1);

use App\Web\Auth\InMemoryUserProvider;
use App\Web\Controller\HomeController;
use App\Web\Controller\PageController;
use Marko\Routing\Http\Request;

test('home page returns the landing inertia component', function () {
    $controller = new HomeController(
        createApplicationInertia(),
    );

    $response = $controller->index(new Request(server: [
        'HTTP_X_INERTIA' => 'true',
        'REQUEST_URI' => '/',
    ]));

    $page = json_decode($response->body(), true);

    expect($response->headers()['X-Inertia'])->toBe('true');
    expect($page['component'])->toBe('Landing');
    expect($page['url'])->toBe('/');
});

test('home page full response uses the vue vite entry', function () {
    $controller = new HomeController(
        createApplicationInertia(),
    );

    $response = $controller->index(new Request(server: [
        'REQUEST_URI' => '/',
    ]));

    expect($response->body())->toContain('app/web/resources/js/app.js');
});

test('login page returns the login inertia component', function () {
    $controller = new HomeController(
        createApplicationInertia(),
    );

    $response = $controller->login(new Request(server: [
        'HTTP_X_INERTIA' => 'true',
        'REQUEST_URI' => '/login',
    ]));

    $page = json_decode($response->body(), true);

    expect($page['component'])->toBe('Login');
    expect($page['url'])->toBe('/login');
});

test('about route returns skeleton metadata as json', function () {
    $controller = new HomeController(
        createApplicationInertia(),
    );

    $response = $controller->about();
    $payload = json_decode($response->body(), true);

    expect($response->headers()['Content-Type'])->toBe('application/json');
    expect($payload)->toMatchArray([
        'name' => 'Marko Skeleton',
        'description' => 'A modular PHP framework with attribute-based routing.',
    ]);
});

test('dashboard page exposes authenticated user props', function () {
    $provider = new InMemoryUserProvider;
    $user = $provider->retrieveByCredentials(['email' => 'demo@example.com']);

    $controller = new PageController(
        createApplicationInertia(),
        new FakeAuthManager(fakeUser: $user),
    );

    $response = $controller->dashboard(new Request(server: [
        'HTTP_X_INERTIA' => 'true',
        'REQUEST_URI' => '/dashboard',
    ]));

    $page = json_decode($response->body(), true);

    expect($page['component'])->toBe('Dashboard');
    expect($page['props']['user'])->toMatchArray([
        'id' => 1,
        'name' => 'Marko User',
        'email' => 'demo@example.com',
    ]);
    expect($page['props']['chartData'])->toHaveCount(7);
    expect($page['props']['activities'])->toHaveCount(5);
});

test('dashboard page falls back to an empty user when unauthenticated', function () {
    $controller = new PageController(
        createApplicationInertia(),
        new FakeAuthManager,
    );

    $response = $controller->dashboard(new Request(server: [
        'HTTP_X_INERTIA' => 'true',
        'REQUEST_URI' => '/dashboard',
    ]));

    $page = json_decode($response->body(), true);

    expect($page['component'])->toBe('Dashboard');
    expect($page['props']['user'])->toBe([]);
});

test('profile page exposes authenticated user props', function () {
    $provider = new InMemoryUserProvider;
    $user = $provider->retrieveById(1);

    $controller = new PageController(
        createApplicationInertia(),
        new FakeAuthManager(fakeUser: $user),
    );

    $response = $controller->profile(new Request(server: [
        'HTTP_X_INERTIA' => 'true',
        'REQUEST_URI' => '/profile',
    ]));

    $page = json_decode($response->body(), true);

    expect($page['component'])->toBe('Profile');
    expect($page['props']['user']['role'])->toBe('Admin');
});
