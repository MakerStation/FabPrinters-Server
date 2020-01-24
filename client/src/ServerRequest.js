//QUESTO è DA RIFARE


class Printers {

  constructor() {
    this.total = 4

    this.status = {1: "Printing", 2: "Paused", 3: "Waiting", 4: "Error", 5: "Ready", 6:"Disconnected", 7:"Heating", 8: "Warning"};
  }

  getTotal(){
    return this.total
  }

  getStatus(){
    return this.status
  }

  // class Printer {
  //   constructor() {
  //     fetch
  //   }
  // }



}


module.exports = {
  Printers
}
