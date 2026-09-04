---
name: Sol de Bambú
description: Una tarde que cae, en una sola página. Editorial y arquitectónico, con la fotografía al mando y el color de fondo atado al scroll.
colors:
  sol: "#F6A72D"
  sol-dia: "#F4A62A"
  sol-hondo: "#DE8F16"
  sol-vivo: "#FFBE55"
  tierra: "#96481B"
  bambu: "#456E4B"
  musgo: "#7FA07E"
  crema: "#F4E8D3"
  noche: "#0B1531"
  noche-hondo: "#070B18"
  bosque: "#131F3F"
  bosque-alto: "#1E2843"
  filete: "#2B3A66"
  cielo: "#D3E8F5"
  arena: "#D3E8F5"
  arena-2: "#C6DFEF"
  arena-3: "#AFCFE2"
  tinta: "#111C2C"
  tinta-2: "#3E5164"
  tinta-3: "#647A8D"
  bruma: "#F4E8D3"
  bruma-2: "#C2BBAD"
  bruma-3: "#9B958B"
  whatsapp: "#25D366"
typography:
  wordmark:
    fontFamily: "Archivo, 'Arial Black', system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 8.6vw, 9.8vw)"
    fontWeight: 900
    lineHeight: 0.82
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 125, 'wght' 900"
  titular-grande:
    fontFamily: "'Bricolage Grotesque', 'DM Sans', system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 1.1rem + 4.4vw, 4.6rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.032em"
  titular:
    fontFamily: "'Bricolage Grotesque', 'DM Sans', system-ui, sans-serif"
    fontSize: "clamp(2.05rem, 1.15rem + 3.1vw, 3.65rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.032em"
  titular-chico:
    fontFamily: "'Bricolage Grotesque', 'DM Sans', system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 1rem + 1.1vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.026em"
  portada:
    fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif"
    fontSize: "clamp(3rem, 5vw, 5.8rem)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.018em"
  portada-chica:
    fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.5rem, 1rem + 1.4vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.012em"
  bajada:
    fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1.68
    letterSpacing: "-0.002em"
  body:
    fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "normal"
  body-chico:
    fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.55
  meta:
    fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif"
    fontSize: "0.86rem"
    fontWeight: 500
    lineHeight: 1.45
  mono:
    fontFamily: "'DM Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.14em"
rounded:
  foco: "4px"
  boton: "12px"
  panel: "12px"
  foto: "16px"
  foto-grande: "20px"
  full: "9999px"
spacing:
  gutter: "20px"
  gutter-lg: "32px"
  section-y: "96px"
  section-y-lg: "128px"
  container: "1152px"
components:
  boton-sol:
    backgroundColor: "{colors.sol}"
    textColor: "{colors.noche}"
    rounded: "{rounded.boton}"
    padding: "12.8px 22.4px"
    minHeight: "46px"
    typography: "{typography.body-chico}"
  boton-sol-hover:
    backgroundColor: "{colors.sol-hondo}"
    translate: "0 -2px"
  boton-linea:
    backgroundColor: "transparent"
    borderColor: "rgba(244,232,211,0.28)"
    textColor: "{colors.crema}"
    rounded: "{rounded.boton}"
  boton-linea-hover:
    backgroundColor: "rgba(244,232,211,0.10)"
    borderColor: "rgba(244,232,211,0.50)"
  boton-linea-dia:
    backgroundColor: "transparent"
    borderColor: "rgba(17,28,44,0.24)"
    textColor: "{colors.tinta}"
    rounded: "{rounded.boton}"
  panel-noche:
    backgroundColor: "rgba(20,28,52,0.60)"
    borderColor: "{colors.filete}"
    textColor: "{colors.crema}"
    rounded: "{rounded.panel}"
    padding: "28px"
  chip:
    backgroundColor: "transparent"
    borderColor: "{colors.filete}"
    textColor: "{colors.bruma-2}"
    rounded: "{rounded.boton}"
    minHeight: "44px"
  chip-activo:
    backgroundColor: "{colors.sol}"
    textColor: "{colors.noche}"
  boton-whatsapp:
    backgroundColor: "{colors.whatsapp}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    height: "56px"
    width: "56px"
