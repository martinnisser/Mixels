import { render } from "@testing-library/react";
import React from "react";
import { Typography } from "@mui/material";
// import './main.css';
import '../styles/MetaCube.scss'
import Navbar from "../navbar/navbar";

export default class MetaCube extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matrixVal: this.props.matrixVal,
            row: this.props.row,
            col: this.props.col,
            matrix: this.props.matrix

        }
    }

    render() {
        console.log(this.state.matrixVal)
        return (
            <div>
                <div class={`black clickable square-40px flex align-center justify-center solid-${this.state.matrixVal} box-shadow solid-border`}
                onClick={(event) => {
                    let x = this.state.matrixVal + 1
                    if (x === 2) x = -1;
                    this.setState({
                        matrixVal: x
                    })
                    this.state.matrix[this.state.row][this.state.col] = x
                    event.target.classList.remove("solid-0");
                    event.target.classList.remove("solid-1");
                    event.target.classList.remove("solid--1");
                    event.target.classList.add(`solid-${this.state.matrixVal}`);
                    console.log(this.state.matrix)
                }}></div>
            </div>

        );
    }
}