---
geometry: margin=20mm
urlcolor: blue
header-includes: |
    \usepackage{fancyhdr}
    \pagestyle{fancy}
    \lhead{Jaan Jaerving}
    \chead{}
    \rhead{TÖL203M, Verkefni 1}
...

[Hlekkur](https://anjrv.github.io/v1/)

## Grunnvirkni

Verkefnið byggist á kóða sem kemur með spadi-orvar. Breytingar voru gerðar til að geta teiknað margar hlutir í einu án þess að vita nákvæma magn.

* Render: Render fallið og drawArrays var breytt yfir á TRIANGLES aðferðina. Einnig er notaður sér buffer fyrir position og color - hvert entity sér um að bæta viðeigandi hnútar í position fylki og colors fylki. Render aðferð inniheldur einnig setTimeout til að námunda niður að 60 fps. Þegar Maríus nær 10 gullmolar eða deyr þá notar render fallið fyrrverandi hnútar og update fallið mun ekki uppfæra hnútar lengur.

* Update: computeChange fallið sér um að uppfæra staðsetningar og búa til skrýmslið og gullmolar - nánar um auka viðbótar seinna. Staðsetningar eru geymdar í minni sem canvas eða world staðsetningar og uppfærðar þannig. Allt er svo teiknað út frá canvas staðsetningu með því að túlka niður á -1, 1 hnitakerfið, oftast gert með drawRect hjálparfall. Þessi hjálparfall teiknar allt nema þríhyrning sem sýnir í hvaða átt Maríus stefnir.

```javascript
function drawRect(x, y, sideLength) {
  const midX = (2 * x) / canvas.width - 1;
  const midY = (2 * (canvas.height - y)) / canvas.height - 1;
  const vertDiff = sideLength / canvas.width; // Assume width === height

  const rectVerts = [
    vec2(midX - vertDiff, midY - vertDiff),
    vec2(midX - vertDiff, midY + vertDiff),
    vec2(midX + vertDiff, midY - vertDiff),
    vec2(midX - vertDiff, midY + vertDiff),
    vec2(midX + vertDiff, midY - vertDiff),
    vec2(midX + vertDiff, midY + vertDiff),
  ];

  return rectVerts;
}
```

* Collision: Árekstrar eru reiknaðar bara fyrir Maríus og nota einfaldar ferningar allstaðar nema fyrir skjásvæði - í þann tilfelli er skoðaður hvort Maríus er að fara úr canvas svæðið.

## Viðbætur

* Fleiri en einn gullmoli - sýnilegur í tiltekna tímalengd. Gullmolar eru kóðaðar sem javascript prototype sem inniheldur x og y staðsetningu og einnig hversu lengi gullmoli á að vera sýnilegur. Update aðferðin notar þá `Math.random()` til að bæta við gullmolum í fylkið sem er teiknaður og fjarlægir einnig gullmolar sem hafa verið sýnilegar í 10 sek. Staðsetning sem gullmoli fær er einnig reiknaður með `Math.random()` á eftirfarandi hátt:

```javascript
x: getRandomInt(0 + half, canvas.width - half),
y: getRandomInt(400 + half, canvas.height - half)
```

* Hindranir á gólfinu. Útfært sem tveir staflar af ferningum sem Maríus getur ekki labbað í gegnum. Árekstur er einnig reiknaður fyrir y-ásin og Maríus getur hoppað on á stafla.

* Skrýmsli. Notar að mestu leyti sömu kóða og gullmoli - bætt við með `Math.random()` en þar getur bara verið 1 skrýmsli á skjánum í einu. Skrýmsli kemur alltaf þá þeirri hlið sem er lengst frá Maríus - staðsetningin er þá uppfært með því að breyta x gildi sem skrýmslið byrjar með.

```javascript
const x = playerX > canvas.width / 2 ? 30 : canvas.width - 30;
```
...
```javascript
monster.x += monster.dir * 5;
```

* Strik fyrir gullmola. Teiknaður er stafli af 3 ferningum þegar Maríus fær gullmola - hér er notuð hreiðruð for-lykkja sem notar stigafjölda sem takmörkun fyrir ýtri lykkju.
