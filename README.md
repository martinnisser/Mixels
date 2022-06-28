# Mixels
code for running magnetic pixel printer and scanner

needed libraries:
<ul>
  <li>pickle</li>
  <li>numpy</li>
  <li>matplotlib</li>
  <li>tkinter</li>
  <li>system</li>
  <li>serial</li>
  <li>pandas</li>
  <li>qrcode</li>
  <li>PIL</li>
  <li>cv2</li>
</ul>

movement.py

contains the movement class with funtions for priniting and scanning.

file currently runs a program called run_sensor which allows for all functionality

rememeber to change the filename in the run_sensor program

sensor and printer coms are set up in the init. change these values to the coms used for your device

after pressing run: enter p for plotting mode and s for scanning mode.

in plot mode, the program will read form a pkl file and ask for a number input denoting which matrix in the file to print

example matrixies not form a file are also provided in the comments

in scan mode the prohram will display an image and heat map produced form the scan. the boundry values for the scan can be changed int the progrma
make_img. this progamr also produces pkl files containg the scanned matrix. the filenames can be changed there


total_sensor.ino

arduino code coresponding to movement.py
© 2022 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact GitH
