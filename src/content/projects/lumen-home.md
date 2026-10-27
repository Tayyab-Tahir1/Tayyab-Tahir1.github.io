---
title: "Lumen Home: home energy digital twin"
slug: lumen-home
order: 3
year: "2026"
status: Working prototype
summary: A household energy app and simulator for a home with solar, a battery, an EV and a heat pump, with a 36-hour plan it can explain.
result: "Tallinn simulation: **35% lower annual bill** than the same house on default rules; blackout autonomy from 2.3 to 19.3 hours with load shedding."
role: Built by me (simulation engine, planner and app)
tools: [TypeScript, Dynamic programming, PVGIS, Nord Pool prices, WebSockets]
question: What should a home with solar, a battery, an EV and a heat pump do over the next 36 hours, and can the app explain that plan to the people who live there?
contribution:
  - A simulator of the home with PV, battery, EV with vehicle-to-home, a heat pump with an RC thermal model, tiered appliances, and island mode with load shedding.
  - A 36-hour dynamic programme over battery and EV, run on median (P50) forecasts of solar, load and price.
  - A web app with live power flows, plan, bill, backup and device pages, and a phone layout.
findings:
  - "Tallinn simulation: 35% lower annual bill than the same house running on default rules."
  - With load shedding, the time the house can run through a blackout rose from 2.3 to 19.3 hours in simulation.
limitation: These are simulation results for one Tallinn household, with default rules as the baseline. The planner optimises the median forecast; the P10 to P90 bands are only displayed and do not enter the optimisation. The household in the screenshots is a demo scenario.
youtube: "https://youtu.be/jy0j2Rhqj0M"
thumbnail: ../../assets/projects/lumen-home/lumen-home-day.png
thumbnailAlt: Lumen Home dashboard with live household power flows and a 24-hour forecast.
poster: ../../assets/projects/lumen-home/thumb.jpg
figures:
  - src: ../../assets/projects/lumen-home/lumen-home-twin.png
    kind: method
    caption: Lumen Home digital twin with a 36-hour battery and EV planner.
  - src: ../../assets/projects/lumen-home/lumen-software-architecture.png
    kind: method
    caption: "Lumen Home software architecture: simulation engine, WebSocket hub and clients."
  - src: ../../assets/projects/lumen-home/lumen-home-day.png
    kind: result
    plate: false
    caption: "Lumen Home dashboard: live household power flows and 24-hour forecast."
  - src: ../../assets/projects/lumen-home/lumen-plan.png
    kind: result
    plate: false
    caption: Lumen 36-hour forecast and battery and EV plan.
  - src: ../../assets/projects/lumen-home/lumen-island.png
    kind: result
    plate: false
    caption: Lumen Home running in island mode during a grid outage.
links: {}
---

The engine steps the home model forward with PVGIS solar data and Nord Pool prices. Every planning cycle the
dynamic programme searches battery and EV schedules over the next 36 hours and picks the cheapest one.

The app shows the plan in plain language: what the battery and car will do, why, and what happens if the grid
goes down. A storm warning makes the planner pre-charge the battery before the outage.
