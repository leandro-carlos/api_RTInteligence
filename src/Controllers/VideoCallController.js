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
const expirationTimeInSeconds = 133600;
const currentTimestamp = Math.floor(Date.now() / 1000);
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

class VideoCallController {
  static getVideoToken = async (req, res) => {
    //connect
    const uid = req.body.id;

    let channelName;

    try {
      await api_channels
        .findAll({
          where: {
            usersOnline: { [Op.lt]: 3 },
            status: "offline",
          },
        })
        .then((data) => {
          function checkTwoUsers(obj) {
            return obj.usersOnline === 2;
          }
          function checkOneUser(obj) {
            return obj.usersOnline === 1;
          }
          function checkZeroUsers(obj) {
            return obj.usersOnline === 0;
          }

          const channelWithTwoUsers = data.find(checkTwoUsers);
          if (channelWithTwoUsers !== undefined) {
            api_channels.update(
              { usersOnline: 3, status: "online" },
              { where: { id: channelWithTwoUsers.dataValues.id } }
            );
            channelName = channelWithTwoUsers.dataValues.name;
          } else {
            const channelWithOneUser = data.find(checkOneUser);
            if (channelWithOneUser !== undefined) {
              api_channels.update(
                { usersOnline: 2 },
                { where: { id: channelWithOneUser.dataValues.id } }
              );
              channelName = channelWithOneUser.dataValues.name;
              setTimeout(() => {
                api_channels.update(
                  { usersOnline: 0, status: "offline", minStart: null },
                  {
                    where: {
                      id: channelWithOneUser.dataValues.id,
                    },
                  }
                );
              }, 600000);
            } else {
              const channelWithZeroUsers = data.find(checkZeroUsers);
              if (channelWithZeroUsers !== undefined) {
                channelName = channelWithZeroUsers.dataValues.name;
                api_channels.update(
                  { usersOnline: 1 },
                  { where: { id: channelWithZeroUsers.dataValues.id } }
                );
              } else {
                return res.status(200).send({
                  status: false,
                  message: "não há canais disponiveis!",
                });
              }
            }
          }

          // const tokenA = RtcTokenBuilder.buildTokenWithUid(
          //   appId,
          //   appCertificate,
          //   channelName,
          //   uid,
          //   role,
          //   privilegeExpiredTs
          // );

          res.status(200).send({
            channelName: channelName,
            // token: tokenA,
          });
        })
        .catch((err) => {
          console.log(err);
        });

      // console.log("Token with integer number Uid: " + tokenA);

      // res.status(200)
      // .send(tokenA);
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
            });
          } else {
            res.status(200).send({
              status: false,
            });
          }
        } else {
          res.status(200).send({
            status: "inexistente",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

module.exports = VideoCallController;
