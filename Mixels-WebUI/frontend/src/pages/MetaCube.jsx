import { render } from "@testing-library/react";
import React from "react";
import { Typography } from "@mui/material";
// import './main.css';
import './InputMatrices'
import '../styles/MetaCube.scss'
import InputMatrices from "./InputMatrices";
export default class MetaCube extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewMatrix: this.props.viewMatrix,
            matrixImage: this.props.matrixImage,
            matrixInv: this.props.matrixInv
        }
    }

    // componentDidUpdate(prevProps) {
    //     if(prevProps.viewMatrix !== this.props.viewMatrix){
    //         this.setState({
    //             viewMatrix:!this.props.viewMatrix
    //         })
    //     }
    //     }
    render() {
        let images = require.context("../media/images/", true)
        console.log(this.props.f)
        console.log("num = ", this.props.num)
        // if (this.state.viewMatrix == true) {
            // console.log(this.state.matrixImage)
            return (
                <>
                {this.props.viewMatrix? 
                    <div className="flex flex-wrap align-center column margin-cube">
                    <div>
                    <div class="black clickable square-150px flex align-center justify-center solid-yellow box-shadow solid-border margin-5px"></div>
                    </div>

                        <div class="float-container">
                            <div className="black clickable square-150px flex align-center justify-center -shadow solid-border float-child margin-5px">
                                <img src={images(`./${this.props.f}/matrix_${this.props.num}.png`)}/>
                            </div>
                            <div className="black clickable square-150px flex align-center justify-center -shadow solid-border float-child margin-5px">
                                <img src={images(`./${this.props.f}/matrix_${this.props.num}_inv.png`)}/>
                            </div>
                        </div>
                    </div> : <div>
                                <div class="black clickable square-150px flex align-center justify-center solid-yellow box-shadow solid-border margin-1px"></div>
                            </div>
                }
                </>
            )
        // } else {
        //     return (
        //         <div>
        //             <div class="black clickable square-150px flex align-center justify-center solid-yellow box-shadow solid-border margin-1px"></div>
        //         </div>

        //     );
        // }
    }
}