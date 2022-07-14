import { render } from "@testing-library/react";
import React from "react";
import { Typography, Stack, Button, TextField, Switch, InputLabel } from "@mui/material";
import MetaCube from "./individualMetaCube";

import NavBar from "../navbar/navbar";

export default class InputMatrices extends React.Component {
    constructor(props) {
        super(props);
        let matrix = []
        for (let i = 0; i < 8; i++) {
            let row = [];
            for (let j = 0; j < 8; j++) {
                row.push(0);
            }
            matrix.push(row);
        }
        this.state = {
            rows: 8,
            cols: 8,
            toShow: false,
            matrix: matrix
        }
    }

    updateRows = (event) => {
        if (parseInt(event.target.value) > 0) {
            this.setState({
                rows: parseInt(event.target.value)
            })
        }
        else {
            this.setState({
                rows: 0
            })
        }
    }

    updateColumns = (event) => {
        if (parseInt(event.target.value) > 0) {
            this.setState({
                cols: parseInt(event.target.value)
            })
        }
        else {
            this.setState({
                cols: 0
            })
        }
    }

    render() {
        let list = null;
        // let images = require.context('../media/images/matrices_imported', true);


        return (


            <>
            <NavBar selected={"control"}></NavBar>

                <Stack className="width-100 align-center">
                    {/* <Stack direction="horizontal" className="align-center justify-center">
                        <TextField
                            variant="filled" label="Rows" id="sheetRows"
                            className="margin-8px" type="number" onChange={this.updateRows}></TextField>

                        <TextField
                            variant="filled" label="Columns" id="sheetRows"
                            className="margin-8px" type="number" onChange={this.updateColumns}></TextField>

                    </Stack> */}
                    <Stack direction='horizontal' className="align-center justify-center">
                    <Button variant="contained" style={{
                        borderRadius: 35,
                        backgroundColor: "#A9A9A9",
                        padding: "18px 36px",
                        fontSize: "18px",
                        width:'180px',
                        margin: '20px'
                    }}
                        onClick={() => {
                            this.setState({
                                toShow: true
                            })
                            console.log(this.state.matrix)
                        }}>
                        Generate</Button>
                        <input type="file" name="docfile" id="docfile" style={{display:'none'}} onChange={(event) => {
                            var data = new FormData()
                            data.append('file', event.target.files[0])
                            fetch('http://127.0.0.1:8000/api/sheet/upload_cell', {
                                method: 'POST',
                                body: data
                            }).then((data) => data.text())
                                .then(response => {
                                    console.log('Printing the response')
                                    let matrix = JSON.parse(response)
                                    console.log(matrix)
                                    this.setState({
                                        toShow: false,
                                        rows: matrix.length,
                                        cols: matrix[0].length,
                                        matrix: matrix
                                    })
                                    console.log(matrix)
                                    this.setState({
                                        toShow: true,
                                    })
                                })
                        }}/>
                        <Button variant="contained" type="submit" 
                        style={{
                            borderRadius: 35,
                            backgroundColor: "#A9A9A9",
                            padding: "18px 36px",
                            fontSize: "18px",
                            width:'180px',
                            margin: '20px',
                        }}
                            onClick={
                                () => {
                                    var input = document.getElementById("docfile")
                                    input.click()
                                }
                            }>Import</Button>
                            </Stack>
                    <Stack direction="horizontal" className="align-center justify-center">
                        <Stack direction="horizontal" sx={{margin: "15px"}}>
                        <div class={`black clickable square-40px flex align-center justify-center solid-1 box-shadow solid-border`}></div>
                        <Typography className="margin-8px color-black" >North</Typography>
                        </Stack>
                        <Stack direction="horizontal" sx={{margin: "15px"}}>
                        <div class={`black clickable square-40px flex align-center justify-center solid--1 box-shadow solid-border`}></div>
                        <Typography className="margin-8px color-black" >South</Typography>
                        </Stack>
                        <Stack direction="horizontal" sx={{margin: "15px"}}>
                        <div class={`black clickable square-40px flex align-center justify-center solid-0 box-shadow solid-border`}></div>
                        <Typography className="margin-8px color-black" >Demagnetized</Typography>
                        </Stack>
                    </Stack>
                    <div class="flex column align-center">
                        {this.state.toShow && this.state.matrix.map((row, i) => (
                            <div class="flex">
                                {this.state.toShow && row.map((col, j) => (
                                    <MetaCube key={8*i + j} matrixVal={col} row={i} col={j} matrix={this.state.matrix}></MetaCube>
                                ))}
                            </div>
                        ))}
                    </div>
                    <Stack direction="horizontal">
                        <Button variant="contained" sx={{
                        borderRadius: 35,
                        backgroundColor: "#A9A9A9",
                        padding: "18px 36px",
                        fontSize: "18px",
                        width:'180px',
                        margin: '20px'
                    }} className="disable-hover"
                            onClick={() => {
                                console.log("Fetching the file")
                                console.log("Sending .... ", this.state.matrix)
                                fetch("http://127.0.0.1:8000/api/sheet/construct_cell?matrix=" + JSON.stringify(this.state.matrix), {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/python-pickle'
                                    },
                                    credentials: 'include'
                                })
                                    .then((response) => response.blob())
                                    .then((blob) => {
                                        console.log("blob", blob)
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
                            >Export</Button>
                    </Stack>
                </Stack>
            </>
        );
    }
}
