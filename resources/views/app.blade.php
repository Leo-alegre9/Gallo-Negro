<!DOCTYPE html>
<html lang="es-AR" data-theme="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @isset($productMeta)
    <meta property="og:type" content="product">
    <meta property="og:title" content="{{ $productMeta['name'] }} | Gallo Negro">
    <meta property="og:description" content="{{ $productMeta['description'] }}">
    <meta property="og:image" content="{{ $productMeta['absoluteImageUrl'] }}">
    <meta property="og:url" content="{{ $productMeta['url'] }}">
    @endisset
    <meta name="theme-color" content="#050302">
    <meta name="description" content="Gallo Negro. Fogoneros, parrillas y herrería para disfrutar del fuego. Explorá el catálogo y armá tu pedido.">
    <link rel="icon" type="image/png" href="/images/logo.png">
    <link rel="apple-touch-icon" href="/images/logo.png">
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
</head>
<body>@inertia</body>
</html>