---

# Design System: Sol de Bambú

## Overview

**Creative North Star: "Una tarde que cae"**

La página no es un sitio oscuro ni un sitio claro: es una tarde completa. Se entra a mediodía sobre el celeste del valle de Mala, y a mitad de recorrido —secuencia del atardecer y franja de crepúsculo— el fondo y el texto de la página se apagan **progresivamente con el scroll** hasta el azul tinta de la hora de la fogata. El scroll no es navegación, es el paso de las horas. Cualquier elemento nuevo tiene que responder una pregunta antes que ninguna otra: ¿a qué hora ocurre?

El registro es **editorial y arquitectónico**, no de producto: fotografía grande y recortada con intención, titulares compactos con carácter impreso, mucho silencio alrededor del texto, composiciones asimétricas pero ordenadas. Se parece más al catálogo de un lodge que al aviso de un alojamiento. La densidad es baja a propósito, porque lo que se vende es espacio y una página apretada contradice cinco mil metros cuadrados.

Los colores están muestreados de la propiedad: el celeste del cielo del valle, el ámbar del atardecer que la reseña de Jeri menciona por escrito, el verde del bambú, la crema del techo. Esa procedencia es la razón por la que el sistema no se puede confundir con otro.

**Key Characteristics:**

- Una sola tarde, con la hora atada al scroll — nunca dos temas pegados
- Tres tipografías con tres trabajos distintos, más el wordmark del hero
- Un único color de acción, el amarillo sol, siempre con texto tinta encima
- Esquinas de 12px; la píldora completa queda solo para círculos de ícono
- Fotografía real y grande, con grano; sin ilustración, sin stock, sin mockups
- Bambú como textura, una sola vez en toda la página — nunca repetido sección a sección

## Colors

### El acento

- **Sol** (`#F6A72D`) / **Sol de día** (`#F4A62A`): el único color de acción de la página. Fondo del CTA principal, siempre con texto `noche` encima (8.4:1). Y el color de las etiquetas de sección sobre fondo oscuro. Nunca es fondo de una superficie grande.
- **Sol hondo** (`#DE8F16`): el hover del CTA. El botón se oscurece, no se aclara.
- **Sol vivo** (`#FFBE55`): la brasa del horizonte y la línea de luz. Decorativo, nunca accionable.
- **Terracota** (`#96481B`): el acento de **texto** de la mitad de día. El amarillo sobre celeste no llega a 2:1 y no se puede usar para texto; la terracota da 5.2:1 y es el mismo calor un paso más abajo.

### La noche

- **Azul tinta** (`#0B1531`): el fondo de la mitad de noche. Es azul con un punto de violeta, nunca negro. La distancia entre el canal rojo y el azul —38 puntos— es de donde sale que se lea como noche y no como gris sucio; el tono anterior (`#0C1225`) tenía 25 y a pantalla completa se apagaba.
- **Azul hondo** (`#070B18`): el pie de página.
- **Azul carbón** (`#131F3F`) y **carbón alto** (`#1D2B4F`): las superficies elevadas.
- **Filete** (`#2B3A66`): el borde de un píxel. Es toda la separación que hay.
- **Crema** (`#F4E8D3`, 14.8:1), **crema media** (`#C2BBAD`, 9.3:1), **crema baja** (`#9B958B`, 6:1): los tres niveles de texto sobre la noche. Cálidos, nunca blanco puro.

### El día

- **Celeste del valle** (`#D3E8F5`): el fondo de la mitad de día. Plano, no degradado.
- **Celeste en sombra** (`#C6DFEF`) y **celeste mojado** (`#AFCFE2`): superficies y bordes.
- **Tinta** (`#111C2C`, 15:1), **tinta media** (`#3E5164`, 6.5:1), **tinta baja** (`#647A8D`, 3.4:1): los tres niveles de texto sobre el día. La tinta baja **no es apta para texto**: solo para bordes e íconos decorativos.
- **Verde bambú** (`#456E4B`): la vegetación. Es la silueta del bambusal y el acento secundario del día. Su versión levantada (`#7FA07E`) existe solo para poder leerse sobre la noche.

