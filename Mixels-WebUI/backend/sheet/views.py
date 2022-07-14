"""
sheet views
"""
from django.http import HttpResponse, FileResponse
from rest_framework.response import Response
from django.shortcuts import render,redirect
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.core.files import File
from rest_framework.decorators import api_view
# from django.core.urlresolvers import reverse
from django.urls import reverse
from django.core.files.storage import FileSystemStorage
from sheet.models import Document
from sheet.forms import DocumentForm
import pickle
import os
import glob
import json
import matplotlib.pyplot as plt
import numpy as np

folder_name = "/home/ec2-user/MagneCube-ChoiceView/frontend/src/media/images/matrices_imported/"
# @api_view(('POST',))
@csrf_exempt
def download_matrix(request):
    print("Got to download matrix")
    file_name  = 'sheet/files/matrix_12_1.pkl'
    saved_file_name = 'sheet/files/subset_matrices.pkl'
    with open(file_name, 'rb') as handle:
        matrices = pickle.load(handle)
    message = request.GET.get('count')
    count = int(message)
    subset_matrices = matrices[:count,:,:]
    with open(saved_file_name, 'wb') as handle:
        pickle.dump(subset_matrices, handle)
    print('saved matrices')
    return FileResponse(open(saved_file_name, 'rb'))

@csrf_exempt
def construct_cell(request):
    matrix = json.loads(request.GET.get("matrix"))
    print(matrix)
    arr = np.array(matrix)
    saved_file_name = "sheet/files/constructed_cell.pkl"
    pickle.dump(arr, open(saved_file_name, "wb"))
    return FileResponse(open(saved_file_name, 'rb'))

@csrf_exempt
def construct_matrix(request):
    matrix = json.loads(request.GET.get("matrix"))
    print(matrix)
    arr = np.array(matrix)
    print(arr)
    file_name  = 'sheet/files/matrix_12_1.pkl'
    with open(file_name, 'rb') as handle:
        matrices = pickle.load(handle)
    repulsive_array = matrices[0]
    attractive_array = matrices[0] * -1
    agnostic_array = matrices[1]
    print(arr.shape)
    canvas_shape = list(arr.shape)
    print(canvas_shape[0])
    complete_canvas = np.zeros((canvas_shape[0], canvas_shape[1], 8, 8), dtype='float32')
    for r_value in range(canvas_shape[0]):
        for c_value in range(canvas_shape[1]):
            this_canvas_value = arr[r_value, c_value]
            if(this_canvas_value == 2):
                complete_canvas[r_value,c_value,:,:] = agnostic_array
            if(this_canvas_value == 3):
                complete_canvas[r_value,c_value,:,:] = repulsive_array
            if(this_canvas_value == 4):
                complete_canvas[r_value,c_value,:,:] = attractive_array

    print(complete_canvas.shape)
    new_array_shape = [x * 8 for x in canvas_shape]
    print(new_array_shape)
    complete_canvas_reshaped = np.zeros((new_array_shape[0],new_array_shape[1]), dtype='float32')
    for index_1 in range(0,new_array_shape[0],8):
        for index_2 in range(0,new_array_shape[1],8):
            complete_canvas_reshaped[index_1:index_1+8, index_2:index_2+8] = complete_canvas[(index_1) // 8, (index_2) // 8]

    print("Completed")
    saved_file_name = "sheet/files/constructed_matrix.pkl"
    pickle.dump(complete_canvas_reshaped, open(saved_file_name, "wb"))
    return FileResponse(open(saved_file_name, 'rb'))

@csrf_exempt 
def upload_cell(request):
    files = glob.glob(folder_name + '*')
    for f in files:
        os.remove(f)
    # Handle file upload
    form = DocumentForm(request.POST, request.FILES)
    # if form.is_valid():
    print(request.FILES)
    newdoc = pickle.load(request.FILES['file'])
    print(newdoc)
    return HttpResponse(json.dumps(newdoc.tolist()))

@csrf_exempt
def upload_file(request):
    message = 'Upload as many files as you want!'
    files = glob.glob(folder_name + '*')
    for f in files:
        os.remove(f)
    # Handle file upload
    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        print('checking for files!')
        print(form)
        # if form.is_valid():
        print("FILES")
        print(request.FILES)
        newdoc = request.FILES['file']
        fs = FileSystemStorage()
        print(os.getcwd())
        save_res = fs.save(folder_name + "/new_matrix.pkl", newdoc)
        obj = read_pickle()
        return obj
            # Redirect to the document list after POST
        # else:
        #     print("Check failed")
        #     message = 'The form is not valid. Fix the following error:'
    else:
        form = DocumentForm()  # An empty, unbound form

    # Load documents for the list page
    documents = Document.objects.all()
    print('somehow find myself here')
    # Render list page with the documents and the form
    # context = {'documents': documents, 'form': form, 'message': message}
    return render(request, 'list_2.html')

def read_pickle():
    with open(folder_name + "new_matrix.pkl", "rb") as fi:
        matrices = pickle.load(fi)
    generate_Images(matrices)

    matrices_count = matrices.shape[0]
    print(matrices.shape)
    return HttpResponse(json.dumps(matrices_count))
    # with open(folder_name + "matrix_count.txt", 'w') as fi:
    #     fi.write(str(matrices_count))
    
    
def generate_Images(matrix_file):
    print('Generating Images')
    for main_index, this_matrix in enumerate(matrix_file):
        # print(this_matrix)
        big_matrix = np.zeros((800,800),dtype='int8')
        for index_1 in range(8):
            for index_2 in range(8):
                big_matrix[index_1*100:((index_1+1))*100,index_2*100:((index_2+1))*100] = this_matrix[index_1,index_2]
        plt.imsave(folder_name + "matrix_" + str(main_index) + ".png", big_matrix,  cmap='gray')
        big_matrix_inv = big_matrix * -1 
        plt.imsave(folder_name + "matrix_" + str(main_index)  +"_inv"+ ".png", big_matrix_inv,  cmap='gray')
