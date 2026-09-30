/**
 * Catalogo compartido por los cinco portales.
 *
 * Los precios, los plazos y quien maneja que producto viven en `catalogo.json`,
 * que es la fuente unica del caso. Este archivo solo lo carga y lo consulta, de
 * modo que un precio se cambie en un sitio y no en cinco.
 *
 * El repositorio del taller guarda una copia de ese JSON y la contrasta contra
 * esta: si alguien cambia un precio aqui y no alla, su verificacion lo dice.
 *
 * Sin dependencias y sin build: es un <script> mas.
 */
(function (global) {
  "use strict";

  var cache = null;

  /**
   * Reduce el texto a su contenido para poder compararlo.
   *
   * La regla esta escrita en `catalogo.json` y la comparten las dos mitades del
   * taller. Cambiarla aqui sin cambiarla alla las desalinea.
   */
  function normalizar(texto) {
    return String(texto)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  /** El producto del catalogo que pide este texto, o null si no se identifica. */
  function resolver(catalogo, texto) {
    var pedido = normalizar(texto);
    if (pedido === "") return null;

    var mejor = null;
    var largo = 0;

    catalogo.productos.forEach(function (producto) {
      producto.sinonimos.concat([producto.nombre]).forEach(function (sinonimo) {
        var aguja = normalizar(sinonimo);
        if (
          aguja !== "" &&
          pedido.indexOf(aguja) !== -1 &&
          aguja.length > largo
        ) {
          mejor = producto;
          largo = aguja.length;
        }
      });
    });

    return mejor;
  }

  function proveedorPorId(catalogo, id) {
    var encontrado = null;
    catalogo.proveedores.forEach(function (proveedor) {
      if (proveedor.id === id) encontrado = proveedor;
    });
    return encontrado;
  }

  /**
   * Que responde un proveedor ante un pedido.
   *
   * Tres respuestas posibles, y las tres son resultados legitimos: cotiza, no
   * maneja el producto, o no lo identifica. Una ausencia es un resultado, no un
   * cero.
   */
  function cotizar(catalogo, proveedorId, texto, cantidad) {
    var proveedor = proveedorPorId(catalogo, proveedorId);
    var producto = resolver(catalogo, texto);

    // Quien no cotiza no cotiza nada, y eso se decide antes de mirar el
    // producto: ImportAndina recibe la solicitud y no emite propuesta, sea lo
    // que sea que se le pida.
    if (proveedor.cotiza === false) {
      return { estado: "no-cotiza", proveedor: proveedor, producto: producto };
    }

    if (producto === null) {
      return {
        estado: "no-identificado",
        proveedor: proveedor,
        producto: null,
      };
    }

    var precio = proveedor.precios[producto.id];
    if (precio === undefined) {
      return { estado: "no-maneja", proveedor: proveedor, producto: producto };
    }

    var base = { estado: "cotiza", proveedor: proveedor, producto: producto };

    if (proveedor.unidadVenta && proveedor.unidadVenta.tipo === "caja") {
      var porCaja = proveedor.unidadVenta.unidadesPorCaja;
      var cajas = Math.ceil(cantidad / porCaja);
      base.cajas = cajas;
      base.unidadesPorCaja = porCaja;
      base.unidadesFacturadas = cajas * porCaja;
      base.porCajaUsd = precio.porCajaUsd;
      base.unitarioUsd = precio.porCajaUsd / porCaja;
      base.fleteUsd = proveedor.fleteUsd;
      base.totalUsd = cajas * precio.porCajaUsd + proveedor.fleteUsd;
      return base;
    }

    base.unitarioUsd = precio.unitarioUsd;
    base.conGarantiaExtendidaUsd = precio.conGarantiaExtendidaUsd;
    base.fleteUsd = proveedor.fleteUsd;
    base.importeUsd = precio.unitarioUsd * cantidad;
    base.totalUsd = base.importeUsd + proveedor.fleteUsd;
    return base;
  }

  /**
   * El plazo, como se escribe en una pagina.
   *
   * `unidadPlazo` es un valor de maquina y por eso va sin tilde en el JSON, que
   * comparten dos programas. Cada uno lo presenta a su manera: estas paginas en
   * espanol con tildes, y las plantillas del taller en texto plano.
   */
  function plazoTexto(proveedor) {
    var unidad = proveedor.unidadPlazo === "habiles" ? "hábiles" : "calendario";
    return proveedor.diasEntrega + " días " + unidad;
  }

  /** Carga el catalogo una sola vez por pagina. */
  function cargar() {
    if (cache !== null) return Promise.resolve(cache);
    return fetch("../catalogo.json", { cache: "no-store" })
      .then(function (respuesta) {
        if (!respuesta.ok)
          throw new Error("catalogo.json respondio " + respuesta.status);
        return respuesta.json();
      })
      .then(function (catalogo) {
        cache = catalogo;
        return catalogo;
      });
  }

  global.Catalogo = {
    cargar: cargar,
    normalizar: normalizar,
    resolver: resolver,
    plazoTexto: plazoTexto,
    cotizar: cotizar,
    proveedorPorId: proveedorPorId,
  };
})(window);
