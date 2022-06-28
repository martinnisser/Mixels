# Mixels
<h2>code for running magnetic pixel printer and scanner</h2>

<h3>needed libraries:</h3>
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

<h3>mixels_terminal.py</h3>

This file contains the movement class with funtions for printing and scanning.

file currently runs a program called run_sensor which allows for all functionality

rememeber to change the filename in the run_sensor program

sensor and printer coms are set up in the init. change these values to the coms used for your device

after pressing run: enter p for plotting mode and s for scanning mode.

in plot mode, the program will read form a pkl file and ask for a number input denoting which matrix in the file to print

example matrices not from a file are also provided in the comments

in scan mode the program will display an image and heat map produced form the scan. the boundry values for the scan can be changed int the progrma
make_img. this progamr also produces pkl files containg the scanned matrix. the filenames can be changed there


<h3>total_sensor.ino</h3>

arduino code coresponding to movement.py
© 2022 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact GitH
