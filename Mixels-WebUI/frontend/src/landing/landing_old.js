import './landing.css';
import * as React from 'react';
import NavBar from '../navbar/navbar';
import { Button, InputLabel, Stack, Switch, TextField, Typography } from '@mui/material';

/***** Global Constants *****/
let selectedTypeSvg = "";
let selectedTypeColor = "yellow";

/**
 * 
 * @param {*} rows 
 * @param {*} cols 
 * @returns 
 */
function generateSheet(containerId, rows, cols) {
  let containerHTML = ``;
  const container = document.getElementById(containerId);

  for (let i = 0; i < rows; i++) {
    let row = `<ul id="row${i}" class="width-90 flex align-center justify-center scroll margin-2halfpx padding-0">`;
    for (let j = 0; j < cols; j++) {
      row += `<div id="cell${i}${j}" class="black margin-4px clickable square-150px flex align-center justify-center solid-yellow box-shadow solid-border"></div>`;
    }
    containerHTML += row + `</ul>`
 
  // alert(`Rows: ${rows} Cols: ${cols}`)
  container.innerHTML = containerHTML;
}

  // for (let i = 0; i < rows; i++) {
  //   for (let j = 0; j < cols; j++) {
  //     const cellId = `cell${i}${j}`;
  //     const cell = document.getElementById(cellId);
  //     cell.onclick = function() {updateCellType(cellId)};
  //   }
  // }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let this_cell_id = `cell${i}${j}`
        console.log(this_cell_id)
      if(j === 1){
        let this_cell = document.getElementById(this_cell_id)
        this_cell.style.display = 'none'
      }
    }
  }
}

function updateCellType(id) {
  const cell = document.getElementById(id);
  switch (selectedTypeSvg) {
    case "repulsive": {
      cell.classList.remove("solid-yellow");
      cell.classList.remove("solid-green");
      cell.classList.add("solid-red");
      break
    }
    case "attractive": {
      cell.classList.remove("solid-yellow");
      cell.classList.remove("solid-red");
      cell.classList.add("solid-green");
      break
    }
    case "neutral": {
      cell.classList.remove("solid-red");
      cell.classList.remove("solid-green");
      cell.classList.add("solid-yellow");
      break
    }
    default: return;
  }
}

/**
 * 
 * @returns 
 */
function Landing() {
  let currentView = "empty";
  let [rows, cols] = [0, 0];
  
  function updateView() {
    showQR()
    switch (currentView) {
      case "empty": {
        currentView = "nonempty";
        showQR();
        break;
      }
      case "nonempty": {
        currentView = "empty";
        hideQR();
        break;
      }
      default: return;
    }
  }

  function hideQR() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cellId = `cell${i}${j}`;
        const cell = document.getElementById(cellId);
        cell.classList.remove("repulsive");
        cell.classList.remove("attractive");
      }
    }
  }

  function showQR() {
    console.log("Showing all cells")
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cellId = `cell${i}${j}`;
        const cell = document.getElementById(cellId);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            let this_cell_id = `cell${i}${j}`
            console.log(this_cell_id)
            let this_cell = document.getElementById(this_cell_id)
            cell.style.display = 'visible'
            // cell.classList.add("attractive");
          }
        }
        // if (cell.classList.contains("solid-red")) {
        //   cell.classList.add("repulsive");
        // }
        // if (cell.classList.contains("solid-green")) {
        //   cell.classList.add("attractive");
        // }
      }
    }
  }

  function updateValue(item, id) {
    const newValue = document.getElementById(id).value;

    console.log(`Updating ${item} -> ${newValue}`)
    switch (item) {
      case "rows" : rows = newValue; break;
      case "cols" : cols = newValue; break;
      default: return;
    }
  }

  function setTypeColor(color) {
    selectedTypeColor = color
    switch(color) {
      case "neutral": selectedTypeSvg = ""; break;
      case "repulsive": selectedTypeSvg = "repulsive"; break;
      case "attractive": selectedTypeSvg = "attractive"; break;
      default: return;
    }
  }

  return (
    <>
      <div id='root' className="flex align-center column">
        <NavBar />
        <div className="width-100 flex align-center justify-center solid-blue sheet-header box-shadow margin-bottom-10px">
          <Typography variant="h1">Programmable Cubes</Typography>
        </div>
        <Stack className="width-100 align-center">
          <Stack direction="horizontal" className="align-center justify-center">
            <TextField 
            variant="filled" label="Number of matrices" id="sheetRows" 
            className="margin-8px" type="number"
            onChange={() => {updateValue('rows', 'sheetRows')}}></TextField>
            
          </Stack>
          <Button variant="contained" onClick={() => {generateSheet("sheetContainer", rows, 2)}} className="margin-8px">Generate</Button>
          
          <Button variant="contained" onClick={() => {
            console.log("Fetching the file")
              fetch("127.0.0.1:8000/api/sheet/download_matrix?count=" + rows, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/python-pickle'
            },
            credentials: 'include'
          })
          .then((response) => response.blob())
          .then((blob) => {
            // Create blob link to download
            const url = window.URL.createObjectURL(
              new Blob([blob]),
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
              'download',
              `matrix.pkl`,
            );

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            link.parentNode.removeChild(link);
          });
          }} className="margin-8px">Export</Button>

<input id='file_upload' type="file" />
<Button variant="contained" onClick={() => {
            let data = document.getElementById("file_upload").files[0];
            console.log(data)
            let formData=new FormData()
            formData.append("file", data)
              fetch("http://127.0.0.1:8000/api/sheet/upload_file", {
            method: 'POST',
            headers: {
              'enctype':'multipart/form-data',
            },
            body: formData,
            
          })
          }} className="margin-8px">Import</Button>


        </Stack>
        <div className="flex align-center margin-8px justify-center"><Switch size="medium" onClick={updateView}></Switch>
        {/* <Button
          variant="contained"
          component="label"
        >
          Upload File
          <form action="{% url 'list' %}" method="post" enctype="multipart/form-data">
          <input
            type="file"
            hidden
          /></form>
        </Button> */}
        <InputLabel>Show Matrices</InputLabel>
        </div>
        <div className="width-100 flex column align-center justify-center" id="sheetContainer"></div>
      </div>
    </>
  )
}

export default Landing;