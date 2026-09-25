# Gallo Negro — primera propuesta

Actualización vigente del hero: video completo junto al texto en escritorio y debajo del título en celular, sin difuminado, texto superpuesto ni control de pausa visible. El fondo arena continúa desde el navbar hasta el catálogo. Reproducción silenciosa en bucle, con pausa automática fuera de pantalla o al ocultar la pestaña. Movimiento reducido muestra el poster.

El original del cliente `public/videos/gallo-negro-hero.mp4` (1104×576, 5,04 segundos) se conserva. La versión publicada `public/videos/gallo-negro-hero-hd.mp4` se reescaló a 1920×1002 con Lanczos y nitidez moderada, H.264 CRF 18, sin audio y con faststart. La ampliación no recupera detalle nativo ausente. Poster: `public/videos/hero-poster.jpg`.

Tarjetas compartidas entre portada y catálogo: fotografía completa con object-fit contain, fondo neutro sin capa verde, información debajo de la imagen y acceso a galería. La galería también conserva el encuadre completo sobre un fondo neutro. Las propuestas siguientes documentan la evolución anterior del diseño.

Dirección: catálogo claro y cálido, con fotografía real y el oficio del taller como identidad.

- Arena `#F4F0E7`: fondo principal.
- Hierro `#292B23`: títulos y texto.
- Óxido `#984829`: acciones principales.
- Oliva `#30372C`: sección del taller y pedido.
- Lino `#E9E3D6`: bloque de contacto.
- Tipografía: Barlow Condensed para títulos de carácter industrial; DM Sans para lectura y controles. Fuentes servidas localmente.

Composición: portada en dos columnas con texto alineado a izquierda y fotografía vertical; catálogo de cuatro columnas (dos en celular); taller con fotografía del proceso; pasos de compra y contacto. Una sola imagen protagonista, sin carruseles ni movimiento automático.

Referencias de organización comercial: https://tromen.com/ y https://productosnuke.com.ar/. Fotografías y logo propios aportados por el cliente. Los datos comerciales de esta versión son ficticios.

Próxima revisión: estética, selección de fotografías y categorías definitivas. Luego reemplazar catálogo y datos de contacto. Administración pendiente para otra etapa.

## Movimiento

Motion para React: https://motion.dev/docs/react. También se revisó GSAP (https://gsap.com/resources/React/); se eligió Motion por su integración declarativa con los estados de React y las transiciones de layout del catálogo.

La portada concentra el efecto principal: título por líneas, fotografía revelada con máscara, sello con resorte y profundidad suave que responde al mouse. La foto tiene un desplazamiento leve al recorrer la página. El taller y el encabezado del catálogo aparecen una sola vez al entrar en pantalla. Filtros, ordenamiento, cantidades y diálogos responden a acciones del usuario.

Se respeta prefers-reduced-motion, se conserva el scroll nativo y la inclinación no se activa con interacción táctil. Los diálogos nativos mantienen el foco y cierran con Escape.

## Hero móvil anterior

Hasta 760 px: título en dos líneas, descripción breve, foto `3.jpeg` centrada en el fogonero completo y botón ancho «Ver catálogo». `picture` selecciona la fotografía móvil sin descargar dos imágenes de portada. Se retiran el sello y el texto sobre la foto para dejar visible el producto. El revelado es suave y no hay parallax ni inclinación en móvil. En pantallas de hasta 650 px de alto se omite la descripción y se reduce la imagen para mantener el botón dentro de la primera pantalla. Escritorio conserva su composición y foto originales.

Revisión visual realizada en 390×844, 320×568 y 430×932; el botón queda íntegramente visible en los tres tamaños.

## Propuesta anterior: carrusel inmersivo

La nueva propuesta reemplaza la portada dividida por fotografía a todo el fondo, con degradados oscuros y texto color lino. Tres escenas: encuentro, aire libre y oficio. El primer encuadre usa `7.jpeg` en escritorio y `3.jpeg` en móvil.

React gestiona el carrusel y Motion las transiciones cruzadas, el zoom suave y el desplazamiento que responde al mouse. Cambio automático cada 7 segundos, pausa manual, flechas, indicadores, teclado y gesto horizontal táctil. Una elección manual detiene el avance automático. Se pausa al pasar el cursor, enfocar controles, ocultar la pestaña o salir del área visible. Movimiento reducido desactiva avance automático y transformaciones. Se precarga la siguiente foto.

En móvil se conserva el desplazamiento vertical nativo y el botón de catálogo dentro de la primera pantalla. Verificado con pruebas de interacción y capturas en escritorio y celulares de 320, 390 y 430 px de ancho.

## Propuesta anterior: cabecera integrada

El navbar, el hero y la franja de atributos comparten una escena continua que se funde al fondo arena del catálogo. Se retiraron el carrusel, flechas e indicadores: queda un movimiento automático lento de la imagen, pausado fuera de pantalla o con pestaña oculta, y desactivado con movimiento reducido.

Navbar con controles translúcidos y bordes cálidos. «Ver catálogo» usa un acabado dorado; «Conocé el taller» tiene un fondo traslúcido con borde claro. Ambos muestran reflejo y desplazamiento magnético suave al responder al mouse. Ambos están disponibles en móvil. Se actualizaron también filtros, controles de cantidad y botones del catálogo.

Imagen de escritorio: `public/images/hero-landscape-v2.png`, adaptación horizontal con IA de `7.jpeg`, creada con el generador integrado. Resultado de 1672×941 (no 4K nativo). Prompt completo en `public/images/hero-landscape-v2.prompt.txt`. Es una interpretación fotográfica para ambientación; las fotos originales del catálogo no se sustituyeron. Móvil conserva `3.jpeg` para aprovechar su encuadre vertical sin ampliar innecesariamente.
