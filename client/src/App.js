import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {
  Button,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Badge
} from "shards-react";
import {Row, Col} from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css"
import "shards-ui/dist/css/shards.min.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faPlayCircle, faCheckCircle, faExclamationCircle, faPauseCircle, faTimesCircle, faExclamationTriangle, faThermometerHalf } from "@fortawesome/free-solid-svg-icons";
import Tab from "./Tab.js"
import ServerRequest from "./ServerRequest.js"
// import Cmd from "./Cmd.js"
import socketIOClient from "socket.io-client";

var socket = null;

var elementPrintersTabs = []
var S_status = [];
var Printers = null;
var CurrentPrinter;

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      endpoint: "localhost:3001",
      currentPrinter: 0,
      printTime: new Date().toLocaleTimeString(),  //da cambiare con tempo di stampa
      settings: false //true = impostazioni aperte
    }
    socket = socketIOClient(this.state.endpoint)
    Printers = new ServerRequest.Printers()
    S_status = Printers.getStatus();
    this.interval = setInterval(() => this.setState({printTime: new Date().toLocaleTimeString()}), 1000) //(funzione da chiamare, intervallo)
  }

  componentDidMount = () => {
      // const socket = socketIOClient(this.state.endpoint)

      // socket.on('change color', (col) => {
      //     document.body.style.backgroundColor = col
      // })
      socket.on("set printers status", (id, newStatus) => {
        console.log("Status change: "+id+", "+newStatus)
        S_status[id] = newStatus;
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
    socket.emit("switch print tab", id)
    // this.printersTabs(4)
  }

  UpdatePrintTab() {
    if(this.state.currentPrinter === 0) return
    CurrentPrinter = <Tab status={S_status[this.state.currentPrinter]} number={this.state.currentPrinter} progress={Math.round((((new Date().getSeconds()/60)*100) + 0.00001) * 100) / 100} socket={socket}></Tab>
  }

  printersTabs(n){
    elementPrintersTabs = []
    for(var i=1; i<=n;i++){
      let temp = S_status[i]
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
        case "Waiting":
            status = <span><Badge theme="info"><FontAwesomeIcon icon={faPauseCircle}/></Badge> Waiting</span>
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

  settings = () => {
    if(this.state.settings) this.setState({settings: false})
    else this.setState({settings: true})
  }


  render() {
    this.printersTabs(4)
    this.UpdatePrintTab()
    // const socket = socketIOClient(this.state.endpoint)
    socket.on('change color', (col) => {
     document.body.style.backgroundColor = col
   })
   let mainDiv;
   if(this.state.settings) mainDiv = <div> Impostazioni </div>
   else mainDiv = <div><Nav tabs>{elementPrintersTabs}</Nav>{CurrentPrinter}</div>
      return (
        <div className="container-fluid">
          <Navbar type="dark" expand="true" theme="primary">
            <NavbarBrand href="/">Home</NavbarBrand>
            <Nav navbar>
              <NavItem>
                <NavLink onClick={this.settings}><FontAwesomeIcon icon={faCog}/></NavLink>
              </NavItem>
            </Nav>
          </Navbar>
          {mainDiv}
        </div>
      )
  }

}

export default App;
