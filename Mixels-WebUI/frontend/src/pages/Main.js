import { render } from "@testing-library/react";
import React from "react";
import { Typography, InputLabel, Switch, touchRippleClasses, Button, Stack } from "@mui/material";
import './main.css';
import './InputMatrices'
import InputMatrices from "./InputMatrices";
import MetaCube from './MetaCube'
import '../styles/MetaCube.scss'
import './importingImages'
import NavBar from "../navbar/navbar";
export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewMatrix: false
        }
    }

    render() {
        return (
            <div>
                
                <NavBar selected={"home"}></NavBar>
                <InputMatrices viewMatrix={this.state.viewMatrix} />
                
            </div>

        );
    }
}