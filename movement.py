# -*- coding: utf-8 -*-
"""
Created on Tue Mar 22 13:12:58 2022

@author: yimya
"""

import sys
import time
import serial
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import pickle
import qrcode
from PIL import Image
import cv2

'''
Coarse scan -> finer once positive result -> corners -> transform
With x,y can scan with magnet sensor
Left port is COM5, right is COM13
'''
def read_from_pickle(path):
    output = []
    with open(path, 'rb') as file:
        try:
            while True:
                output.append(pickle.load(file))
        except EOFError:
            pass
    return output


class MovementController:
    def __init__(self):
        # TODO: change these port values to the correct ones for your computer
        self.leftPort = 'COM3'
        self.rightPort = 'COM6'
        self.baudrate = 115200
        self.sensor = serial.Serial(port=self.rightPort, baudrate=self.baudrate)
        self.printer = serial.Serial(port=self.leftPort, baudrate=self.baudrate)
        self.max_x = 115
        self.max_y = 115
        
        self.step_coarse = 3
        self.mag_size = 3
        self.scan_size = 23

        # TODO: Alter these hights once the actual design is done so that nothing collides with the blocks because it WILL LIKELY BREAK SOMETHING
        self.tof_height = 47.5
        self.mag_height = 2#flat on base-plate: 2; cube in holder: 24; magnet on cube on holder27#31
        self.hall_height = 2#26.5#31.5
        self.mag_raise = 5#5#27#30
        self.dist_threshold = self.tof_height - 25

    
    
    def scan_try(self):
        '''
        This function scans a magnetized surface and returns the an image of the matetic pattern
        Params: None
        Output: (8x8) array of values
        '''
        # start by setting snapmaker to global/absolute positioning mode instead of incremental
        self.printer.write(("G90\n").encode())
        self.printer.readline()

        self.printer.write((f"G0 Z{self.hall_height}").encode())
        self.printer.write(("M400\n").encode())
        self.printer.readline()
        print('moved')


        # Iterating through the entire base plate with coarse step size
        a_s = self.scan_size
        data = np.zeros((a_s,a_s))
        for row in range(0, a_s):
            for col in range(0, a_s):
                x = 15+col*self.mag_size#24.5+col*self.mag_size
                y = 10+row*self.mag_size#83.5+row*self.mag_size
                # Move to the designated point on the base plate
                self.printer.write((f"G0 X{x} Y{y} F1000\n").encode())
                self.printer.write(("M400\n").encode())
                self.printer.readline()
                self.printer.readline()

                # Send command to the sensor which tells it to send back a reading from the Hall sensor
                self.sensor.write(("G").encode())
                mes = float(self.sensor.readline().decode())
                print(mes)
                if row % 2 == 0:
                    data[row][col] = mes
                else:
                    data[row][col] = mes
        return data
    
    def gcode_snap(self, m, offset, mag_size, invert=False, negate=False):
        '''
        main idea: takes a matrix of values and polts it onto a reprogrambale magnetic surface
        inputs: matrix m, callibration offset, plotting magnet size, inver or negate matrix
        output: none

        Parameters
        ----------
        m : numpy array
            contains matrix for printing
        offset : int
            offset starting point
        mag_size : int
            change size of plotting points
        invert : boolean, optional
            print the matching matrix. The default is False.
        negate : boolean, optional
            negate the matrix. The default is False.

        Returns
        -------
        None.

        '''
        y = 10#85#82
        #mat = np.array()
        s_x = 15#41
        if invert:
            start_x = 21 + s_x + offset
            mat = m*-1

        else:
            start_x = s_x + offset
            mat = m
            
        #print(1)
        x = start_x
        # start by setting snapmaker to global/absolute positioning mode instead of incremental
        self.printer.write(("G90\n").encode())
        self.printer.readline()
        
        self.printer.write(("G0 Z50 F1000\n").encode())
        self.printer.readline()
        #print(2)
        # Iterating through the entire base plate with coarse step size
        num_plots = 0
        for row in mat:
            self.printer.write(("G0 Y" + str(y) + " F3000\n").encode())
            self.printer.readline()
            #print(3)
            if y < self.max_y:
                for val in row:
                    num_plots+=1
                    if num_plots%200 == 0:
                        print('paused to prevent overheating. Press any key to continue:')
                        input()
                    if x< self.max_x:
                        if (val == 1):
                            # Move to the designated point on the surface
                            self.printer.write(("G0 X" + str(x) + " F3000\n").encode())
                            self.printer.write((f"G0 F280 Z{self.mag_height}\n").encode())
                            self.printer.write(("G4 P100\n").encode())
                            self.printer.readline()
                            self.printer.readline()
                            self.printer.readline()
                            # Send command to the sensor which tells it to plot north
                            self.sensor.write(('N').encode())
                            
                            check = self.sensor.readline()
                            print(check.decode())
                            self.printer.write((f"G0 F1000 Z{self.mag_raise}\n").encode())
                            self.printer.readline()
                        elif(val == -1):
                            # Move to the designated point on the surface
                            self.printer.write(("G0 X" + str(x) + " F3000\n").encode())
                            self.printer.write((f"G0 F280 Z{self.mag_height}\n").encode())
                            self.printer.write(("G4 P100\n").encode())
                            self.printer.readline()
                            self.printer.readline()
                            self.printer.readline()
                            # Send command to the sensor which tells it to plot south
                            self.sensor.write(('S').encode())
                            
                            check = self.sensor.readline()
                            print(check.decode())
                            self.printer.write((f"G0 F1000 Z{self.mag_raise}\n").encode())
                            self.printer.readline()
                        
                        if invert:
                            x -= mag_size
                        else:
                            x += mag_size
                    else:
                        print('matrix too large')
            y += mag_size
            x = start_x
        self.printer.write(("G0 Z50 F1000\n").encode())
        self.printer.write(('G0 X30 Y70 F1000\n').encode())
        
    def makeHeat(self, data, columns):
        df = pd.DataFrame(data, columns=columns)
        p1 = sns.heatmap(df)
        plt.show()
        
    def run_sensor(self):
        run_prog = input()
        self.sensor.write((run_prog).encode())
        #print mode run
        if (run_prog == 'p'):
            #load matrix from file
            path = 'matrix_12_1.pkl'
            arrays = read_from_pickle(path)
            y = np.shape(arrays)
            print(y)
            if len(y) > 3:
                print('choose array num:')
                choose_arr = input()
                m = arrays[0][int(choose_arr)]
            else:
                m = arrays[0]
            #Example matrixies: uncomment next line for qrcode print
            #m = self.plot_QRcode()
            '''
            #m = np.array([[1,-1,1,-1],[1,-1,1,-1]])#np.array([[1,-1,1,-1,1,-1],[1,-1,1,-1,1,-1],[1,-1,1,-1,1,-1],[1,-1,1,-1,1,-1],[1,-1,1,-1,1,-1],[1,-1,1,-1,1,-1]])
            #m = np.array([[1,-1,1,-1,1,-1,1,-1],[-1,1,-1,1,-1,1,-1,1],[1,-1,1,-1,1,-1,1,-1],[-1,1,-1,1,-1,1,-1,1],[1,-1,1,-1,1,-1,1,-1],[-1,1,-1,1,-1,1,-1,1],[1,-1,1,-1,1,-1,1,-1],[-1,1,-1,1,-1,1,-1,1]])
            #m = np.array([[1,0,1,0],[0,1,0,1]])
            #m = np.array([[0,-1,0,-1],[-1,0,-1,0]])'''
            self.gcode_snap(m, 0, self.mag_size)# set invert to true for matching matrix (8x8 only)#, True)
        #set up scan mode
        elif(run_prog == 's'):
            self.sensor.write((run_prog).encode())
            dat = self.scan_try()  #run scan
            columns = list(range(0, self.scan_size))
            self.makeHeat(dat,columns)  #make heatmap
            self.make_img(dat) #make image
            print(self.sensor.readline().decode())
        print('run completed')
        self.sensor.write(('x').encode())
        print(self.sensor.readline().decode())
        self.printer.close()
        self.sensor.close()
        
    def plot_QRcode(self):
        print('input string to encode')
        #self.sensor.write(('p').encode())
        QR_string = 'uist.acm.org'#input()
        
        qr = qrcode.QRCode(
                version=1,
                box_size=1,
                border=1)


        input_data = QR_string
        qr.add_data(input_data)
        qr.make(fit=True)
        img = qr.make_image(fill='black', back_color='white')


        data = np.asarray(img)
        y = np.shape(data)
        out = np.zeros(y)
        for i in range(y[0]):
            for j in range(y[1]):
                if data[i][j]:
                    out[i][j]=0#1
                else:
                    out[i][j] = -1
        return out
        #self.gcode_snap(out, 0, self.mag_size)
        
    def make_img(self, dat):
        a_s = self.scan_size
        out = np.zeros((a_s,a_s))
        for row in range(0, a_s):
            for col in range(0, a_s):
                if dat[row][col]>440:
                    out[row][col] = -1
                else:
                    out[row][col]= 1
        fileName = 'scanMat2.pkl'
        fileObject = open(fileName, 'wb')
        y = out.reshape(1,a_s,a_s)
        pickle.dump(y, fileObject)
        fileObject.close()
        fileName = 'rawMat2.pkl'
        fileObject = open(fileName, 'wb')
        y = dat.reshape(1,a_s,a_s)
        pickle.dump(y, fileObject)
        fileObject.close()
        fig, ((ax04)) = plt.subplots(1, 1)
        ax04.imshow(out,vmin=-1, vmax=1)
        plt.show()
        
    def static_sensor_movement(self, startX, startY, offsetX, offsetY, width, dim):
        '''
        This is the old movement code, which just moves in a set pattern over a set area.
        It doesn't adapt at all, so it's pretty useless but was the first trial at this movement stuff
        so I'm leaving it here as a relic :)
        '''
        z = 36
        startX = startX + offsetX
        startY = startY + offsetY
        x = startX

        lineWidth = int(float(width) / float(dim))

        # output = ['G28', "G90", "M104 S0", "M140 S0"]
        output = []

        output.append("G0 F10000 Z" + str(z))
        output.append("G0 X" + str(startX) + " Y" + str(startY-10))
        output.append("G4 P3500")
        for i in range(dim):
            if i % 2 == 1:
                output.append("G0 Y" + str(startY - 10))
            else:
                output.append("G0 Y" + str(startY + width + 10))
            x += lineWidth
            output.append("G4 P1000")
            output.append("G0 X" + str(x))
            output.append("G4 P1000")

        output.append("G0 Z45")
        output.append("G0 F5000 X0 Y0")
        output.append(";End of movement")

        return output


    def map_coarse(self):
        '''
        This function scans the surface of the base plate, and stops once it identifies the cube for the first time.
        Params: None
        Output: startX and startY which correspond to the coordinates of the first instance of sensing the cube
        '''
        # start by setting snapmaker to global/absolute positioning mode instead of incremental
        self.printer.write(("G90\n").encode()) 
        self.printer.readline()

        self.printer.write((f"G0 Z{self.tof_height}").encode())
        self.printer.write(("M400\n").encode())
        self.printer.readline()
        print('moved')
        #self.printer.readline()
        # on the arduino, if it recieves an input of "1" it should enter TOF mode where it only sends distance readings from the TOF sensor
        #self.sensor.write(("1\n").encode())


        # Iterating through the entire base plate with coarse step size
        for y in range(0, self.max_y, self.step_coarse):
            for x in range(0, self.max_x, self.step_coarse):
                # Move to the designated point on the base plate
                self.printer.write((f"G0 X{x} Y{y} F3000\n").encode())
                self.printer.write(("M400\n").encode())
                self.printer.readline()
                self.printer.readline()
                print('moved')

                # Send command to the sensor which tells it to send back a reading from the TOF sensor
                self.sensor.write(("SEND\n").encode())
                dist = float(self.sensor.readline())

                # TODO find which values of height are the ground vs block and set as self.height_threshold
                # As soon as we find a height value that is high enough for us to qualify it as the cube, end the function and output this
                # row minus some offset as a starting point for compute_transform
                '''if dist <= self.dist_threshold:
                    return 0, y-self.step_coarse'''
        

    def compute_transform(self, startX, startY):
        '''
        This function scans an area with fine precision, to genererate a transformation matrix that describes the square it scans.
        Params:
            startX: int value that initializes where the scanning begins
            startY: int value that initializes where the scanning begins
        Output:
            3x3 np array representing the transformation matrix which would transform a square with
            its bottom left corner at the origin to the square represented by edges
            float value of the length of one side, output in addition to the transform        
        '''
        prev = 0
        prev_coord = (0, 0)
        edges = []
        step = 1
        start = startX
        end = self.max_x + 1
        for y in range(startY, self.max_y):
            found = False
            for x in range(start, end, step):
                self.printer.write((f"G0 X{x} Y{y} F1000\n").encode())
                self.printer.write(("M400\n").encode())
                self.printer.readline()
                self.printer.readline()

                self.sensor.write(("SEND\n").encode())
                dist = float(self.sensor.readline())

                if dist <= self.dist_threshold:
                    # reached a leading edge
                    if prev == 0:
                        found = True
                        edges.append((x, y))
                    prev = 1
                elif dist > self.dist_threshold:
                    # reached a trailing edge
                    if prev == 1:
                        found = True
                        edges.append(prev_coord)
                    prev == 0
                prev_coord = (x, y)

            # creates snaking motion instead of looping back
            if step == 1:
                start = self.max_x
                end = startX - 1
                step = -1
            else:
                start = startX
                end = self.max_x + 1
                step = 1

            # This is the end condition, if we don't see anything for a full row then we must have finished scanning the cube
            if not found and y > (startY + 3):
                break

        #send the arduino to the magnetic sensing phase
        self.sensor.write(("2\n").encode())

        # now that all edges are recorded, can compute corners and transform
        x_sort = sorted(sorted(edges, key=lambda x: x[1]), key=lambda x: x[0] )
        y_sort = sorted(sorted(edges, key=lambda x: x[0]), key=lambda x: x[1], reverse=True )

        # this holds for any rotated or non rotated cube
        corner1, corner3 = x_sort[0], x_sort[-1]
        corner2, corner4 = y_sort[0], y_sort[-1]

        # since our template square starts at 0,0, this is our x,y transform
        t_x,t_y = corner1
        
        try:
            theta = np.arctan((corner4[1] - corner1[1])/(corner4[0] - corner1[0]))
        except ZeroDivisionError:
            theta = 0

        sideLength = np.sqrt((corner2[1] - corner1[1])**2 + (corner2[0] - corner1[0])**2)

        transform = np.array([[np.cos(theta), -np.sin(theta), t_x],
                             [np.sin(theta), np.cos(theta), t_y], 
                             [0,0,1]])

        return transform, sideLength

    def dynamic_sensor_movement(self):
        '''
        Main Idea:
            Mapping Mode(Coarse): Move around entire base plate with coarse scans in set pattern
                Behavior: Fast movement, larger step size, coarser scans. Output of arduino is fed to py when requested.
                End condition: Receipt of lower dist (raised block), move back a step(maybe drop a column) and start Mapping Mode(Fine)
            Compute transform: Move starting at some point and record all coords which are edges (low->high)
                Behavior: Smaller step size, fine scanning. Outputs are recorded into some data struct.
                End condition: Full row of low points where there is no elevated point. Locate corners of cube and compute transform/rotation
                matrix and size of cube. Start scan mode
            Scan Mode: With the transform matrix and size of cube face, can now perform a scan of the cube with hall effect sensor
                Behavior: Small step size, (x,y) range determined by size of cube gets input to transform to move to correct coordinate.
                          Record mag values as sensor moves, generate map based on high/low
                End condition: Finish coordinates
                Output: 2D NP array of magnetic readings which should correspond to the magnetic structure
        '''
        start_x, start_y = self.map_coarse()

        trans, length = self.compute_transform(start_x, start_y)

        output = np.zeros((int(length/float(self.mag_size)), int(length/float(self.mag_size))))

        row_index = output.shape[0]
        col_index = 0

        self.printer.write((f"G0 Z{self.mag_height} F3000\n").encode())
        self.printer.write(("M400\n").encode())
        self.printer.readline()
        self.printer.readline()

        for y in range(0,length, self.mag_size):
            for x in range(0, length, self.mag_size):
                coord = np.array([x,y,1]).T
                translated = np.matmul(trans, coord)
                tx, ty = (int(translated[0]+.5), int(translated[1] + .5))

                self.printer.write((f"G0 X{tx} Y{ty} F3000\n").encode())
                self.printer.write(("M400\n").encode())
                self.printer.readline()
                self.printer.readline()

                #send magnetic data because sensor is in phase 2
                self.sensor.write(("SEND\n").encode())
                mag_val = float(self.sensor.readline().decode())
                output[row_index,col_index] = mag_val
                col_index += 1
            col_index = 0
            row_index -= 1

        return output
    
    def xor(first, second):
        if (first or second) and not(first and second):
            return True
        return False
    
    
    def plot_matrix(self, input_matrix):
        '''
        Main Idea:
            Mapping Mode(Coarse): Move around entire base plate with coarse scans in set pattern
                Behavior: Fast movement, larger step size, coarser scans. Output of arduino is fed to py when requested.
                End condition: Receipt of lower dist (raised block), move back a step(maybe drop a column) and start Mapping Mode(Fine)
            Compute transform: Move starting at some point and record all coords which are edges (low->high)
                Behavior: Smaller step size, fine scanning. Outputs are recorded into some data struct.
                End condition: Full row of low points where there is no elevated point. Locate corners of cube and compute transform/rotation
                matrix and size of cube. Start scan mode
            Scan Mode: With the transform matrix and size of cube face, can now perform a scan of the cube with hall effect sensor
                Behavior: Small step size, (x,y) range determined by size of cube gets input to transform to move to correct coordinate.
                          Record mag values as sensor moves, generate map based on high/low
                End condition: Finish coordinates
                Output: 2D NP array of magnetic readings which should correspond to the magnetic structure
        '''
        offset = 0
        normal = self.gcode_snap(input_matrix, offset, self.mag_size, False, False)
        norm_neg = self.gcode_snap(input_matrix, offset, self.mag_size, False, True)
        #inverted = self.gcode_snap(input_matrix, offset, self.mag_size, True, False)
        #inv_neg = self.gcode_snap(input_matrix, offset, self.mag_size, True, True)
        # first going to write to a file called filename where we do both the normal and negated version
        f = self.printer
        # for line in header_arr:
        #     f.write(line)
        #     f.write('\n')
        for line in normal:
            f.write(line.encode())
            f.write(('\n').encode())
        # five second delay for switching the magnets for negating
        # f.write("G4 P10000\n")
        for line in norm_neg:
            f.write(line.encode())
            f.write(('\n').encode())


    def demo_movement(self):
        '''
        This function was just to prove that we can send commands to the printer via some ports.
        For reference, the M400 code in Gcode tells the device to wait until the command is executed to send
        the "ok" message which it always sends after getting commands via a serial port.
        '''

        port = serial.Serial(port=self.leftPort, baudrate=self.baudrate)
        state = 1
        switch = None
        count = 0

        # port.open()
        while True:
            if state == 1:
                port.write(("G91\n").encode())
                port.write(("M400\n").encode())
                switch = port.readline()
                switch = port.readline()
                state = 2
            elif state == 2:
                port.write(("G0 X10 Y10 F1000\n").encode())
                port.write(("M400\n").encode())
                switch = port.readline()
                switch = port.readline()
                print(switch)
                state = 3
                count += 1
                print(count)
            elif state == 3:
                port.write(("G90\n").encode())
                port.write(("M400\n").encode())
                switch = port.readline()
                switch = port.readline()
                state = 4
            elif state == 4:
                port.write(("G0 X30 Y25 F1000\n").encode())
                port.write(("M400\n").encode())
                switch = port.readline()
                switch = port.readline()
                print(switch)
                state = 1


    def test_transform(self, edges):
        '''
        This function was just for testing if the compute transform is correct.
        Params:
            edges (list): Python list of all points on the edges of the cube
        Output:
            3x3 np array representing the transformation matrix which would transform a square with
            its bottom left corner at the origin to the square represented by edges
            float value of the length of one side, output in addition to the transform
        '''
        x_sort = sorted(sorted(edges, key=lambda x: x[1]), key=lambda x: x[0] )
        y_sort = sorted(sorted(edges, key=lambda x: x[0]), key=lambda x: x[1], reverse=True )

        # this holds for any rotated cube
        corner1, corner3 = x_sort[0], x_sort[-1]
        corner2, corner4 = y_sort[0], y_sort[-1]

        t_x,t_y = corner1

        try:
            theta = np.arctan((corner4[1] - corner1[1])/(corner4[0] - corner1[0]))
        except ZeroDivisionError:
            theta = 0

        sideLength = np.sqrt((corner2[1] - corner1[1])**2 + (corner2[0] - corner1[0])**2)

        transform = np.array([[np.cos(theta), -np.sin(theta), t_x], [np.sin(theta), np.cos(theta), t_y], [0,0,1]])

        return transform, sideLength

    def test_trans_movement(self, trans_and_len):
        trans = trans_and_len[0]
        length = trans_and_len[1]

        template = [(0,0), (0,length), (length,length), (length,0)]
        output = []

        for e in template:
            coord = np.array([e[0],e[1],1]).T
            translated = np.matmul(trans, coord)
            output.append((int(translated[0]+.5), int(translated[1] + .5)))
        return output
        
    def test_mag_sense(self):
        self.sensor.write(("SEND\n").encode())
        
    
        


'''
These are some things which you can uncomment to test or run different functions of the MovementController class. Feel free to mess around with anything.
'''

demo = MovementController()
demo.run_sensor()
# edges = [(1, 1), (4, 1), (4, 4), (1, 4), (1, 2), (1, 3), (4, 3), (4, 2)]
# edges2 = [(2,2), (3,3), (4,4), (3,5), (2,6), (1,5), (0,4), (1,3)]
# print(demo.test_transform(edges2))
# print(demo.test_transform(edges))
# print(demo.test_transform(edges2))
# print(demo.test_trans_movement(demo.test_transform(edges2)))
#get rotation and translation [rot, tx,ty]