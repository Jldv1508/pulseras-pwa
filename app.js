document.addEventListener("DOMContentLoaded", () => {
  const listaPulseras = document.getElementById("lista-pulseras");
  const nombrePulsera = document.getElementById("nombre-pulsera");
  const infoPulsera = document.getElementById("info-pulsera");
  const listaMateriales = document.getElementById("lista-materiales");
  const listaPasos = document.getElementById("lista-pasos");
  const listaTrucos = document.getElementById("lista-trucos");
  const btnAyuda = document.getElementById("btn-ayuda");
  const btnImprimir = document.getElementById("btn-imprimir");
  const modalAyuda = document.getElementById("modal-ayuda");
  const btnCerrarModal = document.getElementById("btn-cerrar-modal");

  const nombres = Object.keys(PULSERAS);

  nombres.forEach((nombre) => {
    const li = document.createElement("li");
    li.textContent = nombre;
    li.dataset.nombre = nombre;
    li.addEventListener("click", () => mostrarPulsera(nombre));
    listaPulseras.appendChild(li);
  });

  function slugify(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function mostrarPulsera(nombre) {
    const datos = PULSERAS[nombre];
    if (!datos) return;

    document.querySelectorAll(".lista-pulseras li").forEach(li => {
      li.classList.toggle("activa", li.dataset.nombre === nombre);
    });

    // Mostrar infografia si existe
    const slug = slugify(nombre);
    let imgInfografia = document.getElementById("infografia-pulsera");
    if (!imgInfografia) {
      imgInfografia = document.createElement("img");
      imgInfografia.id = "infografia-pulsera";
      imgInfografia.className = "infografia-pulsera";
      imgInfografia.alt = "Infografia de " + nombre;
      const header = document.querySelector(".pulsera-header");
      header.parentNode.insertBefore(imgInfografia, header.nextSibling);
    }
    imgInfografia.src = "infografias/" + slug + ".jpg";
    imgInfografia.classList.remove("oculta");
    imgInfografia.onerror = () => {
      imgInfografia.classList.add("oculta");
    };

    nombrePulsera.textContent = "📿 " + nombre;
    infoPulsera.textContent = datos.dificultad + "  ·  " + datos.tiempo;

    infoPulsera.className = "info-pulsera";
    if (datos.dificultad.indexOf("⭐⭐⭐") !== -1) infoPulsera.classList.add("avanzado");
    else if (datos.dificultad.indexOf("⭐⭐") !== -1) infoPulsera.classList.add("intermedio");
    else infoPulsera.classList.add("facil");

    listaMateriales.innerHTML = "";
    datos.materiales.forEach(m => {
      const li = document.createElement("li");
      li.textContent = m;
      listaMateriales.appendChild(li);
    });

    listaPasos.innerHTML = "";
    datos.pasos.forEach(p => {
      const li = document.createElement("li");
      li.textContent = p;
      listaPasos.appendChild(li);
    });

    listaTrucos.innerHTML = "";
    datos.trucos.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      listaTrucos.appendChild(li);
    });

    document.title = nombre + " · Pulseras con Hilos";

    const panelDer = document.querySelector(".panel-derecho");
    panelDer.scrollTop = 0;

    if (window.innerWidth <= 768) {
      panelDer.scrollIntoView({ behavior: "smooth" });
    }
  }

  btnAyuda.addEventListener("click", () => modalAyuda.classList.remove("oculto"));
  btnCerrarModal.addEventListener("click", () => modalAyuda.classList.add("oculto"));

  modalAyuda.addEventListener("click", (e) => {
    if (e.target === modalAyuda) modalAyuda.classList.add("oculto");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modalAyuda.classList.add("oculto");
  });

  btnImprimir.addEventListener("click", () => window.print());

  if (nombres.length > 0) mostrarPulsera(nombres[0]);

  // ============================================================
  //  LIGHTBOX - Zoom de infografías
  // ============================================================
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const btnCerrarLightbox = lightbox.querySelector(".lightbox-cerrar");

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("infografia-pulsera")) {
      const src = e.target.src;
      if (src && !e.target.classList.contains("oculta")) {
        lightboxImg.src = src;
        lightbox.classList.add("activo");
        document.body.style.overflow = "hidden";
      }
    }
  });

  function cerrarLightbox() {
    lightbox.classList.remove("activo");
    document.body.style.overflow = "";
    setTimeout(() => { lightboxImg.src = ""; }, 300);
  }

  btnCerrarLightbox.addEventListener("click", (e) => {
    e.stopPropagation();
    cerrarLightbox();
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      cerrarLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("activo")) {
      cerrarLightbox();
    }
  });

});
