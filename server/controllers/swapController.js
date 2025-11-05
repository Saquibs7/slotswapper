import Event from '../models/Event.js';
import SwapRequest from '../models/SwapRequest.js';

export const getSwappableSlots = async (req, res) => {
  const swappable = await Event.find({
    status: 'SWAPPABLE',
    user: { $ne: req.user.id },
  });
  res.json(swappable);
};

export const createSwapRequest = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  const mySlot = await Event.findOne({
    _id: mySlotId,
    user: req.user.id,
    status: 'SWAPPABLE',
  });
  const theirSlot = await Event.findOne({
    _id: theirSlotId,
    status: 'SWAPPABLE',
  });

  if (!mySlot || !theirSlot)
    return res.status(400).json({ error: 'Slots not swappable' });

  mySlot.status = 'SWAP_PENDING';
  theirSlot.status = 'SWAP_PENDING';
  await mySlot.save();
  await theirSlot.save();

  const swapRequest = await SwapRequest.create({
    requester: req.user.id,
    receiver: theirSlot.user,
    mySlot: mySlotId,
    theirSlot: theirSlotId,
  });
  res.json(swapRequest);
};

export const respondToSwapRequest = async (req, res) => {
  const { accept } = req.body;
  const swap = await SwapRequest.findById(req.params.requestId);
  if (!swap || swap.receiver.toString() !== req.user.id)
    return res.status(404).json({ error: 'Swap not found' });

  const mySlot = await Event.findById(swap.mySlot);
  const theirSlot = await Event.findById(swap.theirSlot);

  if (!accept) {
    swap.status = 'REJECTED';
    mySlot.status = 'SWAPPABLE';
    theirSlot.status = 'SWAPPABLE';
    await swap.save();
    await mySlot.save();
    await theirSlot.save();
    return res.json({ success: true });
  }
  const tempUser = mySlot.user;
  mySlot.user = theirSlot.user;
  mySlot.status = 'BUSY';
  theirSlot.user = tempUser;
  theirSlot.status = 'BUSY';
  swap.status = 'ACCEPTED';

  await mySlot.save();
  await theirSlot.save();
  await swap.save();

  res.json({ success: true });
};

export const getSwapRequests = async (req, res) => {
  const incoming = await SwapRequest.find({ receiver: req.user.id })
    .populate('mySlot theirSlot requester')
    .sort('-createdAt');

  const outgoing = await SwapRequest.find({ requester: req.user.id })
    .populate('mySlot theirSlot receiver')
    .sort('-createdAt');

  res.json({ incoming, outgoing });
};
