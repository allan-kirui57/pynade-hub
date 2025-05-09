<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\GitHubService;
use App\Models\Product;

class UpdateGitHubStats extends Command
{
    protected $signature = 'github:update-stats';
    protected $description = 'Update GitHub stars, forks, and watchers for products';

    public function handle(GitHubService $githubService)
    {
        $products = Product::whereNotNull('repo_url')->get();

        foreach ($products as $product) {
            $stats = $githubService->getRepositoryStats($product->repo_url);

            if ($stats) {
                $product->update([
                    'stars_count' => $stats['stars'],
                    'forks_count' => $stats['forks'],
                    'watchers_count' => $stats['watchers'],
                    'last_synced_at' => $stats['last_synced_at'],
                ]);

                $this->info("Updated stats for {$product->name}");
            } else {
                $this->error("Failed to update stats for {$product->name}");
            }
        }

        $this->info('GitHub stats update completed!');
    }
}
