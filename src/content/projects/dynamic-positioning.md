---
title: Dynamic positioning of a supply vessel
slug: dynamic-positioning
order: 7
tier: main
year: "2024"
status: Completed, team project
summary: A dynamic-positioning system for an offshore supply vessel in MATLAB and Simulink, holding position and following a path under wind, waves and current.
result: "4-corner test in calm sea: median position error **0.3 m**, 95% of the time within 1 m. With two thrusters lost the vessel still completed the box."
role: Team member, NTNU course TMR4240 Marine Control Systems (team of four)
tools: [MATLAB, Simulink, MSS toolbox]
question: How well can a vessel hold its position and follow a path when wind, waves and current push it, and when thrusters fail?
contribution:
  - PID and LQG dynamic-positioning controllers.
  - Wave and wind disturbance simulation for testing the controllers.
findings:
  - "4-corner test (50 m box): median distance from the path 0.3 m in calm sea (95% within 1 m), 3.5 m with wind, waves and current (95% within 10 m), and 5.5 m with two thrusters lost (95% within 14 m)."
  - "Capability plot for wind 12 m/s, current 0.2 m/s and 4 m waves: average thrust use 53%, peaking at 87% when the environment comes from about 76°."
limitation: Simulation only, at course scale. The 4-corner tracks were read off the figures in the report, because the saved MATLAB data needs MATLAB to open.
cover: ../../assets/projects/dynamic-positioning/cover.jpg
coverAlt: "Illustration of an offshore supply vessel holding position next to a wind-turbine foundation, with its hull, azimuth thrusters and bow thruster visible below the waterline."
youtube: ""
figures:
  - src: ../../assets/projects/dynamic-positioning/dynamic-positioning-loop.png
    kind: method
    caption: "DP loop: reference model, LQG controller, thrust allocation and passive observer, with wind, waves and current acting on the vessel."
  - src: ../../assets/projects/dynamic-positioning/dp-four-corner.png
    kind: result
    caption: 4-corner test in three conditions, on the same scale. Redrawn; tracks read off the MATLAB figures in the report.
  - src: ../../assets/projects/dynamic-positioning/dp-capability.png
    kind: result
    size: narrow
    caption: Average thrust use for each environment direction (wind 12 m/s, current 0.2 m/s, significant wave height 4 m).
  - src: ../../assets/projects/dynamic-positioning/dp-thruster-angles.png
    kind: result
    size: narrow
    caption: Thruster azimuth angles during a dynamic-positioning simulation.
links:
  code: https://github.com/Tayyab-Tahir1/Design-of-Dynamic-Positioning-System---Marine-Control
---

The vessel model was built in Simulink with the MSS toolbox. A nonlinear passive observer (compared with an
extended Kalman filter) estimates position and velocity from noisy measurements, the controller computes the
forces needed to stay on the reference, and thrust allocation splits them over the thrusters, including when
some of them fail.
