import './navbar.css';
import * as React from 'react';
import { Typography, InputLabel, Switch, touchRippleClasses, Button, Stack } from "@mui/material";

export default class NavBar extends React.Component {
  render() {
    window.addEventListener('load', () => {document.getElementById(this.props.selected).click()})
    return (
      <>
        <div
          className="width-100 flex align-center justify-end column dark-gray sheet-header box-shadow margin-bottom-10px">
          <Typography variant="h1">Mixels</Typography>
          <Stack direction="horizontal">
            <div id="home" style={{margin:"10px", marginBottom: "0"}} onClick={() => {
            document.getElementById("home").style.backgroundColor = "white"
            document.getElementById("control").style.backgroundColor = "transparent"
            document.getElementById("matrix").style.backgroundColor = "transparent"
            document.getElementById("homeBtn").style.color = "#000"
          }}>
              <Button id="homeBtn" sx={{color: "#fff"}} onClick={() => {
                window.location = "/"
                return false
              }}>
                Pair Generation
              </Button>
            </div>
            <div id="control" style={{margin:"10px", marginBottom: "0"}}  onClick={() => {
            document.getElementById("home").style.backgroundColor = "transparent"
            document.getElementById("control").style.backgroundColor = "white"
            document.getElementById("matrix").style.backgroundColor = "transparent"
            document.getElementById("controlBtn").style.color = "#000"
          }}>
            <Button id="controlBtn" sx={{color: "#fff"}} onClick={() => {
              window.location = "/individualControl"
              return false
            }}>
              Check & Modify
            </Button>
            </div>
            <div id="matrix" style={{margin:"10px",  marginBottom: "0"}}  onClick={() => {
            document.getElementById("home").style.backgroundColor = "transparent"
            document.getElementById("control").style.backgroundColor = "transparent"
            document.getElementById("matrix").style.backgroundColor = "white"
            document.getElementById("matrixBtn").style.color = "#000"
          }}>
            <Button id="matrixBtn" sx={{color: "#fff"}} onClick={() => {
              window.location = "/individualMatrices"
              return false
            }}>
              Canvas Interaction
            </Button>
            </div>
          </Stack>
        </div>
      </>
    )
}}
