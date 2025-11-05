import Event from "../models/Event.js";

// ---------------- Get All Events for Logged-in User ----------------
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).sort("startTime");
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Server error fetching events" });
  }
};

// ---------------- Create a New Event ----------------
export const createEvent = async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;
    if (!title || !startTime || !endTime)
      return res.status(400).json({ error: "All fields are required" });

    const event = await Event.create({
      title,
      startTime,
      endTime,
      status: "BUSY",
      user: req.user.id,
    });

    res.json(event);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Server error creating event" });
  }
};

// ---------------- Update Event Status ----------------
export const updateEventStatus = async (req, res) => {
  try {
    const { eventId } = req.params; // 👈 must match route param
    const { status } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const event = await Event.findOneAndUpdate(
      { _id: eventId, user: req.user.id },
      { status },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error updating event status:", err);
    res.status(500).json({ error: "Server error updating event status" });
  }
};
