/* eslint semi: ["error", "always"] */
/* eslint padded-blocks: ["error", { "classes": "always" }] */
/* global Boarding SEvent Daycare */

// eslint-disable-next-line no-unused-vars
class Dog {

  constructor () {
    let args = arguments[0];
    if (args.bookings) this.loadJSON(args); // Loading from JSON

    else if (args.name) { // Adding a new Dog
      this.name = args.name;
      this.cName = args.cName;
      this.bookings = [];
      this.ID = SEvent.getNewID();
    }
  }

  loadJSON (json) {
    this.name = json.name;
    this.cName = json.cName;
    this.ID = json.ID ? json.ID : SEvent.getNewID();
    this.bookings = [];

    for (let booking of json.bookings) {
      if (booking.start) this.addBooking(booking.start, booking.end);
      else if (booking.date) this.addDaycare(booking.date);
    }
  }

  addBoarding (start, end) { this.bookings.push(new Boarding(start, end)); }
  addDaycare (date) { this.bookings.push(new Daycare(date)); }

  getName () { return this.name; }
  getBookings () { return this.bookings; }

  getBooking (date) {
    let filteredBookings = this.bookings.filter(booking => booking.contains(date));
    return filteredBookings[filteredBookings.length - 1];
  }

  get (date) {
    if (!this.getLastBooking()) return;

    let booking = this.getBookings(date);
    let dogStatus = booking.dateType(date);

    let text;
    if (dogStatus === 'arriving') {
      text = this.getText() + ' (' + booking.getStartTime() + ')';
    } else if (dogStatus === 'departing') {
      text = this.getText() + ' (' + booking.getEndTime() + ')';
    } else if (dogStatus === 'daycare') {
      text = this.getText() + ' (8:00 AM)';
    } else {
      text = this.getText();
    }
    return dogStatus ? {text: text, color: dogStatus, id: this.ID} : undefined;
  }

  getText () {
    return this.name + (this.cName ? ' ' + this.cName[0] : '');
  }

  serialize () { return JSON.stringify({obj: this, type: 'Dog'}); };

}
