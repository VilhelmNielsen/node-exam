const { Channel, User, Message, Sequelize } = require('../models');

const $ = Sequelize.Op;

exports.getGlobalChat = async (req, res) => {
  // 1. get all messages
  const channel = await Channel.findOne({ where: { id: 1 } });
  const messages = await channel.getMessages({ include: [User] });
  // 2. Render the template
  res.render('chat', { title: 'Global Chat', chat: { id: channel.id, messages } });
};

exports.channelExists = async (req, res, next) => {
  // check if channel already exists

  /* if (channel) {
    res.redirect(`chat/${channel.id}`);
    return;
  } */
  next();
};

exports.addChannel = async (req, res) => {
  const channel = new Channel();
  await channel.save();
  await channel.addUsers([req.user.id, req.body.userId]);
  res.redirect(`/chat/${channel.id}`);
};

exports.showChannel = async (req, res) => {
  // TODO: get all messages belonging to the channel
  const chat = await Channel.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: User,
        where: {
          id: {
            [$.ne]: req.user.id,
          },
        },
      },
    ],
  });

  const {
    users: [{ name }],
  } = chat;

  res.render('chat', { title: `Chat with ${name}`, chat });
};

const getUserId = socket => {
  if (
    socket &&
    socket.handshake &&
    socket.handshake.session &&
    socket.handshake.session.passport &&
    socket.handshake.session.passport.user
  ) {
    return socket.handshake.session.passport.user;
  }
  return undefined;
};

exports.getUser = async (socket, next) => {
  const id = getUserId(socket);
  if (!id) {
    next(true);
    return;
  }
  const { name, photo } = await User.findById(id);
  socket.user = {
    id,
    name,
    photo,
  };
  next();
};

exports.addMessage = async ({ userId, channelId, content }) => {
  const message = new Message({ content });
  await Promise.all([message.setUser(userId, { save: false }), message.setChannel(channelId, { save: false })]);
  return message.save();
};