### La hora — `--mezcla`

Dos fracciones que escribe el scroll sobre `<html>` (ver `componentes/Crepusculo.tsx`) y contra las que se mezclan en oklab el fondo y el texto de la zona de transición: `.fondo-hora`, `.texto-hora`, `.texto-2-hora`, `.borde-hora`.

**La Regla de las Dos Fracciones.** El fondo (`--mezcla`) y el texto (`--mezcla-t`) **nunca cruzan a la vez**. Si lo hicieran habría un instante exacto con contraste 1:1. El fondo arranca apenas entra la secuencia; el texto espera al 34% del recorrido, con el último contenido claro ya fuera de pantalla. El peor contraste medido con contenido de día a la vista es 5.6:1.

### Named Rules

**La Regla de la Hora.** Cada sección pertenece al día o a la noche, o participa de la transición. Un fondo celeste obliga a texto tinta y acento terracota; un fondo noche obliga a texto crema y acento sol. Mezclar un token de una mitad dentro de la otra es el error más grave del sistema.

**La Regla de la Voz Única.** Solo hay un color de acción, el sol, y solo lo llevan los elementos accionables. Nada decorativo se pinta con el acento.

**La Regla del Cielo.** Ningún `#000` como fondo, nunca. El fondo oscuro es azul, y ese matiz es lo que impide que se lea como el negro por defecto de cualquier landing.

## Typography

Tres familias con tres trabajos que no se solapan, más el wordmark.

- **Bricolage Grotesque** (600–800) — **titulares**. Grotesca de contornos irregulares: tiene carácter impreso sin caer en lo decorativo. Interlineado 1.02 y tracking −0.032em: los titulares se leen como bloques, de tres o cuatro líneas.
- **DM Sans** (400–700) — **cuerpo y navegación**. Limpia y con aire.
- **DM Mono** (400–500) — **solo microcopy**: "KM 86", "MALA, PERÚ", "01 / 15", etiquetas de sección, contadores. Nunca párrafos. Es el único lugar donde hay mayúsculas.
- **Cormorant Garamond** (400/500 + italic) — **reservada a la galería**. Es la única serif del sistema y aparece en un solo sitio: el titular de portada de la colección y el título de la lámina seleccionada. La galería es la única sección que se presenta como una colección y no como una explicación, y una serif de alto contraste es lo que marca esa diferencia sin cambiar un solo color. Peso regular, nunca bold; la palabra en cursiva usa la italic verdadera de la familia, no una oblicua sintética.
- **Archivo variable** (`wdth` 62–125) — **reservado al wordmark del hero**. Su eje de ancho es lo que le permite llenar el viewport exacto en cualquier breakpoint y calzar con la máscara de oclusión de la foto. No se usa en ninguna otra parte.

### Named Rules

**La Regla de la Etiqueta.** Todo titular de sección va precedido de una etiqueta en DM Mono, versalitas, en el acento de esa mitad. Marca dónde empieza cada capítulo de la tarde.

**El escalón de interfaz.** Entre el microcopy en mono (0.72rem) y el cuerpo chico (0.95rem) hay un solo paso intermedio, **meta (0.86rem)**: enlaces de navegación, líneas del pie y el texto del botón chico. No hay nada entre medio — 0.88 y 0.90 son el mismo tamaño que 0.86 para cualquier ojo, y tenerlos los tres solo garantiza que nada alinee.

**La Regla de la Serif.** La serif vive **solo en la galería**. Es lo que la separa del resto de la página: las demás secciones informan, esa expone. Llevarla a un titular de otra sección le quita a la galería lo único que la distingue y convierte el recurso en decoración.

**La Regla del Piso.** Ningún texto por debajo de **0.72rem (11.5px)**. Las etiquetas en mono, que son lo más chico de la página, viven exactamente en ese piso.

**La Regla de las Cuatro Palabras.** El microcopy en mono no pasa de cuatro o cinco palabras. Si necesita más, no es microcopy: es cuerpo, y va en DM Sans.

## Layout

