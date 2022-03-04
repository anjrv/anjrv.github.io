---
geometry: margin=20mm
urlcolor: blue
header-includes: |
    \usepackage{fancyhdr}
    \pagestyle{fancy}
    \lhead{Jaan Jaerving}
    \chead{}
    \rhead{TÖL203M, Verkefni 2}
...

[Hlekkur](https://anjrv.github.io/v2/)

## Grunnvirkni

Verkefnið byggist á kóða sem kemur með cube-cull. Aðallega var þetta notaður sem grunnur til þess að fá mismunandi minnisvæði fyrir linu grindin og teningar

* **Update virkni**: Fyrir hvert render kall er skoðað hvort einhver dýr á að breyta stefnu og staðsetningin er svo uppfært út frá núverandi stefnu. Einnig er skoðað hvort það á að bæta við eða drepa einhvern dýr.
  - **Hreyfingin**: Ákvörðun var tekinn til að hafa nákvæmari hreyfingu og ekki bara fletta milli fylkja-reita. Hermunin kemur þá betur fram en það var farið í ýmsar krókaleiðir til að herma eftir árekstur.
  - **Árekstur**: Til þess að minnka kostnað fyrir áreksturs aðferðir er pýþagórasarregla bara notaður til að gá hvort úlfur hefur náð kind. Í öðrum tilfellum er bara skoðaður hvort hægt sé að ferðast milli fylkja reit eða ekki.
  - **"Fylki"**: Javascript hefur eiginlega ekki góða leið til að útfæra góða 3D fylki, notaður var hakkatafla með fylkja staðsetningar sem lyklar. Sjá dæmi fyrir neðan.

```javascript
        updateAnimals: function (m = 1) {
          for (let i = this.sheep.length - 1; i >= 0; i--) {
            if (this.sheep[i].isDead) {
              delete this.grid[
                `${this.sheep[i].xIdx},${this.sheep[i].yIdx},${this.sheep[i].zIdx}`
              ];
              this.sheep.splice(i, 1);
            } else this.sheep[i].update(m);
          }
          ...
        }
```

* **Render**: Flest allt er teiknað með því að hliðra frá uppháfsspúnkt um x,y,z staðsetningu á dýr.

```javascript
    swapColor(sheepColors);
    for (let i = 0; i < simulationState.sheep.length; i++) {
      const currLoc = simulationState.sheep[i].getPos();
      const ctm1 = mult(ctm, translate(currLoc.cx, currLoc.cy, currLoc.cz));

      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
      gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
      gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
      gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
    }
    ...
```

* **Valmynd:** Það er margt sem hægt er að breyta og flest allar breytingar vistaðar í sessionStorage á vafra. Hægt er að stilla hraða fyrir ýmislegt - það verður bara að prófa það.
\

* **"Villur":**
  - Í sumum tilfellum getur dýr lent utan um "fylki" þegar fjöldi hækkar verulega.
  - Þar sem skynjun fyrir árekstrar milli t.d. kinda er mjög einfalt er hægt að sjá "clipping" þegar kindurnar eru í aðliggjandi reit en með miðjupúnkt mjög nálægt þann aðliggjandi reit. Það er nokkuð veginn reynt að minnka það með því að hafa breytingar á hreyfingu að gerast bara þegar dýr er nokkuð veginn á "grindarlinu" en sú aðverð er ekki notuð t.d. þegar kindur er að hlaupa frá úlf eða úlfur er að elta kind.
  - Núverandi valmynd leyfir stillingar sem eru frekar erfiðar í vinnslu. Sumt að þessu ætti kannski ekki að vera hámarkað á sömu tíma.
