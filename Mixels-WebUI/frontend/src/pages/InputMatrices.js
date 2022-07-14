import { render } from "@testing-library/react";
import React from "react";
import { Typography, Stack, Button, TextField, Switch, InputLabel, Input } from "@mui/material";
// import './main.css';
import MetaCube from "./MetaCube";
// import placeholder from '..//media/images/matrices/dog.jpg'
// import placeholder_1 from '../media/svgs/attractive.svg'
import placeholder_1 from '../media/images/matrices/test_big.png'
// import placeholder_2 from '../media/svgs/test.svg'

export default class InputMatrices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numberMatrices: 0,
            matricesIndices: null,
            toShow: false,
            viewMatrix: false,
            folder: "matrices"}
    }

    updateMatricesCount = (event) => {
        if (parseInt(event.target.value) > 0) {
            this.setState({
                numberMatrices: event.target.value,
                matricesIndices: Array.from(Array(parseInt(event.target.value)).keys()),
                toShow: false
            })
        }
        else {
            this.setState({
                numberMatrices: 0,
                matricesIndices: []
            })
        }
    }

    handleClick = (event) => {
        this.setState({
            toShow: true
        })


    }

    componentDidMount() {
        this.setState({
            toShow: false
        })
    }

    render() {
        return (
            <div>
                <Stack className="width-100 align-center">
                    <Stack direction="horizontal" className="align-center justify-center">
                        <TextField
                            variant="filled" label="Number of matrices" id="sheetRows"
                            className="margin-8px" type="number" onChange={this.updateMatricesCount}></TextField>

                        {/* onChange={() => {updateValue('rows', 'sheetRows')}} */}

                    </Stack>
                    <Stack direction="horizontal">
                        <Button variant="contained" style={{
                            borderRadius: 35,
                            backgroundColor: "#A9A9A9",
                            padding: "18px 36px",
                            fontSize: "18px",
                            width: '180px'
                        }}
                            className="margin-8px" onClick={() => {
                                let textElement = document.getElementById("sheetRows")
                                this.setState({
                                    numberMatrices: textElement.value,
                                    toShow: true,
                                    folder: "matrices"
                                })
                                // generateSheet("sheetContainer", rows, 2)
                            }} >
                            Generate</Button>
                        <input type="file" name="docfile" id="docfile" style={{display: "none"}} onChange={(event) => {
                            var data = new FormData()
                            data.append('file', event.target.files[0])
                            fetch('http://127.0.0.1:8000/api/sheet/upload_file', {
                                method: 'POST',
                                body: data
                            }).then((data) => data.text())
                                .then(response => {
                                    console.log('Printing the response')
                                    console.log(response)
                                    let matrixCount = parseInt(response)
                                    console.log(matrixCount)
                                    // let importedImages = []
                                    // let importedInvImages = []
                                    // console.log(images.Matrix_0)
                                    // for (let i = 0; i < matrixCount; i++) {
                                    //     importedImages.push(`../../public/matrices_imported/matrix_${i}.png`)
                                    //     importedInvImages.push(`../../public/matrices_imported/matrix_${i}_inv.png`)
                                    // }
                                    this.setState({
                                        // matricesImages: importedImages,
                                        // inverseMatrices: importedInvImages,
                                        numberMatrices: matrixCount,
                                        toShow: true,
                                        folder: "matrices_imported",
                                        matricesIndices: Array.from(Array(matrixCount).keys()),
                                    })
                                    // console.log(images)
                                    event.preventDefault()
                                })
                        }}/>
                        <Button variant="contained" type="submit" className="margin-8px" style={{
                            borderRadius: 35,
                            backgroundColor: "#A9A9A9",
                            padding: "18px 36px",
                            fontSize: "18px",
                            width: '180px'
                        }}
                            onClick={
                                () => {
                                    let input = document.getElementById("docfile")
                                    input.click()
                                }
                            }>Import</Button>

                        {/* <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="docfile" name="docfile" multiple type="file" sx={{display:"none"}} />
                            <Button variant="contained" component="span" style={{
                                borderRadius: 35,
                                backgroundColor: "#A9A9A9",
                                padding: "18px 36px",
                                fontSize: "18px",
                                width: '180px'
                            }}
                                onClick={() => {
                                    var input = document.getElementById("docfile")
                                    var data = new FormData()
                                    data.append('file', input.files[0])
                                    fetch('http://127.0.0.1:8000/api/sheet/upload_cell', {
                                        method: 'POST',
                                        body: data
                                    }).then((data) => data.text())
                                        .then(response => {
                                            console.log('Printing the response')
                                            let matrix = JSON.parse(response)
                                            this.setState({
                                                toShow: true,
                                                rows: matrix.length,
                                                cols: matrix[0].length,
                                                matrix: matrix
                                            })
                                            console.log(matrix)
                                        })
                                }}>
                                Upload
                            </Button>
                        </label> */}
                    </Stack>

                    <div className="flex align-center margin-8px justify-center">
                        <Switch size="medium" onClick={() => {
                            console.log("Button flicked");
                            console.log("Before", (this.state.viewMatrix))
                            this.setState({
                                viewMatrix: !this.state.viewMatrix
                            })
                            this.forceUpdate()
                            console.log("After", this.state.viewMatrix)
                        }}></Switch>
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
                    <Stack direction="horizontal" className="flex-wrap justify-center">
                        {this.state.toShow && this.state.matricesIndices.map((elem, i) => (
                            <div>
                                <MetaCube viewMatrix={this.state.viewMatrix} num = {i} key={elem} f = {this.state.folder}/>
                            </div>
                        ))
                        }

                    </Stack>

                    <Stack direction="horizontal">
                        <Button variant="contained" style={{
                            borderRadius: 35,
                            backgroundColor: "#A9A9A9",
                            padding: "18px 36px",
                            fontSize: "18px",
                            width: '180px'
                        }}
                            onClick={() => {
                                console.log("Fetching the file")
                                console.log("http://127.0.0.1:8000/api/sheet/download_matrix?count=" + this.state.numberMatrices)
                                fetch("http://127.0.0.1:8000/api/sheet/download_matrix?count=" + this.state.numberMatrices, {
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
                            }}
                            className="margin-8px">Export</Button>

                        {/* <form enctype="multipart/form-data" action="http://127.0.0.1:8000/api/sheet/upload_file" method="post"> */}

                    </Stack>


                    {/* </form> */}
                </Stack>
            </div>

        );
    }
}