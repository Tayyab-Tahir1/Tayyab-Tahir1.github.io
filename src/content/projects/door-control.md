---
title: "Automated door control: face-mask and temperature check"
slug: door-control
order: 8
tier: main
year: 2021-2022
status: Built and installed
summary: A door that opens only for a person wearing a face mask with a normal body temperature, built for the entrance of an industrial production hall.
result: "CNN mask check at **98.6%** accuracy and an infrared temperature reading **97.6%** accurate after calibration; the door opens only when both checks pass."
role: Designed and built the whole system
tools: [Python, OpenCV, Keras, MobileNetV2, Arduino Mega 2560]
question: Can a camera and a few low-cost sensors check face masks and body temperature at a factory entrance without a guard?
contribution:
  - Trained the MobileNetV2 face-mask classifier and wrote the OpenCV face-detection and decision code that runs on a PC.
  - Designed the electronics around an Arduino Mega 2560, with an infrared temperature sensor, an ultrasonic distance sensor and a stepper motor that slides the door on a threaded rod.
  - Wrote the Arduino firmware and the serial link between the PC and the Arduino.
  - Built the demonstration door and calibrated the temperature sensor before the system went into the production hall.
findings:
  - "The door opens only when three checks pass: mask probability above 98%, body temperature below 100 °F (37.8 °C), and the person standing within range of the ultrasonic sensor."
  - The mask classifier reached 98.6% accuracy on the test images.
  - Calibration raised the accuracy of the infrared temperature reading from 96% to 97.6%.
limitation: The accuracy figures come from the test set and the calibration runs before installation. I have no logged results from the production hall itself.
cover: ../../assets/projects/door-control/cover.jpg
coverAlt: "Illustration of a production-hall entrance: a masked worker stands on a scan ring at a kiosk with a camera and infrared thermometer, next to a sliding gate driven by a threaded rod."
youtube: ""
figures:
  - src: ../../assets/projects/door-control/door-control-system.png
    kind: method
    caption: A CNN mask check on the PC and infrared temperature and distance checks on an Arduino decide whether the stepper motor opens the door.
  - src: ../../assets/projects/door-control/door-photos.jpg
    kind: result
    caption: "Left: the demonstration door, built before the system was installed in the production hall. Right: the control board with the Arduino, stepper driver and ultrasonic sensor."
  - src: ../../assets/projects/door-control/door-training-curve.png
    kind: result
    caption: Mask classifier training over 20 epochs. Redrawn from the original Keras plot, as no training log was kept.
links:
  code: https://github.com/Tayyab-Tahir1/Automated-Door-Control-Using-CNN-based-Face-Mask-and-Temperature-Detection
---

A camera on the PC finds the face and the MobileNetV2 classifier gives a mask probability. At the same time the
Arduino reads the infrared temperature and the ultrasonic distance. When all three checks pass, the PC sends an
open command over serial and the stepper motor turns a threaded rod that slides the door open; otherwise the
door stays shut and the status light shows why.
