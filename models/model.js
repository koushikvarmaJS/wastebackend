//This file defines the data model for your application. 
//It maps the data structure in DynamoDB to JavaScript objects.

// model.js
class Item {
    constructor(id, name, quantity, price, description) {
      this.id = id;
      this.name = name;
      this.quantity = quantity;
      this.price = price;
      this.description = description;
      this.createdAt = new Date();
    }
  
    // Example method to calculate total value
    calculateTotalValue() {
      return this.quantity * this.price;
    }
  }

module.exports = Item;
  