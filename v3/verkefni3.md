---
geometry: margin=20mm
urlcolor: blue
header-includes: |
    \usepackage{fancyhdr}
    \pagestyle{fancy}
    \lhead{Jaan Jaerving}
    \chead{}
    \rhead{TÖL203M, Verkefni 3}
...

[Hlekkur](https://anjrv.github.io/v3/)

## Update/Render

Verkefnið byggist á kóða sem kemur með cube-ball-plane. Ákvað að teikna bara á x/y ásar og minnka aðeins veggir á ý ásinn til að gefa auka line-of-sight fyrir Pacman.

Vegna þess að Three.js hlutir geyma ýmsar upplýsingar nú þegar eru þær notaðar beint fyrir update lykkju, það þarf bara einhverjar auka tilviksbreytur til að láta allt virka, t.d:

```js
  const geom = new THREE.SphereGeometry(GHOST_RADIUS, 64, 32);
  const mat = new THREE.MeshStandardMaterial({ color: color });
  const ghost = new THREE.Mesh(geom, mat);
  ghost.direction = new THREE.Vector3(-1, 0, 0);
  ghost.isGhost = true;
  ghost.isScared = false;
  ghost.originalColor = color;
  ghost.update = function ...
```

Heimurinn er svo teiknaður út frá strengjafylki sem hægt er að skoða í `map.js` skrá. Fyrir leikjarstöðu er einnig verið að nota hlut til að geyma upprunalegur staðsetningar fyrir t.d. upprunarpúnkt Pacmans eða hvar molarnir eru svo hægt sé að endurteikna þessar hlutir þegar leikurinn byrjar aftur.

## Sjónarhorn

Hægt er að spila leikinn frá sjónarhorn 1. persónu og 3. persónu eins og beðinn var um. Aðallega er verið að horfa "á" Pacman og svo er notað linuleg brúun til að láta sjónarhorn að snúa sér eins og Pacman er að snúa sig. Sem betur fer er linuleg brúun í boði í Three.js, það er eiginlega ómögulegt að reyna að spila í 1. persónu þegar sjónarhornið breytist strax þegar ýtt er á takka.

Aukalega er hægt að spila með overhead sjónarhorn meira eins var í gamla góða daga.