Una columna centrada de 1152px como máximo (`max-w-6xl`), con márgenes de 20px que pasan a 32px desde 640px. Ritmo vertical de 96px, y 128px desde 768px.

La estructura dominante es de dos columnas desde 1024px —texto de un lado, fotografía del otro, alternando el lado sección a sección— y una sola columna apilada por debajo. Dos secciones rompen la caja a propósito: la carretera es de borde a borde, y la pista del carrusel sale de la columna para que las fotos vecinas asomen hasta el borde de la pantalla.

El celular es la pantalla de referencia. Todo tratamiento geométrico que desperdicie ancho en 375px **se apaga por debajo de 1024px en lugar de encogerse**.

## Elevation & Depth

**Las superficies de interfaz son planas y la fotografía flota.** Paneles, acordeones y contenedores no llevan sombra: se separan subiendo un escalón de tono y cerrándose con un filete de un píxel. Las fotos sí llevan sombra, profunda y de doble capa.

**La Regla de la Sombra Recortada.** El `clip-path` que redondea una foto **se lleva puesta su propia sombra**. Por eso todo marco de foto son dos capas: la de afuera lleva la sombra y el radio, la de adentro lleva el recorte y la animación.

**La Regla de la Superficie Continua.** Las secciones de una misma mitad van sobre **un fondo compartido**, no cada una con el suyo. Recortan con `clip-path` y sus bordes quedan con antialias: cuando el límite entre dos cae en una fracción de píxel —que es casi siempre— por esa costura se ve lo que hay detrás. Con el `body` azul noche detrás del día, eso era una raya oscura de un píxel cruzando la página entre sección y sección. El envoltorio `.fondo-hora` de la mitad de día lo resuelve de una vez: lo que asoma por cualquier costura es el color que la página tiene a esa hora.

**La Regla del Recorte sin Scroll.** Nunca `overflow: hidden` para recortar. Convierte al elemento en contenedor de scroll y ata a él los `animation-timeline: view()` de todo lo que tenga dentro, que entonces no avanzan nunca. Se usa `clip-path` (`.recorta`) o, donde hace falta eliminar desbordamiento real, `overflow: clip`.

## Shapes

**Esquinas de 12px** para todo lo que se acciona y para todo lo que contiene: botones, chips, paneles, mapas. La fotografía sube a 16–20px. La **píldora completa queda solo para círculos de ícono** — flechas de carrusel, contadores, avatares.

El anillo de foco es la única excepción a la escala: redondea a **4px**, lo justo para no verse cuadrado sobre un texto. No es una forma del sistema, es un indicador del navegador.

**La Regla de los 12px.** Un `rounded-full` en un botón con texto es una señal de que alguien no leyó esta regla. La píldora lee como app; esto es una pieza impresa.

## Components

### Buttons

- **Forma:** 12px, alto mínimo 46px (44px en la variante chica de la barra).
- **Primario (sol):** fondo amarillo sol, texto tinta. Hover: se eleva 2px, el fondo baja a sol hondo, la flecha avanza 4px. Nada más.
- **Secundario (línea):** solo borde a baja opacidad y texto del color de su mitad; se rellena al hover.
- **Anatomía:** el ícono de WhatsApp va antes del texto y reemplaza a la flecha — un CTA no lleva las dos cosas.
- El comportamiento vive una sola vez en `.boton` (index.css). Ninguna sección redeclara su CTA.

### El CTA de reservar

Aparece **seis veces** y siempre igual: barra superior (siempre a la vista), cierre de la presentación, sobre la carretera, junto a la fogata, en el cierre de la página, y en la barra fija de celular. Sobre el hero va en crema para no competir con el botón grande que ya está ahí; en cuanto la barra se vuelve sólida pasa al amarillo sol.

### Carruseles

Dos, con la misma gramática: **una pieza grande al centro o a la izquierda y las vecinas asomando**, contador en mono (`01 / 15`), línea de avance de un píxel y dos flechas circulares de 44px. **Nunca puntos como única navegación.**

- **Galería:** pista que se desplaza (no funde: un fundido no tiene dirección), arrastrable con el mouse y deslizable con el dedo. Las vecinas van al 40% de opacidad y 30% de saturación.
- **Reseñas:** scroll nativo con `scroll-snap`. Funciona con dedo, trackpad, rueda y teclado sin programar ninguna de las cuatro cosas.

