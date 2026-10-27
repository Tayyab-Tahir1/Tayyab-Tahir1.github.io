---
title: "GCAST: uncertainty-aware wheel-slip estimation"
slug: gcast
order: 2
year: 2025 to present
status: In progress, paper in preparation
summary: A transformer that estimates rover wheel slip from multi-rate IMU and wheel-odometry streams and gives each estimate a prediction interval.
result: Each slip estimate comes with a prediction interval, checked for coverage on three public rover datasets. Paper in preparation.
role: Lead developer, TalTech Centre for Biorobotics (Horizon Europe project)
tools: [PyTorch, Transformers, MC-Dropout, Quantile gradient boosting, Gaussian processes, ROS 2]
question: How much is a rover's wheel slipping right now, and how far can that estimate be trusted when sensors run at different rates, labels are scarce and channels drop out?
contribution:
  - Lead developer of GCAST, which reads IMU and wheel-odometry events directly, one token per wheel event, without resampling the streams to a common rate.
  - Prediction intervals from a heteroscedastic Gaussian head with MC-Dropout, evaluated for coverage and compared with gradient-boosting quantile regression and Gaussian processes.
  - Tests under scarce labels and sensor dropout on three public rover datasets (BASEPROD, Katwijk, Pathfinder), plus a terrain-classification branch compared with published CNN and Mamba baselines on BorealTC.
findings:
  - Working on the raw event streams means no sensor has to be interpolated onto another sensor's clock.
  - Every estimate has its own interval, so a controller can tell a confident estimate from an uncertain one.
  - Numerical results will appear with the paper, in preparation for Engineering Applications of Artificial Intelligence.
limitation: So far the evaluation is offline, on public datasets. Results are held back until the paper is submitted.
youtube: ""
thumbnail: ../../assets/projects/gcast/rover-thumb.png
thumbnailAlt: Exploded rover illustration with IMU and wheel-encoder signals feeding a slip estimator with an uncertainty interval.
poster: ../../assets/projects/gcast/thumb.jpg
figures:
  - src: ../../assets/projects/gcast/gcast-architecture.png
    kind: method
    caption: GCAST event-based slip estimator with an uncertainty-aware Gaussian head.
links: {}
---

Each wheel event becomes one token with a cumulative-time encoding. A gated layer and causal context windows
feed a sparse attention block, and attention pooling produces the features for a Gaussian output head. MC-Dropout
at inference adds model uncertainty to the predicted variance, which gives the prediction interval.

On the project rovers, ROS 2 skid-steer kinematics and odometry are in place, and a deep-RL traction and
locomotion controller is in progress.
