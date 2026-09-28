# Portales de proveedores · Distribuidora Andes

Cinco portales de cotización de proveedores ficticios, publicados como sitios estáticos.

**https://axcel17.github.io/proveedores-andes/**

| Proveedor         | Formato de respuesta       | Particularidad                          |
| ----------------- | -------------------------- | --------------------------------------- |
| Tecnoimport       | Tabla HTML                 | Flete cobrado aparte                    |
| MayoristaZeta     | PDF descargable            | Precio por caja de diez unidades        |
| GlobalStock       | Texto plano                | Plazo de 22 días calendario             |
| Suministros Delta | Consulta previa, luego tabla | No cotiza hasta que se responde         |
| ImportAndina      | —                          | No emite cotización                     |

Sin backend, sin base de datos y sin dependencias externas: todo el estado viaja en la URL. Cada
portal genera una referencia al recibir una solicitud y muestra la cotización pasado un umbral de
tiempo.

Los datos, las empresas y los precios son ficticios. Los portales existen para ejercitar sistemas
automatizados de comparación de cotizaciones contra respuestas de formato desigual.

## Servirlos en local

```bash
python3 -m http.server 8000
```

## Licencia

MIT. Ver [`LICENSE`](LICENSE).
