import React from 'react'
import {
  Progress,
  Button,
  FormInput,
  Row,
  Col
} from 'shards-react'
import './App.css';
import Cmd from "./Cmd.js"
import axios from "axios"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCog, faPlayCircle, faCheckCircle, faExclamationCircle, faPauseCircle, faTimesCircle, faExclamationTriangle, faThermometerHalf, faListAlt } from "@fortawesome/free-solid-svg-icons";

var progressBar, connectForm = null
export default class Tab extends React.Component {

    constructor(props){
      super(props)
      this.state = {
        comandi: 0,
        update: 1,
        uploadFile: null
      }
      this.commandDiv = []
      this.commandLog = []
    }

    componentDidMount(){
      console.log(this.commandDiv)
      console.log(this.commandLog)
      this.props.socket.on("new command from printer", (id, command) => {
        if(this.props.number == id){
          // console.log(command)
          this.commandLog.push(new Cmd(command, 1, new Date()))
          this.commandUpdate()
        }
      })
      this.props.socket.on("new command from client", (id, command) => {
        if(this.props.number == id){
          // console.log(command)
          this.commandLog.push(new Cmd(command, 3, new Date()))
          this.commandUpdate()
        }
      })
      this.props.socket.on("switch print tab", id => {
        this.commandDiv = []
        this.commandLog = []
        this.readCommandsFromFile(id)
        this.commandUpdate();
      })
    }

    async readCommandsFromFile(id){
      await fetch("http://localhost:3001/commandlog?id="+id).then(response => response.json()).then(async response => {
        response.dati.forEach(l => {
          console.log(l)
          this.commandLog.push(new Cmd(l.command, l.sender, new Date(parseInt(l.date))))
        })
      }).catch(e => console.log(e))
      this.commandUpdate();
    }

    ProgBar(){
      if(this.props.status === "Printing" || this.props.status === "Warning")
      progressBar = <Progress theme="success" value={this.props.progress} animated className="progressBar" barClassName="progressBar">Printing: {this.props.progress}%</Progress>;
      else if (this.props.status === "Paused")
      progressBar = <Progress theme="warning" value={this.props.progress} striped className="progressBar" barClassName="progressBar">Paused: {this.props.progress}%</Progress>;
      else
      progressBar = null
    }

    ConnForm(){
      let playPauseBtn = null
      let cancelBtn = <Button theme = "danger" onClick={this.Cancel}><FontAwesomeIcon icon={faTimesCircle}/> Cancel</Button>
      if(this.props.status === "Paused" || this.props.status === "Ready" || this.props.status === "Error" || this.props.status === "Waiting")
      playPauseBtn = <Button theme = "success" onClick={this.Play}><FontAwesomeIcon icon={faPlayCircle}/> Print</Button>
      if(this.props.status === "Printing" || this.props.status === "Heating" || this.props.status === "Warning")
      playPauseBtn = <Button theme = "warning" onClick={this.Pause}><FontAwesomeIcon icon={faPauseCircle}/> Pause</Button>
      let logBtn = <Button theme = "secondary" onClick={this.openLog}><FontAwesomeIcon icon={faListAlt}/> Log</Button>

      connectForm = <div>{playPauseBtn} {cancelBtn} {logBtn}</div>
    }

    Play = () => {
      this.props.socket.emit("status update", this.props.number, "Printing")
      console.log("Printing")
    }

    Pause = () => {
      this.props.socket.emit("status update", this.props.number, "Paused")
      console.log("Pause")
    }

    Cancel = () => {
      this.props.socket.emit("status update", this.props.number, "Ready")
      console.log("Cancel")
    }

    openLog = () => {
      window.location.href="http://localhost:3001/commandlogcomplete?id="+this.props.number
    }

    async send(e){
      console.log("qwe")
      let value = document.getElementById("Comando").value
      if (!value) return
      this.commandLog.push(new Cmd(value, 2, new Date()))
      this.props.socket.emit("new command", this.props.number, value, data => {
        console.log(data)
      })
      this.setState({comandi: this.state.comandi +1})
      this.commandDiv = []
      for (var i = Math.max(this.commandLog.length-16, 0); i < this.commandLog.length; i++) {
        this.commandDiv.push(<div>{this.commandLog[i].toHtml()}</div>)
      }
      this.commandUpdate()
      document.getElementById("Comando").value = ""
    }

    async commandUpdate(){
      this.commandDiv = []
      for (var i = Math.max(this.commandLog.length-16, 0); i < this.commandLog.length; i++) {
        this.commandDiv.push(<div>{this.commandLog[i].toHtml()}</div>)
      }
    }

    keyListenerCommand(e) {
      let keyCode = (e.keyCode ? e.keyCode : e.which)
      if(keyCode == 13){
        this.send()
      }
    }

    fileUpload = () => {
      let file = this.state.uploadFile
      var data = new FormData();
      data.append("file", document.getElementById("fileInput").files[0]);
      axios.post("http://localhost:3001/uploadfile", data, {
        // receive two    parameter endpoint url ,form data
      })
    }

    render(){
      this.ProgBar()
      this.ConnForm()


      return (
        <div>
          <input id="fileInput" type="file" name="file" className="btn btn-primary fileUpload"/><span>&nbsp;</span>
          {/*<label  for="fileInput" className="btn btn-primary">Choose File</label>*/}
          <Button onClick={this.fileUpload}>Upload</Button>
          {progressBar}
          <br/>
          {connectForm}
          <br/>
          <div className="commandLog">{this.commandDiv}</div>
          <br/>
          <div>
          <Row>
            <Col><FormInput placeholder="Comando" id="Comando" className="inputTab" onKeyPress={(e) => this.keyListenerCommand(e)}></FormInput></Col>
            <Col><Button onClick={(e) => this.send(e)} className="inputBtn">Send</Button></Col>
            <Col></Col>
          </Row>
        </div>
        </div>


      )
    }
  }
