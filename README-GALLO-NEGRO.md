# Gallo Negro

Frontend con Laravel 12, Inertia 2, React 19, Tailwind CSS 4 y Vite 6. Compatible con PHP 8.2.12 o superior. Composer fija PHP 8.2.12 como plataforma para evitar dependencias incompatibles con XAMPP local.

## Ver la web

Con las dependencias instaladas y los assets compilados:

```sh
php artisan serve --host=127.0.0.1 --port=8000
```

Abrir http://127.0.0.1:8000. Para desarrollo con recarga automática, ejecutar además `npm run dev` en otra terminal.

## Instalación en otro equipo

```sh
composer install
npm ci
```

Copiar `.env.example` a `.env`, ejecutar `php artisan key:generate`, crear `database/database.sqlite` y ejecutar `php artisan migrate`. Después `npm run build`.

## Contenido

- `resources/js/data/products.js`: catálogo ficticio, precios en ARS, medidas y descripciones.
- `resources/js/Pages/Store.jsx`: página, ficha de producto, contacto y carrito.
- `resources/css/app.css`: paleta, tipografía y adaptación móvil.
- `public/images`: originales proporcionados por el cliente, copiados sin modificar.
- `DESIGN.md`: dirección visual.

El carrito guarda únicamente IDs y cantidades en localStorage; los precios se toman del catálogo. No procesa pagos ni crea órdenes en el servidor.

Configurar `WHATSAPP_NUMBER` en `.env` con el número internacional real, solo dígitos. Sin ese valor se muestra una vista previa del mensaje y no se envía información. El enlace real abre WhatsApp con el texto preparado; el cliente decide enviarlo. Si hay configuración cacheada ejecutar `php artisan config:clear`.

Antes de publicar: reemplazar datos ficticios, precios, especificaciones, historia, dirección y horarios. El panel de administración se implementará en una etapa posterior.

## Verificación

```sh
npm run build
npm test
php artisan test
npx playwright test
```

Las pruebas de navegador requieren Microsoft Edge instalado y el servidor local en el puerto 8000. Generan capturas en `storage/app/preview-*.png`.
