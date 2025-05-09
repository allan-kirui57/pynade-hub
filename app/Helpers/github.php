<?php

if (!function_exists('githubUrlToApiUrl')) {
    function githubUrlToApiUrl($repoUrl)
    {
        $repoUrl = rtrim($repoUrl, '/');
        $path = parse_url($repoUrl, PHP_URL_PATH);
        $parts = explode('/', trim($path, '/'));

        if (count($parts) >= 2) {
            return "https://api.github.com/repos/{$parts[0]}/{$parts[1]}";
        }

        throw new \InvalidArgumentException("Invalid GitHub repository URL");
    }
}
