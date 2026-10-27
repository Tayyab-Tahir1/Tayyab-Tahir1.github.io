---
title: Smart port energy system
slug: port-energy
order: 1
tier: main
year: "2025"
status: Completed, MSc thesis
summary: Energy management for a port microgrid with battery and hydrogen storage, comparing deep RL, MPC and an LSTM that imitates MPC.
result: "Oslo simulation: MPC-LSTM cut the electricity bill by **38.9%** and CO2 by **45.8%** against a non-optimised base case."
role: MSc thesis researcher, NTNU Department of Marine Technology
tools: [Python, Gymnasium, DQN, PPO, MPC (CVXPY), LSTM]
question: Can a learned controller run a port microgrid with hydrogen storage almost as well as MPC, at a fraction of the computing cost?
contribution:
  - Built a Gymnasium environment of a port microgrid (PV, 5.5 MWh battery, electrolyser, hydrogen storage, fuel cell, grid connection) on hourly 2023 data.
  - Benchmarked DQN, PPO, MPC in CVXPY and an LSTM trained to imitate MPC.
  - Ran the trained policy at three other ports without retraining to see where it breaks.
findings:
  - "Compared with MPC itself: the LSTM imitation policy stayed within 2% of MPC's cost, with about 250 times faster inference (LSTM forward pass on a CPU vs solving the MPC optimisation at each step)."
  - "Compared with the non-optimised base case: in the Oslo simulation, MPC-LSTM cut the electricity bill by 38.9% and CO2 by 45.8%."
  - At the other ports (Copenhagen, Amsterdam, Nice) the same policy saturated hydrogen storage and raised emissions where carbon intensity was missing from the state.
limitation: All results come from simulation on one year of hourly data. The transfer test shows that the policy does not carry over to other ports without retraining, and that carbon intensity has to be part of the state.
cover: ../../assets/projects/port-energy/cover.jpg
coverAlt: "Illustration of a container port with gantry cranes, container ships on shore power, solar roofs, battery and hydrogen storage."
youtube: "https://youtu.be/uY3F20XuRbY"
thumbnail: ../../assets/projects/port-energy/thumb.jpg
thumbnailAlt: Animated port energy system with hourly power flows, battery state of charge and controller actions.
poster: ../../assets/projects/port-energy/thumb.jpg
figures:
  - src: ../../assets/projects/port-energy/port-energy-system.png
    kind: method
    caption: Port microgrid with hydrogen storage and the compared energy-management controllers.
  - src: ../../assets/projects/port-energy/port-reductions.png
    kind: result
    caption: Bill and CO2 reductions of DQN, MPC and MPC-LSTM against non-optimised operation, Oslo simulation.
  - src: ../../assets/projects/port-energy/port-dispatch-week.png
    kind: result
    caption: Port microgrid dispatch over one summer week under the MPC-LSTM controller, Oslo simulation.
links:
  code: https://github.com/Tayyab-Tahir1/Modeling-and-Control-of-Smart-Integrated-Port-Energy-Systems-A-Data-Driven-Approach
---

The environment steps hour by hour through a year of port load, PV output and time-of-use tariffs. At each
step the controller chooses how to route power between the grid, the battery, the electrolyser, hydrogen
storage and the fuel cell.

MPC solves a short-horizon optimisation at every step with CVXPY. It works well but is slow to run online, so
I trained an LSTM on MPC's decisions (imitation learning) and compared it with DQN and PPO agents trained
directly on the environment. The baseline is the same port with no optimisation.
