# Mixels
<h2>code for running magnetic pixel printer and scanner</h2>
<p> This is the code used for the magnetic pixels research done in MIT CSAIL HCI Labs. The project uses reprogrammable magnetic material, and prints magentic patterns on the material using the snapmaker as a 3D movement device and an adruino to control various sensors and electromagent componants.</p>

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

<p>This file contains the MovementController class which contains the funtions for printing and scanning magentic patterns.</p>

<ol>
The file currently runs a program called run_sensor which allows for all functionality of both priniting and scanning. before running this program it is important to make not of certain varioable which will need to be changed to suit the setup of the user.
<li>Sensor and Printer coms are set up in the init. Before running the program, change these values to the coms used for your device. remeber that the sensor com is for the conecction to the aruduino and the printer com is for the coneection to the 3d printer used for movement.</li>

rememeber to change the filename in the run_sensor program
</ol>



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
