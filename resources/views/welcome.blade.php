<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Monolit CRM</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Загружаем собранные React файлы -->
    @if(file_exists(public_path('build/.vite/manifest.json')))
        @php
            $manifest = json_decode(file_get_contents(public_path('build/.vite/manifest.json')), true);
        @endphp
        @if(isset($manifest['src/main.jsx']))
            @if(isset($manifest['src/main.jsx']['css']))
                @foreach($manifest['src/main.jsx']['css'] as $css)
                    <link rel="stylesheet" href="{{ asset('build/' . $css) }}">
                @endforeach
            @endif
            <script type="module" src="{{ asset('build/' . $manifest['src/main.jsx']['file']) }}"></script>
        @endif
    @else
        <!-- Fallback для разработки -->
        <script type="module" src="http://localhost:3000/src/main.jsx"></script>
    @endif
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

