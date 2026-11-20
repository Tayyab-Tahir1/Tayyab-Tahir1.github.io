---
title: Grid-following vs grid-forming converters in weak grids
slug: gfm-gfl-weak-grid
order: 2
tier: main
year: 2025-2026
status: Simulation study, open source
summary: An open-source EMT-type average model of a grid-connected converter that compares a PLL-based grid-following controller with a grid-forming virtual synchronous machine (VSM) as the grid gets weaker.
result: "Simulated SCR sweep: grid-following settles down to **SCR 3.1** with a 60 Hz PLL (1.9 with 20 Hz); the grid-forming VSM holds to **SCR 1.2**. Eigenvalue and time-domain boundaries agree within 0.1 SCR."
role: Built by me (model, controllers, analysis and explorer)
tools: [Python, NumPy/SciPy, EMT-type average model, Eigenvalue analysis, Grid-forming, Grid-following, PLL, VSM, Fault ride-through, Weak grids]
question: How weak can the grid get before a grid-following converter stops settling, how much further does a grid-forming VSM go, and how do the two handle a voltage dip and a frequency step?
contribution:
  - An EMT-type average-value model of a grid-connected converter with an LC filter and a Thevenin grid (X/R 10), written in Python with NumPy and SciPy.
  - "Two controllers on the same model: grid-following with an SRF-PLL, dq current control and k = 2 reactive-current injection during dips; and a grid-forming virtual synchronous machine with P–f and Q–V droop, virtual inertia H = 2 s and current limiting."
  - Small-signal analysis from the eigenvalues of a numerical Jacobian, cross-checked against time-domain simulation, and an interactive browser explorer of the results.
findings:
  - "SCR sweep from 10 down to 1: grid-following settles down to SCR 3.1 with a 60 Hz PLL, 2.3 with 40 Hz and 1.9 with 20 Hz. The VSM holds to SCR 1.2. The eigenvalue stability boundaries match the time-domain sweep within 0.1 SCR."
  - "Fault ride-through, a dip to 0.2 pu for 150 ms at SCR 3: grid-following stays synchronised, and its power recovers to within 5% in 60 ms after the fault clears. The VSM slips a pole unless a supervisory swing hold is active; with the hold it recovers in 232 ms."
  - "Grid frequency step of −0.2 Hz at SCR 2.5: the VSM delivers 0.2 pu of extra power and reaches 90% of it in 65 ms (t90). Grid-following with an added frequency droop takes 377 ms, and plain grid-following gives no response."
limitation: This is an average model, so switching harmonics are not represented. The grid is a stiff Thevenin source with imposed frequency, so the study covers weak grids but not a low-inertia grid. There is no external validation against PSCAD; the cross-checks are internal, such as eigenvalues against time-domain simulation.
cover: ../../assets/projects/gfm-gfl-weak-grid/cover.jpg
coverAlt: "Illustration of a solar farm and battery storage feeding grid-following and grid-forming converters and a step-up transformer, connected by a long line to a distant substation."
coverCaption: "Illustration of the setting: converter-based plants on a long line into a weak grid. The study itself is a single-converter model on a Thevenin grid."
thumbnail: ../../assets/projects/gfm-gfl-weak-grid/thumb.jpg
thumbnailAlt: Illustration of a solar and battery plant with grid-following and grid-forming converters connected to a distant weak grid.
figures:
  - src: ../../assets/projects/gfm-gfl-weak-grid/gfm-gfl-system.png
    kind: method
    caption: Converter average model with an LC filter on a Thevenin grid (X/R 10), run by either the grid-following or the grid-forming controller.
  - src: ../../assets/projects/gfm-gfl-weak-grid/gfm-gfl-stability-map.png
    kind: result
    caption: Time-domain outcome of the SCR sweep for grid-following with 20, 40 and 60 Hz PLLs and for the grid-forming VSM. Diamonds mark the critical SCR from the eigenvalue analysis.
links:
  code: https://github.com/Tayyab-Tahir1/gfm-gfl-weak-grid
  other:
    - label: Interactive explorer
      url: https://tayyab-tahir1.github.io/gfm-gfl-weak-grid/
---

The converter's switching is replaced by its average output voltage, while the filter and the grid keep their
electromagnetic states. The grid is a Thevenin source whose impedance sets the short-circuit ratio (SCR): the
lower the SCR, the weaker the grid.

The grid-following controller tracks the grid angle with a PLL and controls its current. The grid-forming VSM
sets its own voltage and angle through a swing equation with droop and virtual inertia. For each controller and
SCR, the model is linearised around its operating point with a numerical Jacobian, and the eigenvalues give the
small-signal boundary. Time-domain runs at the same SCR values check that boundary. The browser explorer shows
the precomputed results: eigenvalues and time traces for a chosen SCR, PLL bandwidth, VSM setting or fault.

The study extends converter-control modelling I started as a research assistant at NTNU in 2025. The
open-source code was written in 2026.
