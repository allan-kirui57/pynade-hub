<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Grab existing users or create some if none exist
        $users = User::all();
        if ($users->isEmpty()) {
            $users = User::factory(3)->create();
        }

        $products = [
            // ── Open Source ──────────────────────────────────────────────
            [
                'name'            => 'LaraKit UI',
                'description'     => '<p>A comprehensive UI component library built specifically for Laravel + Inertia + Vue 3 applications. Ships with 40+ production-ready components, dark mode support, and full TypeScript definitions.</p><p>Designed to drop straight into any <strong>Breeze</strong> or <strong>Jetstream</strong> scaffold without configuration overhead.</p>',
                'pricing_type'    => 'Free',
                'is_open_source'  => true,
                'repo_url'        => 'https://github.com/example/larakit-ui',
                'website_url'     => 'https://larakitui.dev',
                'stars_count'     => 1243,
                'forks_count'     => 178,
                'watchers_count'  => 94,
                'is_featured'     => true,
                'last_synced_at'  => now()->subHours(2),
            ],
            [
                'name'            => 'Filament Analytics',
                'description'     => '<p>A plug-and-play analytics plugin for <strong>Filament v3</strong> admin panels. Adds a real-time dashboard widget powered by your own database — no third-party trackers needed.</p><ul><li>Page views, unique visitors, bounce rate</li><li>Top pages and referrers</li><li>Configurable date range filters</li></ul>',
                'pricing_type'    => 'Free',
                'is_open_source'  => true,
                'repo_url'        => 'https://github.com/example/filament-analytics',
                'website_url'     => null,
                'stars_count'     => 567,
                'forks_count'     => 62,
                'watchers_count'  => 38,
                'is_featured'     => false,
                'last_synced_at'  => now()->subHours(6),
            ],
            [
                'name'            => 'InertiaTable',
                'description'     => '<p>Server-side data tables for Inertia.js with built-in sorting, filtering, and pagination. Works out of the box with <strong>Laravel Query Builder</strong> on the backend and Vue 3 on the frontend.</p>',
                'pricing_type'    => 'Free',
                'is_open_source'  => true,
                'repo_url'        => 'https://github.com/example/inertia-table',
                'website_url'     => 'https://inertia-table.dev',
                'stars_count'     => 892,
                'forks_count'     => 134,
                'watchers_count'  => 71,
                'is_featured'     => false,
                'last_synced_at'  => now()->subDay(),
            ],

            // ── Freemium ─────────────────────────────────────────────────
            [
                'name'            => 'PulseBoard',
                'description'     => '<p><strong>PulseBoard</strong> is a SaaS-ready analytics dashboard starter kit for Laravel. The free tier includes a single workspace; upgrade for multi-tenancy, custom domains, and white-labelling.</p><p>Built with Livewire v3, Alpine.js, and Tailwind CSS. Zero JavaScript build step required.</p>',
                'pricing_type'    => 'Freemium',
                'is_open_source'  => false,
                'repo_url'        => null,
                'website_url'     => 'https://pulseboard.app',
                'stars_count'     => 0,
                'forks_count'     => 0,
                'watchers_count'  => 0,
                'is_featured'     => true,
                'last_synced_at'  => null,
            ],
            [
                'name'            => 'MailRelay',
                'description'     => '<p>Transactional email management for Laravel applications. Provides a visual template editor, delivery logs, bounce handling, and webhook support for all major ESP providers (Postmark, SES, Mailgun, Resend).</p>',
                'pricing_type'    => 'Freemium',
                'is_open_source'  => false,
                'repo_url'        => null,
                'website_url'     => 'https://mailrelay.io',
                'stars_count'     => 0,
                'forks_count'     => 0,
                'watchers_count'  => 0,
                'is_featured'     => false,
                'last_synced_at'  => null,
            ],

            // ── Paid ─────────────────────────────────────────────────────
            [
                'name'            => 'SaaSCore Laravel',
                'description'     => '<p>The complete Laravel SaaS boilerplate — ships with multi-tenancy, subscription billing (Stripe + Paddle), team management, role-based access control, and a polished Inertia + Vue 3 frontend.</p><p>Save hundreds of hours of boilerplate and focus on your product from day one.</p><ul><li>Stripe Billing + Paddle support</li><li>Stancl/Tenancy multi-tenancy</li><li>Spatie Permissions pre-wired</li><li>One-click deploy scripts for Forge & Ploi</li></ul>',
                'pricing_type'    => 'Paid',
                'is_open_source'  => false,
                'repo_url'        => null,
                'website_url'     => 'https://saascore.dev',
                'stars_count'     => 0,
                'forks_count'     => 0,
                'watchers_count'  => 0,
                'is_featured'     => true,
                'last_synced_at'  => null,
            ],
            [
                'name'            => 'PHPCrm',
                'description'     => '<p>A lightweight CRM built on Laravel with source code included. Manage leads, contacts, deals, and pipelines with a clean Inertia + Vue 3 interface. Single purchase, lifetime updates.</p><p>Ideal for agencies that want to white-label and resell to clients.</p>',
                'pricing_type'    => 'Paid',
                'is_open_source'  => false,
                'repo_url'        => null,
                'website_url'     => 'https://phpcrm.dev',
                'stars_count'     => 0,
                'forks_count'     => 0,
                'watchers_count'  => 0,
                'is_featured'     => false,
                'last_synced_at'  => null,
            ],

            // ── Subscription ─────────────────────────────────────────────
            [
                'name'            => 'LogPilot',
                'description'     => '<p><strong>LogPilot</strong> is a hosted error and log monitoring service with a first-class Laravel SDK. Drop in the package, set your API key, and get Slack/email alerts, stack traces, and performance insights within minutes.</p>',
                'pricing_type'    => 'Subscription',
                'is_open_source'  => false,
                'repo_url'        => null,
                'website_url'     => 'https://logpilot.io',
                'stars_count'     => 0,
                'forks_count'     => 0,
                'watchers_count'  => 0,
                'is_featured'     => false,
                'last_synced_at'  => null,
            ],
            [
                'name'            => 'DeployHQ',
                'description'     => '<p>Automated deployment pipelines tailored for PHP/Laravel applications. Connect your Git repo, define your stages (staging → production), and ship with confidence. Built-in zero-downtime deploys, Horizon restarts, and migration runners.</p>',
                'pricing_type'    => 'Subscription',
                'is_open_source'  => false,
                'repo_url'        => null,
                'website_url'     => 'https://deployhq.app',
                'stars_count'     => 0,
                'forks_count'     => 0,
                'watchers_count'  => 0,
                'is_featured'     => false,
                'last_synced_at'  => null,
            ],
        ];

        foreach ($products as $data) {
            $user = $users->random();
            $name = $data['name'];

            Product::updateOrCreate(
                ['slug' => Str::slug($name)],
                array_merge($data, [
                    'user_id' => $user->id,
                    'slug'    => Str::slug($name),
                    'image'   => null, // swap with a real URL or Storage path if needed
                ])
            );
        }

        $this->command->info('✅  Seeded ' . count($products) . ' products.');
    }
}
