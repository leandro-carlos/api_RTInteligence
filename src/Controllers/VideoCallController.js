const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");

const { Op } = require("sequelize");
const { api_channels } = require("../Models/index");

const appId = "51789cde1f9047c6b96a865b5bf6921a";
const appCertificate = "ca840f0d5fe8405d94ec083876cd6ca4";
const role = RtcRole.PUBLISHER;
const expirationTimeInSeconds = 42220;
const currentTimestamp = Math.floor(Date.now() / 1000);
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

const newDate = new Date();

class VideoCallController {
  static getVideoToken = async (req, res) => {
    //connect
    const uid = req.body.id;

    let channelName;
    let initialHour;

    function checkTwoUsers(obj) {
      return obj.usersOnline === 2;
    }
    function checkOneUser(obj) {
      return obj.usersOnline === 1;
    }
    function checkZeroUsers(obj) {
      return obj.usersOnline === 0;
    }

    async function updateChannel(id) {
      api_channels.update(
        { usersOnline: 0, status: "offline", startHour: null },
        {
          where: {
            id: id,
          },
        }
      );
    }

    async function updtadeAfkChannel(id) {
      api_channels
        .findOne({
          where: {
            id: id,
          },
        })
        .then((data) => {
          if (data.dataValues.usersOnline === 1) {
            api_channels.update(
              { usersOnline: 0, status: "offline" },
              { where: { id: id } }
            );
          } else {
            return;
          }
        });
    }

    try {
      await api_channels
        .findAll({
          where: {
            usersOnline: { [Op.lt]: 3 },
            status: "offline",
          },
        })
        .then((data) => {
          const channelWithTwoUsers = data.find(checkTwoUsers);
          if (channelWithTwoUsers !== undefined) {
            api_channels.update(
              { usersOnline: 3, status: "online" },
              { where: { id: channelWithTwoUsers.dataValues.id } }
            );
            channelName = channelWithTwoUsers.dataValues.name;
            initialHour = channelWithTwoUsers.dataValues.initialHour;
          } else {
            const channelWithOneUser = data.find(checkOneUser);
            if (channelWithOneUser !== undefined) {
              api_channels.update(
                { usersOnline: 2, startHour: newDate },
                { where: { id: channelWithOneUser.dataValues.id } }
              );
              channelName = channelWithOneUser.dataValues.name;
              initialHour = newDate;
              setTimeout(() => {
                updateChannel(channelWithOneUser.dataValues.id);
              }, 1200000);
            } else {
              const channelWithZeroUsers = data.find(checkZeroUsers);
              if (channelWithZeroUsers !== undefined) {
                channelName = channelWithZeroUsers.dataValues.name;
                initialHour = newDate;
                api_channels.update(
                  { usersOnline: 1, startHour: newDate },
                  { where: { id: channelWithZeroUsers.dataValues.id } }
                );
                setTimeout(() => {
                  updtadeAfkChannel(channelWithZeroUsers.dataValues.id);
                }, 180000);
              } else {
                return res.status(200).send({
                  status: false,
                  message: "não há canais disponiveis!",
                });
              }
            }
          }

          res.status(200).send({
            channelName: channelName,
            // token: tokenA,
            initialHour: initialHour,
            now: newDate,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  static reconect = async (req, res) => {
    console.log(req.body);
    const name = req.body.channelName;
    api_channels
      .findOne({
        where: {
          name: name,
        },
      })
      .then((data) => {
        console.log(data);
        if (data !== null) {
          if (data.dataValues.usersOnline > 0) {
            res.status(200).send({
              status: true,
              user: data.dataValues.usersOnline,
              initialHour: data.dataValues.initialHour,
              now: newDate,
            });
          } else {
            res.status(200).send({
              status: false,
            });
          }
        } else {
          res.status(200).send({
            status: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

module.exports = VideoCallController;
