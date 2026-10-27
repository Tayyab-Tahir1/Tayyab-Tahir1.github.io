---
title: "Marine robotics: BlueROV servoing and dynamic positioning"
slug: marine-robotics
order: 6
tier: compact
year: 2024-2025
status: Completed, team projects
summary: Two MSc team projects in marine control, a BlueROV that tracks a buoy by vision and a dynamic-positioning controller for a vessel.
result: "Team projects. My part: OpenCV buoy detection and a visual-servo control law tested in a tank; PID and LQG dynamic positioning with wave and wind simulation."
role: Team member (my part is listed below)
tools: [ROS, OpenCV, MATLAB, Simulink]
question: How do you keep an underwater robot locked on a target it can see, and hold a vessel in place against waves and wind?
contribution:
  - OpenCV buoy detection (HSV thresholding and a contour mask) for a BlueROV.
  - The visual-servo control law that turns the tracking error into velocity commands, tested in a tank.
  - PID and LQG dynamic-positioning controllers with wave and wind disturbance simulation.
findings: []
limitation: These were team projects at course scale. The dynamic-positioning work stayed in simulation.
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
  - src: ../../assets/projects/marine-robotics/marine-dp-thruster-angles.png
    kind: result
    caption: Thruster azimuth angles during a dynamic-positioning simulation.
links:
  code: https://github.com/Tayyab-Tahir1/Visual-Servoing-for-BlueROV-Autonomous-Buoy-Tracking
  other:
    - label: Dynamic positioning code
      url: https://github.com/Tayyab-Tahir1/Design-of-Dynamic-Positioning-System---Marine-Control
---

The servoing loop runs on ROS: the camera image is converted to HSV, thresholded and cleaned with a contour
mask, and the buoy's centre is compared with a desired point in the image. The control law maps that error to
velocity commands for the robot.

The dynamic-positioning model was built in MATLAB and Simulink, with thruster allocation and simulated wave
and wind loads.
