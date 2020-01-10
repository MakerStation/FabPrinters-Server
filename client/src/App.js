import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {Alert, Button} from 'shards-react';
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormInput,
  Collapse,
  Badge
} from "shards-react";
import {Row, Col} from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css"
import "shards-ui/dist/css/shards.min.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCog, faPlayCircle, faCheckCircle, faExclamationCircle, faPauseCircle, faTimesCircle, faExclamationTriangle, faThermometerHalf } from "@fortawesome/free-solid-svg-icons";
import Tab from "./Tab.js"
import ServerRequest from "./ServerRequest.js"
import Cmd from "./Cmd.js"
import Icon from '@mdi/react'
import { mdiCarBrakeAlert } from '@mdi/js'
import socketIOClient from "socket.io-client";

var socket = null;

var elementPrintersTabs = []
var Printers = null;
var CurrentPrinter;
var PrintersTabs = []

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      endpoint: "localhost:3001",
      currentPrinter: 0,
      printTime: new Date().toLocaleTimeString()  //da cambiare con tempo di stampa
    }
    socket = socketIOClient(this.state.endpoint)
    Printers = new ServerRequest.Printers()
  }

  componentDidMount = () => {
      // const socket = socketIOClient(this.state.endpoint)
      this.interval = setInterval(() => this.setState({printTime: new Date().toLocaleTimeString()}), 1000) //(funzione da chiamare, intervallo)
      socket.on('change color', (col) => {
          document.body.style.backgroundColor = col
      })
  }

  componentWillUnmount() {
    //cose fatte dopo chiusura componente
    clearInterval(this.interval)
  }

  PrintTab = (e) => {
    let id = e.currentTarget.dataset.div_id
    console.log(id)
    this.setState({currentPrinter: id})
    // this.printersTabs(4)
  }

  UpdatePrintTab() {
    if(this.state.currentPrinter == 0) return
    CurrentPrinter = <Tab status={Printers.getStatus()[this.state.currentPrinter]} number={this.state.currentPrinter} progress={Math.round((((new Date().getSeconds()/60)*100) + 0.00001) * 100) / 100} socket={socket}></Tab>
  }

  printersTabs(n){
    elementPrintersTabs = []
    for(var i=1; i<=n;i++){
      let temp = Printers.getStatus()[i]
      let status;
      switch (temp) {
        case "Printing":
            status = <span><Badge theme="success"><FontAwesomeIcon icon={faPlayCircle}/></Badge> Printing {this.state.printTime}</span>
          break;
        case "Paused":
            status = <span><Badge theme="info"><FontAwesomeIcon icon={faPauseCircle}/></Badge> Paused</span>
          break;
        case "Warning":
            status = <span><Badge theme="warning"><FontAwesomeIcon icon={faExclamationCircle}/></Badge> Warning</span>
          break;
        case "Error":
            status = <span><Badge theme="danger"><FontAwesomeIcon icon={faExclamationTriangle}/></Badge> Error</span>
          break;
        case "Ready":
            status = <span><Badge theme="info"><FontAwesomeIcon icon={faCheckCircle}/></Badge> Ready</span>
          break;
        case "Disconnected":
            status = <span><Badge theme="secondary"><FontAwesomeIcon icon={faTimesCircle}/></Badge> Disconnected</span>
          break;
        case "Heating":
            status = <span><Badge theme="success"><FontAwesomeIcon icon={faThermometerHalf}/></Badge> Heating</span>
          break;
        default:
            status = <span><Badge theme="light"></Badge> Status not available</span>
      }  //coso che mette gli stati
      elementPrintersTabs.push(<NavItem>
          <NavItem><NavLink onClick={this.PrintTab} key={i} data-div_id={i} className="printTab"><Row ><Col sm={8}><span className="grassetto">Stampante {i}</span></Col><Col sm={4}><Button className="emergencyStopBtn" size="sm" theme="danger" onClick={this.PrintTab}><img className="emergencyStopIcon" src={require("./Emergency-button.png")}/></Button></Col></Row><br/>
          {status}</NavLink></NavItem>
        </NavItem>)
      }
    }




  render() {
    this.printersTabs(4)
    this.UpdatePrintTab()
    // const socket = socketIOClient(this.state.endpoint)
    socket.on('change color', (col) => {
     document.body.style.backgroundColor = col
   })


      return (
        <div className="container-fluid">
          <Navbar type="dark" expand="true" theme="primary">
            <NavbarBrand href="/">Home</NavbarBrand>
            <Nav navbar>
              <NavItem>
                <NavLink onClick={console.log}><FontAwesomeIcon icon={faCog}/></NavLink>
              </NavItem>
            </Nav>
          </Navbar>
          <Nav tabs>
            {elementPrintersTabs}
          </Nav>
          {CurrentPrinter}
        </div>
      )
  }

}

export default App;
