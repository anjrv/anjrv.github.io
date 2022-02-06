---
geometry: margin=20mm
urlcolor: blue
header-includes: |
    \usepackage{fancyhdr}
    \pagestyle{fancy}
    \lhead{Jaan Jaerving}
    \chead{}
    \rhead{TÖL203M, Heimadæmi 3}
...

## 1. Við höfum 2-víða vigurinn w sem eru táknaður við grunnvigrana v1 = [2, 1] og v2 = [-1, 2]. Táknun w við grunnvigrana tvo er a = [3, 1].  Hver væri táknun w við grunnvigrana [1, 0] og [0, 1]?


\pagebreak

## 2. Sýnið (með því að margfalda upp úr vörpunarfylkjunum) hvort eftirfarandi tvívíðar varpanir eru víxlnar (commutative):

* a. Tveir snúningar, þ.e. er $R(\theta) \cdot R(\phi) = R(\phi) \cdot R(\theta)$?
* b. Tvær hliðranir, þ.e. er $T(a,b) \cdot T(c,d) = T(c,d) \cdot T(a,b)$?
* c. Sńuningur og jöfn kvörðun, þ.e. er $R(\theta) \cdot S(a,a) = S(a,a) \cdot R(\theta)$?

\pagebreak

## 3. Hér fyrir neðan er tvívítt vörpunarfylki í jafnþættum (homogeneous) hnitum:

$$
\begin{bmatrix}
0 & 1 & 0 \\
1 & 0 & 0 \\
0 & 0 & 1
\end{bmatrix}
$$

* a. Útskýrið í orðum hvað vörpunin gerir, þ.e. hvaða áhrif hún hefur á tvívíðan hlut sem er varpað með henni
* b. Táknið vörpunina að ofan sem samsetningu grunnvarpana, þ.e. hliðrun (translate), kvörðun (scaling) og snúning (rotation).


\pagebreak

## 4. [Próf 2021]  Eftir mikið partí er húsið okkar alveg á hvolfi (rautt).  Færið húsið í upphaflega stöðu (blátt) með samsettri tvívíðri vörpun.  Sýnið einstök skref og rökstyðjið þau.

![Partí](q4.png)


\pagebreak

## 5. Breytið sýnisforritinu [box-bounce](https://hjalmtyr.github.io/WebGL-forrit/Angel/box-bounce.html) þannig að vinstri og hægri örvalyklarnir breyta stefnu "boltans" til vinstri og hægri.  Ef slegið er á vinstri örvalykil þá fer hann að færast aðeins meira til vinstri (lækka dX).  Sambærilegt gildir ef slegið er á hægri örvalykil.  Breytið svo virkni upp og niður örvalyklanna þannig að upp-örin stækkar boltann, en niður-örin minnkar hann (boxRad).
