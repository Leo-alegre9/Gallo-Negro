# Administración del catálogo

Entrada: `/admin`. No hay registro público; las tres cuentas del equipo y la cuenta adicional de revisión tienen los mismos permisos y auditoría.

## Alta de administradores

Ejecutar una vez por persona con su correo real:

```sh
php artisan admin:create correo@empresa.com --name="Nombre Apellido"
```

El comando solicita una contraseña oculta de al menos 12 caracteres y admite hasta tres administradores del equipo. La opción `--review` crea una única cuenta de revisión adicional, sin consumir esos tres lugares. Volver a ejecutarlo para una cuenta existente permite cambiar su contraseña y conserva su condición de cuenta de revisión. No enviar contraseñas por el chat ni guardarlas en el repositorio.

## Instalación y publicación

```sh
php artisan migrate --force
npm run build
```

`php artisan db:seed --class=CatalogSeeder` carga los cuatro productos de muestra, sin sobrescribir los existentes. Sus nombres, medidas, precios e imágenes deben revisarse antes de publicar el catálogo comercial. No ejecutar el seeder repetidamente después de gestionar el catálogo.

Configurar `APP_URL` con el dominio HTTPS real, `APP_DEBUG=false`, correo y credenciales de base de datos del servidor, cookies seguras y el número de WhatsApp `5491135879396`. Respaldar la base de datos y `storage/app/public/products`. Las imágenes se sirven mediante `/media/products/...`; no requieren enlace simbólico en Windows.

## Uso

- Categorías: crear categorías principales y subcategorías de un nivel. Un producto tiene una categoría principal y, opcionalmente, una subcategoría de esa misma categoría.
- Productos: cargar nombre, descripción, modelo, medidas, variantes, precio, promoción opcional, stock, imagen principal y galería. Importes en pesos argentinos enteros; la promoción debe ser menor al precio habitual.
- Dar de baja oculta el producto. Eliminar es recuperable desde el filtro Eliminados; no borra sus fotos del disco. Restaurar conserva el estado activo/inactivo anterior.
- Auditoría: identifica usuario, fecha, acción y valores anteriores/nuevos. Los cambios del catálogo y su auditoría se guardan juntos en una transacción.
- Estadísticas: vistas de fichas y consultas iniciadas; una consulta no prueba que el visitante haya enviado el mensaje en WhatsApp. Las visitas son sesiones anónimas por día, no personas identificadas; el total de 30 días suma visitantes diarios y puede repetir una persona. No se cuentan visitas al sitio de administradores autenticados. Bots, bloqueos de cookies o sesiones nuevas pueden distorsionar las cifras.

## WhatsApp

Las consultas individuales y del pedido llevan producto, precio vigente, enlaces a la ficha y foto, y una nota opcional. El pedido se recalcula en el servidor. Un enlace de WhatsApp no adjunta archivos automáticamente: se incluye la URL de la imagen. Las fichas entregan metadatos Open Graph desde el servidor para que WhatsApp pueda generar una vista previa; depende de WhatsApp y requiere un dominio público accesible.

## Verificación

```sh
php artisan test
npm run build
npx playwright test tests/browser/catalog-admin.spec.js tests/browser/navbar-active.spec.js
```

Las pruebas PHP usan SQLite en memoria. Las pruebas de navegador requieren el servidor local en el puerto 8000 y los productos de muestra.

Para el recorrido autenticado, `php tests/browser/prepare-admin.php` prepara exclusivamente `storage/framework/testing/browser-admin.sqlite`. Ejecutar un segundo servidor en el puerto 8001 con `DB_DATABASE` apuntando a ese archivo, `DB_CONNECTION=sqlite` y `APP_ENV=testing`. Luego ejecutar `tests/browser/admin-management.spec.js` con `ADMIN_E2E_URL=http://127.0.0.1:8001`. La cuenta del fixture es solo para esa base aislada, nunca para producción.
