---
title: "GlassML: glass-box ML testbench"
slug: glassml
order: 5
year: "2026"
status: Working prototype
summary: A self-hosted web app to profile data, build models as graphs and run supervised, deep and RL experiments with live diagnostics.
result: Self-hosted platform to profile data, build models visually and run supervised, deep and RL experiments with live diagnostics.
role: Design and development
tools: [Next.js, FastAPI, PyTorch, scikit-learn, Stable-Baselines3]
question: How can a researcher see what a dataset and a model are doing during an experiment without writing glue code each time?
contribution:
  - "Data Lab: upload a dataset and get an automatic column profile and diagnostics."
  - "Forge: design models as graphs, including stacked and hybrid models."
  - "Testbench: training runs with live metrics, plain-language diagnostics and run comparison. An assistant drafts a plan, and nothing runs until you approve it."
findings: []
limitation: A working prototype. The demo and screenshots come from a test install with small sample datasets.
youtube: ""
thumbnail: ../../assets/projects/glassml/glassml-run.png
thumbnailAlt: GlassML run view with training curves and automatic diagnostics.
poster: ../../assets/projects/glassml/thumb.jpg
figures:
  - src: ../../assets/projects/glassml/glassml-data.png
    kind: result
    plate: false
    caption: GlassML dataset upload and automatic column profile.
  - src: ../../assets/projects/glassml/glassml-run.png
    kind: result
    plate: false
    caption: GlassML run view with training curves and automatic diagnostics.
  - src: ../../assets/projects/glassml/glassml-compare.png
    kind: result
    plate: false
    caption: GlassML run comparison with metrics and setting differences.
links: {}
---

The front end is Next.js and the back end is FastAPI, with PyTorch, scikit-learn and Stable-Baselines3 behind
the training jobs. Everything runs on your own machine or server.
