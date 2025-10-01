<?php

/**
 * Laravel - A PHP Framework For Web Artisans
 *
 * @package  Laravel
 * @author   Taylor Otwell <taylor@laravel.com>
 */

// Set the public path for Vercel
$_SERVER['DOCUMENT_ROOT'] = __DIR__ . '/../public';

// Forward all requests to Laravel's public directory
require __DIR__ . '/../public/index.php';