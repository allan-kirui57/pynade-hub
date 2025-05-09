<?php
// app/Services/GitHubService.php
namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GitHubService
{
    protected string $apiBaseUrl = 'https://api.github.com/repos/';

    public function getRepositoryStats(string $repoUrl): ?array
    {
        try {
            $apiUrl = $this->convertToApiUrl($repoUrl);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.config('services.github.token'),
                'Accept' => 'application/vnd.github.v3+json',
            ])->get($apiUrl);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'stars' => $data['stargazers_count'] ?? 0,
                    'forks' => $data['forks_count'] ?? 0,
                    'watchers' => $data['watchers_count'] ?? 0,
                    'last_synced_at' => now(),
                ];
            }

            Log::error('GitHub API request failed', [
                'url' => $apiUrl,
                'status' => $response->status(),
                'response' => $response->body()
            ]);

        } catch (\Exception $e) {
            Log::error('GitHub API exception', ['error' => $e->getMessage()]);
        }

        return null;
    }

    public function convertToApiUrl(string $repoUrl): string
    {
        $repoUrl = rtrim($repoUrl, '/');
        $path = parse_url($repoUrl, PHP_URL_PATH);
        $parts = explode('/', trim($path, '/'));

        if (count($parts) < 2) {
            throw new \InvalidArgumentException("Invalid GitHub repository URL");
        }

        return $this->apiBaseUrl."{$parts[0]}/{$parts[1]}";
    }
}
