---
title: Lane-following robot car
slug: lane-detection
order: 9
tier: main
year: 2020-2021
status: Completed, published at IEEE ICIT 2022
summary: A small robot car that follows a road with one camera on a Raspberry Pi and watches for obstacles with ultrasonic sensors.
result: "Camera-only lane following on a Raspberry Pi: a curve value from the lane image sets the motor speed on the inside of the turn. Published at IEEE ICIT 2022."
role: Built the lane and edge detection algorithm (team project, second author of the paper)
tools: [Python, OpenCV, Raspberry Pi, Arduino]
question: Can a low-cost car follow a road using only a camera and a Raspberry Pi?
contribution:
  - "Built the lane and edge detection algorithm: Gaussian blur and threshold, a warp to a bird's-eye view from four region-of-interest points, and a histogram filter that finds the lane centre."
  - The pixel-summation step that turns the balance of road pixels on the left and right into a curve value in percent.
findings:
  - "The inner motors slow down by the curve value: duty = 60 - |curve| on the inside of the turn, the full 60 on the outside."
  - Three fixed ultrasonic sensors and one on a servo (a 180° sweep with a 40 cm range) detect obstacles.
limitation: Tested indoors at low speed on a test road; the paper reports the curve values and motor commands, not a measured tracking error.
cover: ../../assets/projects/lane-detection/cover.jpg
coverAlt: "Illustration of a small robot car driving along a grey test road, with glowing lines along both road edges ahead of its front camera and ultrasonic sensors."
youtube: ""
figures:
  - src: ../../assets/projects/lane-detection/lane-detection-system.png
    kind: method
    caption: Camera frames become a curve value on the Raspberry Pi, which sets the motor speeds; ultrasonic sensors watch for obstacles.
  - src: ../../assets/projects/lane-detection/lane-pipeline.png
    kind: method
    caption: The lane pipeline on the test road, step by step (screenshots from the paper).
  - src: ../../assets/projects/lane-detection/lane-pwm.png
    kind: result
    caption: Curve value and motor duty over 14 test steps. Redrawn; values read off the chart in the paper (Fig. 10).
  - src: ../../assets/projects/lane-detection/lane-hardware-pair.jpg
    kind: result
    size: narrow
    caption: "The robot car from the side and the front: Raspberry Pi, two Arduinos, Pi camera, ultrasonic sensors and the servo-mounted sensor on top."
links:
  paper: https://doi.org/10.1109/ICIT56493.2022.9989134
---

The Pi camera feeds frames to OpenCV on the Raspberry Pi. Each frame is blurred and thresholded so the road
stands out, warped to a bird's-eye view, and filtered by a histogram to find the lane centre. Comparing the
road pixels on the left and right gives a curve value, and the motor driver slows the wheels on the inside of
the turn by that amount.
