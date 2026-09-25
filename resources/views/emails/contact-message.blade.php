Nueva consulta desde el sitio de Gallo Negro

Motivo: {{ $topic }}
@if ($productName)
Producto: {{ $productName }}
Ficha: {{ $productUrl }}
@endif

Nombre: {{ $name }}
Correo: {{ $email }}
@if ($phone)
Teléfono: {{ $phone }}
@endif

Mensaje:
{{ $body }}

---
Podés responder este correo directamente para contestarle a {{ $name }}.
