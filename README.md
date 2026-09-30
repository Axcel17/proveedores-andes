# Portales de proveedores · Distribuidora Andes

Cinco portales de cotización de proveedores ficticios, publicados como sitios estáticos.

**https://axcel17.github.io/proveedores-andes/**

| Proveedor         | Formato de respuesta         | Particularidad                   |
| ----------------- | ---------------------------- | -------------------------------- |
| Tecnoimport       | Tabla HTML                   | Flete cobrado aparte             |
| MayoristaZeta     | PDF descargable              | Precio por caja de diez unidades |
| GlobalStock       | Texto plano                  | Plazo de 22 días calendario      |
| Suministros Delta | Consulta previa, luego tabla | No cotiza hasta que se responde  |
| ImportAndina      | —                            | No emite cotización              |

## Un solo catálogo

Los precios, los plazos y quién maneja qué producto viven en
[`catalogo.json`](catalogo.json). Ningún portal repite un precio: lo consultan por
[`catalogo.js`](catalogo.js), que también resuelve el texto libre del formulario contra los productos
del catálogo.

**El repositorio del taller guarda una copia de ese JSON y la contrasta contra esta.** Si alguien
cambia un precio aquí y no allá, su verificación lo dice. Dos programas, un contrato.

| Producto                         | Tecnoimport | MayoristaZeta | GlobalStock | Delta  | ImportAndina |
| -------------------------------- | ----------- | ------------- | ----------- | ------ | ------------ |
| Monitor 24" Full HD              | 168,00      | 1.590,00/caja | 149,00      | 164,00 | no cotiza    |
| Estación de acople USB-C         | 210,00      | —             | 195,00      | 205,00 | no cotiza    |
| Kit teclado y mouse inalámbricos | 42,00       | —             | 38,00       | —      | no cotiza    |
| Silla ergonómica                 | —           | —             | —           | 185,00 | no cotiza    |

La cobertura es desigual a propósito: un proveedor que no maneja el producto lo dice, y eso es un
resultado, no un error. MayoristaZeta se limita a monitores porque su respuesta es un PDF fijo, y ese
PDF describe un solo artículo. ImportAndina no lee el catálogo: no emite cotización, sea lo que sea
que se le pida.

Un producto que no está en el catálogo se responde con una petición de precisión, no con un precio
inventado.

### La regla de resolución

Texto libre → producto. Normalizar a minúsculas sin tildes, reducir lo que no sea letra o dígito a
un espacio, y buscar los sinónimos como subcadena; si coinciden varios, gana el del sinónimo más
largo. Está escrita en `catalogo.json` junto a los catorce casos con los que se comprueba, porque la
implementan dos programas y tienen que coincidir.

Sin backend, sin base de datos y sin dependencias externas: todo el estado viaja en la URL. Cada
portal genera una referencia al recibir una solicitud y muestra la cotización pasado un umbral de
tiempo.

Los datos, las empresas y los precios son ficticios. Los portales existen para ejercitar sistemas
automatizados de comparación de cotizaciones contra respuestas de formato desigual.

## Servirlos en local

```bash
python3 -m http.server 8000
```

**Por HTTP, no con `file://`.** Las páginas de seguimiento leen `catalogo.json`, y un navegador
bloquea esa lectura desde el origen de archivo: la cotización se quedaría en «Catálogo no
disponible».

## Licencia

MIT. Ver [`LICENSE`](LICENSE).
