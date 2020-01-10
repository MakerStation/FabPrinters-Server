import React from "react"
import Icon from '@mdi/react'
import { mdiPrinter3dNozzle } from '@mdi/js'
import AutoBind from "auto-bind"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptop } from "@fortawesome/free-solid-svg-icons";
import "./App.css"

const spazio = " - "

export default class cmd {
  constructor(command, sender, timestamp){  //string, int, time (sender 1:printer 2:client(myself) 3:client(other) )
    this.command = command
    this.sender = sender
    this.timestamp = /*timestamp.toLocaleDateString() + " "+*/ timestamp.toLocaleTimeString() +":"+ ("000"+timestamp.getMilliseconds()).slice(-3)
    AutoBind(this)
  }

  toHtml(){
    if(this.sender == 1){
      return(<div style={{color: 'orange'}} className="fontMonospace">
        <Icon path={mdiPrinter3dNozzle}
        size={0.68}
        color="orange"/>
        {spazio}
        {this.timestamp}
        {spazio}
        {this.command}
      </div>)
    }else if(this.sender == 2){
      return(<div style={{color: 'blue'}} className="fontMonospace">
        <FontAwesomeIcon icon={faLaptop}/>
        {spazio}
        {this.timestamp}
        {spazio}
        {this.command}
      </div>)
    }else if(this.sender == 3){
      return(<div style={{color: 'gray'}} className="fontMonospace">
        <FontAwesomeIcon icon={faLaptop}/>
        {spazio}
        {this.timestamp}
        {spazio}
        {this.command}
      </div>)
    }else {
      return(<div style={{color: 'black'}} className="fontMonospace">
        <FontAwesomeIcon icon={faLaptop}/>
        {spazio}
        {this.timestamp}
        {spazio}
        {this.command}
      </div>)
    }
  }
}