### Signature Component: la composición fotográfica

Reemplaza al collage en rombos, que recortaba lo que importaba de cada foto y convertía la fotografía en un patrón. Es una caja de proporción fija con **una foto vertical grande y dos detalles colocados en porcentajes** que la muerden por el borde. El solapamiento es idéntico en cualquier ancho porque está medido sobre la caja, no sobre el contenido. Por debajo de 1024px se desarma en foto grande + dos detalles en fila.

### El bambusal

**Una sola vez en toda la página, por los dos lados, al 30%.** Repetirlo en las cuatro secciones de día lo convertía en un borde decorativo que competía con la fotografía; lo que lo arregla es que ocurra **una vez**, no que ocurra a medias. A esa opacidad y en la sección de presentación, encuadrar por las dos paredes es lo que la hace leer como portada. La caña derecha es la izquierda volteada, no un segundo dibujo.

## Motion

**Tres gestos, y ninguno más.**

1. **El texto sube**: opacidad + `translateY` de 22px. Nunca más, nunca con rebote.
2. **La foto se destapa**: una máscara vertical (`clip-path`) que la revela de arriba abajo, como pasar la mano sobre una copia impresa. Reemplaza al fundido genérico.
3. **La cámara se acerca**: 6% de zoom durante la entrada. Es el tope; más que eso se lee como zoom y distrae.

Todo va atado al recorrido del scroll con `animation-timeline: view()`, no al reloj: si la persona se detiene, la animación se detiene con ella. Las duraciones de interfaz van de 150ms (color, presión) a 480ms (acordeón, cambio de foto), sobre `--ease-suave` para respuesta cromática y `--ease-editorial` para todo lo que se desplaza.

La página lleva una **barra de avance de scroll** de dos píxeles en el borde superior, resuelta con `animation-timeline: scroll(root)` — sin listener y sin estado.

### Named Rules

**La Regla del Reposo Visible.** El estado natural de cualquier elemento es "se ve". Ninguna animación puede ser lo que hace visible un contenido: si no llega a correr, el contenido igual tiene que estar ahí.

**La Regla del Movimiento Reducido.** `prefers-reduced-motion` apaga el movimiento **espacial** y deja viva la respuesta cromática. Las transiciones de color no marean a nadie y sí sirven para entender qué está pasando.

## Do's and Don'ts

### Do:

- **Do** decidir primero a qué hora pertenece lo que estás construyendo, y tomar los tokens de esa mitad en bloque.
- **Do** poner una etiqueta en DM Mono antes de cada titular de sección.
- **Do** dar 12px de radio y 44px de alto mínimo a todo lo que se toca.
- **Do** recortar con `clip-path`, poner la sombra en el envoltorio de afuera, y apoyar las secciones de una mitad sobre un fondo compartido.
- **Do** mantener los 96/128px de aire entre secciones aunque la página se haga larga.
- **Do** apagar por completo un tratamiento geométrico por debajo de 1024px en lugar de encogerlo.

### Don't:

- **Don't** usar `#000` como fondo ni blanco puro como texto.
- **Don't** usar `overflow: hidden` para recortar: rompe los timelines de scroll de todo lo que hay dentro.
- **Don't** poner texto por debajo de 0.72rem, ni tinta baja (`#647A8D`) sobre el celeste.
- **Don't** volver a la píldora completa en botones con texto.
- **Don't** repetir el bambusal en más de una sección. Una vez, por las dos paredes, al 30%.
- **Don't** derivar hacia el default de landing oscura —negro puro con acento fluorescente— ni hacia el lenguaje de producto SaaS: bento grids de tarjetas iguales, degradados violeta, glassmorphism, blobs, íconos genéricos. Todos fueron rechazados explícitamente.
- **Don't** inventar reseñas, precios, disponibilidad ni amenidades. Lo que no está confirmado por la ficha de la propiedad no entra (ver PENDIENTES en `datos/amenidades.ts` y `datos/faq.ts`).
