<?php

declare(strict_types=1);

// Marko application test bootstrap

use Marko\Authentication\AuthenticatableInterface;
use Marko\Authentication\AuthManager;
use Marko\Config\ConfigRepository;
use Marko\Core\Path\ProjectPaths;
use Marko\Inertia\Inertia;
use Marko\Inertia\Ssr\CurlSsrTransport;
use Marko\Inertia\Ssr\SsrClient;
use Marko\Session\Contracts\SessionInterface;
use Marko\Session\Flash\FlashBag;
use Marko\Vite\Vite;

function createApplicationInertia(array $config = []): Inertia
{
    $mergedConfig = new ConfigRepository(array_replace_recursive([
        'inertia' => [
            'rootView' => 'app',
            'version' => 'test',
            'ssr' => [
                'enabled' => false,
                'url' => 'http://localhost:13714',
            ],
        ],
        'vite' => [
            'buildDirectory' => 'build',
            'manifestFilename' => '.vite/manifest.json',
            'devServerUrl' => 'http://localhost:5173',
            'devServerStylesheets' => [
                'app/web/resources/css/app.css',
            ],
            'useDevServer' => true,
        ],
    ], $config));

    $vite = new Vite($mergedConfig, new ProjectPaths(dirname(__DIR__)));

    return new Inertia(
        $mergedConfig,
        $vite,
        new SsrClient($mergedConfig, new CurlSsrTransport),
        new FakeSession,
    );
}

class FakeSession implements SessionInterface
{
    public bool $started = true;

    private array $data = [];

    private FlashBag $flashBag;

    public function __construct()
    {
        $this->flashBag = new FlashBag($this->data);
    }

    public function start(): void {}

    public function get(string $key, mixed $default = null): mixed
    {
        return $default;
    }

    public function set(string $key, mixed $value): void {}

    public function has(string $key): bool
    {
        return false;
    }

    public function remove(string $key): void {}

    public function clear(): void {}

    public function all(): array
    {
        return [];
    }

    public function regenerate(bool $deleteOldSession = true): void {}

    public function destroy(): void {}

    public function getId(): string
    {
        return '';
    }

    public function setId(string $id): void {}

    public function flash(): FlashBag
    {
        return $this->flashBag;
    }

    public function save(): void {}
}

class FakeAuthManager extends AuthManager
{
    public function __construct(
        private bool $attemptResult = false,
        private ?AuthenticatableInterface $fakeUser = null,
    ) {}

    public bool $loggedOut = false;

    /** @param array<string, mixed> $credentials */
    public array $attemptedCredentials = [];

    public function attempt(array $credentials): bool
    {
        $this->attemptedCredentials = $credentials;

        return $this->attemptResult;
    }

    public function logout(): void
    {
        $this->loggedOut = true;
    }

    public function user(): ?AuthenticatableInterface
    {
        return $this->fakeUser;
    }
}
