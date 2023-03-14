const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");

const appId = "51789cde1f9047c6b96a865b5bf6921a";
const appCertificate = "ca840f0d5fe8405d94ec083876cd6ca4";
const channelName = "Canal teste";
const userAccount = "User account";
const role = RtcRole.PUBLISHER;
const expirationTimeInSeconds = 133600;
const currentTimestamp = Math.floor(Date.now() / 1000);
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
// Build token with uid

class VideoCallController {
  static getVideoToken = async (req, res) => {
    console.log(req.body.id);
    const uid = req.body.id;

    try {
      const tokenA = RtcTokenBuilder.buildTokenWithUid(
        appId,
        appCertificate,
        channelName,
        uid,
        role,
        privilegeExpiredTs
      );

      console.log("Token with integer number Uid: " + tokenA);

      res.status(200).send(tokenA);
    } catch (error) {}
  };
}

module.exports = VideoCallController;
