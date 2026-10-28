---
title: "BlueROV visual servoing: autonomous buoy tracking"
slug: marine-robotics
order: 6
tier: main
year: 2024-2025
status: Completed, team project
summary: An NTNU team project in which a BlueROV finds a buoy with its camera and keeps it centred using a visual-servo control law.
result: "Team project. My part: OpenCV buoy detection and the visual-servo control law, tested with a BlueROV in a tank."
role: Team member (my part is listed below)
tools: [ROS, OpenCV, Python]
question: How do you keep an underwater robot locked on a target it can only see through its camera?
contribution:
  - OpenCV buoy detection (HSV thresholding and a contour mask) for a BlueROV.
  - The visual-servo control law that turns the tracking error into velocity commands, tested in a tank.
findings: []
limitation: A team project at course scale, tested in a tank rather than open water.
cover: ../../assets/projects/marine-robotics/cover.jpg
coverAlt: "Illustration of an underwater ROV tracking an orange buoy below a supply vessel."
youtube: ""
thumbnail: ../../assets/projects/marine-robotics/thumb.jpg
thumbnailAlt: Underwater camera view of a red buoy in a test tank, with the tracked point marked.
figures:
  - src: ../../assets/projects/marine-robotics/marine-rov-buoy-tracking.png
    kind: method
    caption: "BlueROV buoy detection: tracked point, HSV image and contour mask."
  - src: ../../assets/projects/marine-robotics/marine-rov-servoing-results.png
    kind: result
    caption: Visual-servoing error and velocity commands converging during buoy tracking.
links:
  code: https://github.com/Tayyab-Tahir1/Visual-Servoing-for-BlueROV-Autonomous-Buoy-Tracking
---

The servoing loop runs on ROS: the camera image is converted to HSV, thresholded and cleaned with a contour
mask, and the buoy's centre is compared with a desired point in the image. The control law maps that error to
velocity commands for the robot.

The dynamic-positioning work from the same MSc year has its own page:
[Dynamic positioning of a supply vessel](/projects/dynamic-positioning/).
