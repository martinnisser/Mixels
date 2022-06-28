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

The file currently runs a program called run_sensor which allows for all functionality of both priniting and scanning. before running this program it is important to make note of certain variables which will need to be changed to suit the setup of the user.
<ol>
<li>Sensor and Printer coms are set up in the init. Before running the program, change these values to the coms used for your device. remeber that the sensor com is for the conecction to the aruduino and the printer com is for the coneection to the 3d printer used for movement.</li>

<li>Inside the run_sensor program, a flmename is needed for the array wich are to be plotted onto the magentic material. this file can be downloaded form th emixels webpage. Before runing the program, rememeber to change the filename in the run_sensor program to the name and locaiton of the proper file.</li>
  
<li> In the init, the variables mag_height and hall_height should be changed based on the callibration of the device. if the material is elevated, the value will have to be recallibrated to account for the new distance. mag_height is for printing patterns and hall_height is for scanning. Before running the program, callibrate and change the heights.</li>
</ol>

When all of these changes have been mage nd the program is probaly set up and calibrated. the program can be run. Beow are the instructions for the commands that need to be inputed to the terminal after running the program.
<ol>
  <li> after pressing run: enter p for plotting mode and s for scanning mode.</li>
  <li>
    <ol>
      <li>in plot mode, the program will read the array of martices from a pkl file and ask for a number input denoting which matrix in the file to print
      example matrices not from a file are also provided in the comments</li>
      <li>in scan mode the program will display an image and heat map produced form the scan. the boundry values for the scan can be changed init the program make_img. this program also produces pkl files containg the scanned matrix. the filenames can be changed there </li>
    </ol>

  </li>


<h3>mixel_arduino.ino</h3>

This file contains the arduino code coresponding to mixels_terminal.py no values need to be changed in this code.

© 2022 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact GitH
