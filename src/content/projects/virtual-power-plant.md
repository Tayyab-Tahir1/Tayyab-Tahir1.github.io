---
title: Virtual power plant control with deep RL
slug: virtual-power-plant
order: 4
year: 2025-2026
status: Simulation study
summary: One soft actor-critic agent runs energy arbitrage and frequency reserve for PV, wind, a battery and a workplace EV fleet behind one grid connection.
result: "Year-long simulation: SAC earned **71% more net value** than rule-based control, with no EV charge violations. Single seed."
role: Simulator, agent training and evaluation
tools: [Python, PyTorch, Soft actor-critic, OMIE market data, SLURM]
question: Can one RL agent trade energy and deliver frequency reserve for a mixed plant, and still charge every car before it leaves?
contribution:
  - "A simulated plant: PV 800 kW, wind 1.2 MW, battery 500 kW / 1 MWh and a workplace EV fleet of 180 kW / 280 kWh behind one grid connection, on Spanish 2025 OMIE day-ahead prices at 15-minute steps."
  - A soft actor-critic agent that sets battery power, EV charging and PV and wind curtailment, compared with a rule-based baseline.
  - A year-long evaluation and a held-out week with frequency containment reserve (FCR) requests.
findings:
  - Over the simulated year (in-sample prices), SAC ended with 71% more net value than the rule-based baseline and cut EV departure-charge violations from 3,294 to 0.
  - "In the held-out reserve week, SAC delivered more of the requested FCR power than the baseline (0.94 vs 0.73) but ended with EUR 219 less net value."
limitation: This is a single-seed simulation, and the year-long result uses in-sample prices. In the held-out week the agent traded net value for better reserve delivery. More seeds and out-of-sample years are needed before drawing firm conclusions.
youtube: ""
thumbnail: ../../assets/projects/virtual-power-plant/thumb.jpg
thumbnailAlt: Winter week of the simulated virtual power plant, SAC agent and rule-based baseline side by side.
poster: ../../assets/projects/virtual-power-plant/thumb.jpg
figures:
  - src: ../../assets/projects/virtual-power-plant/vpp-control-loop.png
    kind: method
    caption: Simulated virtual power plant controlled by a soft actor-critic agent.
  - src: ../../assets/projects/virtual-power-plant/vpp-cumulative-value.png
    kind: result
    caption: "Simulated cumulative net value over 2025: SAC agent versus rule-based baseline, single seed."
  - src: ../../assets/projects/virtual-power-plant/vpp-fcr-delivery.png
    kind: result
    caption: Simulated FCR request and delivery on 15 July 2025, the test day on which the rule-based baseline falls shortest.
links: {}
---

The agent receives OMIE day-ahead prices, a weather forecast and the FCR frequency signal. Its state includes
battery state of charge, EV energy and departure times, grid limits and FCR activation. Its four actions set
battery power, EV charging power, and PV and wind curtailment.

Both controllers run the same plant on the same prices. The comparison counts net value, the share of requested
reserve power delivered, and EV departure-charge violations.
