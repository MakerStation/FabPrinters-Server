//QUESTO è DA RIFARE


class Printers {

  constructor() {
    this.total = 4

    this.status = {1: "Printing", 2: "Paused", 3: "Warning", 4: "Error", 5: "Ready", 6:"Disconnected", 7:"Heating"};
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
