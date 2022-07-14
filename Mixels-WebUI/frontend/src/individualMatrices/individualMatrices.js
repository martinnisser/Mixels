import { render } from "@testing-library/react";
import React from "react";
import { Typography, Stack, Button, TextField, Switch, InputLabel, Input, Modal, Box } from "@mui/material";
import MetaCube from "./individualMetaCube";
import NavBar from "../navbar/navbar";

export default class IndividualMatrices extends React.Component {
    constructor(props) {
        super(props);
        // let matrix = []
        // for (let i = 0; i < 8; i++) {
        //     let row = [];
        //     for (let j = 0; j < 8; j++) {
        //         row.push(0);
        //     }
        //     matrix.push(row);
        // }
        this.state = {
            rows: 0,
            cols: 0,
            toShow: false,
            matrix: [],
            open: false,
            token: "", 
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

    setOpen = (x) => {
        this.setState({
            open: x
        })
    }

    render() {
        let images = require.context('../media/images/matrices', true);
        let list = null;
        const handleOpen = () => this.setOpen(true);
        const handleClose = () => this.setOpen(false);
        const style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          };
        // let images = require.context('../media/images/matrices_imported', true);


        return (


            <>
                <NavBar selected={"matrix"}/>
                
                <Stack className="width-100 align-center">
                    <Stack direction="horizontal" className="align-center margin8px">
                            <Button onClick={handleOpen} className="margin-8px light-gray" sx={{backgroundColor: "#A9A9A9"}} style={{
                        borderRadius: 35,
                        backgroundColor: "#A9A9A9",
                        padding: "18px 36px",
                        fontSize: "18px",
                        color: "#fff",
                        marginRight: "20px"
                    }}>Choose Token</Button>
                            {/* <img src={this.state.token}/> */}
                            <img src={images("./matrix_0.png")} width="60" height="60" className="box-shadow solid-border margin-8px"/>
                            <Modal
                                open={this.state.open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                >
                                <Box sx={style} className="flex column align-center">
                                    <Typography sx={{color: "black", margin: "10px"}} variant="h3">Canvas Settings</Typography>
                                    <input type="file" />
                                </Box>
                            </Modal>

                        </Stack>

                    <Stack direction="horizontal" className="align-center justify-center">
                        <TextField
                            variant="filled" label="Rows" id="sheetRows"
                            className="margin-8px" type="number" onChange={this.updateRows}></TextField>

                        <TextField
                            variant="filled" label="Columns" id="sheetRows"
                            className="margin-8px" type="number" onChange={this.updateColumns}></TextField>

                    </Stack>
                    <Button variant="contained" onClick={() => {
                        let matrix = []
                        for (let i = 0; i < this.state.rows; i++) {
                            let row = [];
                            for (let j = 0; j < this.state.cols; j++) {
                                row.push(2);
                            }
                            matrix.push(row);
                        }
                        this.setState({
                            toShow: true,
                            matrix: matrix
                        })
                        console.log(this.state.matrix)
                    }} className="margin-8px light-gray" sx={{backgroundColor: "#A9A9A9"}} style={{
                        borderRadius: 35,
                        backgroundColor: "#A9A9A9",
                        padding: "18px 36px",
                        fontSize: "18px",
                        width: '180px',
                        marginBottom:'20px'
                    }}>
                        Generate </Button>
                    <Stack direction="horizontal" className="align-center">
                        <Typography className="color-black margin-8px">Show property</Typography>
                        <Switch size="medium" onClick={() => {
                                console.log("Button flicked");
                                let cells = document.getElementsByName("cell");
                                console.log(cells)
                                for (let cell of cells) {
                                    if (!this.state.toShow) cell.classList.add('disable-hover');
                                    else cell.classList.remove('disable-hover');
                                }
                                
                                this.setState({
                                    viewMatrix: !this.state.toShow
                                })
                                // console.log(this.state.viewMatrix)
                            }}></Switch>
                        <Typography className="color-black margin-8px">Show matrix</Typography>
                    </Stack>
                    <div class="flex column align-center margin-8px">
                        {this.state.matrix.map((row, i) => (
                            <div class="flex" name="matrixRow" id={`row-${i}`}>
                                {row.map((col, j) => (
                                    <MetaCube  matrixVal={col} row={i} col={j} matrix={this.state.matrix}></MetaCube>
                                ))}
                            </div>
                        ))}
                    </div>
                    <Stack direction="horizontal" className="align-center justify-center margin-8px">
                        <Stack direction="horizontal" className="align-center margin-8px">
                            <div class={`black clickable square-40px flex align-center justify-center solid-2-1 box-shadow solid-border`}></div>
                            <div class={`black clickable square-40px flex align-center justify-center solid-2 box-shadow solid-border`}></div>
                            <Typography className="margin-8px color-black">Agnostic</Typography>
                        </Stack>
                        <Stack direction="horizontal" className="align-center margin-8px">
                            <div class={`black clickable square-40px flex align-center justify-center solid-3-1 box-shadow solid-border`}></div>
                            <div class={`black clickable square-40px flex align-center justify-center solid-3 box-shadow solid-border`}></div>
                            <Typography className="margin-8px color-black">Repulsive</Typography>
                        </Stack>
                        <Stack direction="horizontal" className="align-center margin-8px">
                            <div class={`black clickable square-40px flex align-center justify-center solid-4-1 box-shadow solid-border`}></div>
                            <div class={`black clickable square-40px flex align-center justify-center solid-4 box-shadow solid-border`}></div>
                            <Typography className="margin-8px color-black">Attractive</Typography>
                        </Stack>
                    </Stack>
                    <Stack direction="horizontal">
                        <Button variant="contained"
                            onClick={() => {
                                console.log("Fetching the file")
                                console.log("Sending .... ", this.state.matrix)
                                fetch("http://127.0.0.1:8000/api/sheet/construct_matrix?matrix=" + JSON.stringify(this.state.matrix), {
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
                                            `complete_canvas.pkl`,
                                        );

                                        // Append to html link element page
                                        document.body.appendChild(link);

                                        // Start download
                                        link.click();

                                        // Clean up and remove the link
                                        link.parentNode.removeChild(link);
                                    });
                            }}
                            className="margin-8px light-gray" sx={{backgroundColor: "#A9A9A9"}}
                            style={{
                                borderRadius: 35,
                                backgroundColor: "#A9A9A9",
                                padding: "18px 36px",
                                fontSize: "18px",
                                width: '180px'
                            }}
                            >Export</Button>
                        {/* <input type="file" name="docfile" id="docfile" />
                        <Button variant="contained" type="submit" className="margin-8px"
                            onClick={
                                () => {
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
                                }
                            }>Import</Button> */}
                        
                      
                    </Stack>
                </Stack>
            </>
        );
    }
}
