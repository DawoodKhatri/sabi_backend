const moment = require("moment");

exports.generateSlots = (start_time, end_time) => {
  start_time = moment("01/01/2022 " + start_time, "MM/DD/YYYY hh:mm A");
  end_time = moment("01/01/2022 " + end_time, "MM/DD/YYYY hh:mm A");
  const time_slots = [];

  while (start_time < end_time) {
    const time_slot =
      start_time.format("hh:mm A") +
      " - " +
      start_time.add(1, "hour").format("hh:mm A");
    time_slots.push(time_slot);
  }

  return time_slots;
};
