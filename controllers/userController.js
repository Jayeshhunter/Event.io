const Club = require("../models/club");
const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const validator = require("email-validator");

module.exports.eventDetailsUser_get = (req, res) => {
  console.log(req.params.id);
  Club.find({ "events._id": req.params.id }, (err, result) => {
    var allInterns = result[0].events.find((x) => x.title === req.params.title);
    console.log(allInterns, result[0].clbName);
    res.render("eventDetailsUser", {
      image: allInterns.imageName,
      details: allInterns.details,
      title: allInterns.title,
      club: result[0].clbName,
      user: req.params.user,
      eventId: req.params.id,
      location: allInterns.location,
    });
  });
};

module.exports.eventDetailsUserF_get = (req, res) => {
  const under = {
    participate: req.params.eventId,
  };
  const token = req.cookies.jwt;
  let decoded = 0;
  if (token) {
    jwt.verify(token, "secretkey", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        decoded = decodedToken.id;
      }
    });
  }
  console.log(decoded);
  let flag = 0;
  User.find({ _id: decoded }, (err, result) => {
    if (result) {
      console.log(result);

      let wal = result[0].events.find(
        (x) => x.participate === req.params.eventId
      );
      if (wal) {
        flag = 1;
      }
    } else {
      res.render("error");
    }
  });
  if (flag === 0) {
    User.findOneAndUpdate(
      { username: req.params.username },
      { $push: { "$.events": under } },
      (err, result) => {
        console.log("events", result);
        if (err) {
          res.render("error");
        }
      }
    );

    User.find({ username: req.params.username }, (err, result) => {
      if (err) {
        res.render("error");
      } else {
        const newtask1 = {
          id: result[0]._id,
          username: result[0].username,
          email: result[0].email,
        };
        console.log(newtask1);
        // const arr = [];
        // arr.push(newtask1);

        Club.findOneAndUpdate(
          { "events.title": req.params.title },
          { $addToSet: { "events.$.reg": newtask1 } },
          { upsert: true },
          (err, result) => {
            if (err) {
              res.render("error");
            } else {
              console.log(result);
              var spt = result.events.find((x) => x.title === req.params.title)
                .gmeet;
              var special = result.events.find(
                (x) => x.title === req.params.title
              ).reg;

              async function main() {
                // Generate test SMTP service account from ethereal.email
                // Only needed if you don't have a real mail account for testing

                let testAccount = await nodemailer.createTestAccount();

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                  // SES: new aws.SES({
                  //   apiVersion: "2010-12-01",
                  // }),
                  // sendingRate: 1,
                  pool: true,
                  service: "gmail",
                  // true for 465, false for other ports
                  auth: {
                    user: "jj6144@srmist.edu.in",
                    pass: "SRMworld$2468",
                  },
                });

                let info = await transporter.sendMail({
                  from: "jj6144@srmist.edu.in", // sender address
                  to: newtask1.email, // list of receivers
                  subject: "Event.io", // Subject line

                  html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                  <head>
                  <!--[if gte mso 9]>
                  <xml>
                    <o:OfficeDocumentSettings>
                      <o:AllowPNG/>
                      <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                  </xml>
                  <![endif]-->
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta name="x-apple-disable-message-reformatting">
                    <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
                    <title></title>
                    
                      <style type="text/css">
                        a { color: #0000ee; text-decoration: underline; }
                  @media only screen and (min-width: 620px) {
                    .u-row {
                      width: 600px !important;
                    }
                    .u-row .u-col {
                      vertical-align: top;
                    }
                  
                    .u-row .u-col-100 {
                      width: 600px !important;
                    }
                  
                  }
                  
                  @media (max-width: 620px) {
                    .u-row-container {
                      max-width: 100% !important;
                      padding-left: 0px !important;
                      padding-right: 0px !important;
                    }
                    .u-row .u-col {
                      min-width: 320px !important;
                      max-width: 100% !important;
                      display: block !important;
                    }
                    .u-row {
                      width: calc(100% - 40px) !important;
                    }
                    .u-col {
                      width: 100% !important;
                    }
                    .u-col > div {
                      margin: 0 auto;
                    }
                  }
                  body {
                    margin: 0;
                    padding: 0;
                  }
                  
                  table,
                  tr,
                  td {
                    vertical-align: top;
                    border-collapse: collapse;
                  }
                  
                  p {
                    margin: 0;
                  }
                  
                  .ie-container table,
                  .mso-container table {
                    table-layout: fixed;
                  }
                  
                  * {
                    line-height: inherit;
                  }
                  
                  a[x-apple-data-detectors='true'] {
                    color: inherit !important;
                    text-decoration: none !important;
                  }
                  
                  </style>
                    
                    
                  
                  <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Cabin:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
                  
                  </head>
                  
                  <body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff">
                    <!--[if IE]><div class="ie-container"><![endif]-->
                    <!--[if mso]><div class="mso-container"><![endif]-->
                    <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
                    <tbody>
                    <tr style="vertical-align: top">
                      <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
                      
                  
                  <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #dcdcdc;">
                      <div style="border-collapse: collapse;display: table;width: 100%;background-image: url('/assests/image-2.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;">
                        
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                    
                  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                      <tr>
                        <td style="overflow-wrap:break-word;word-break:break-word;padding:67px 11px 11px;font-family:'Cabin',sans-serif;" align="left">
                          
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-right: 0px;padding-left: 0px;" align="center">
                        
                        <img align="center" border="0" src="data:image/jpeg;base64,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" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 26%;max-width: 150.28px;" width="150.28"/>
                        
                      </td>
                    </tr>
                  </table>
                  
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                      <tr>
                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 225px;font-family:'Cabin',sans-serif;" align="left">
                          
                    <div style="color: #000000; line-height: 140%; text-align: center; word-wrap: break-word;">
                      <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 30px; line-height: 42px; font-family: Cabin, sans-serif;"><strong><span style="line-height: 42px; font-size: 30px;">Event.io</span></strong></span></p>
                    </div>
                  
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                    <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                      </div>
                    </div>
                  </div>
                  
                  
                  
                  <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #fcf9f8;">
                      <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #fcf9f8;"><![endif]-->
                        
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                    
                  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                      <tr>
                        <td style="overflow-wrap:break-word;word-break:break-word;padding:44px 10px 14px;font-family:'Cabin',sans-serif;" align="left">
                          
                    <div style="color: #000000; line-height: 140%; text-align: center; word-wrap: break-word;">
                      <p style="font-size: 14px; line-height: 140%;"><span style="font-family: Cabin, sans-serif; font-size: 14px; line-height: 19.6px;"><span style="font-size: 26px; line-height: 36.4px;"><strong><span style="line-height: 36.4px; font-size: 26px;">Message from Event.io</span></strong></span></span></p>
                    </div>
                  
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                      <tr>
                        <td style="overflow-wrap:break-word;word-break:break-word;padding:4px 55px 10px;font-family:'Cabin',sans-serif;" align="left">
                          
                    <div style="color: #000000; line-height: 170%; text-align: center; word-wrap: break-word;">
                      <p style="font-size: 14px; line-height: 170%;"><span style="font-family: Cabin, sans-serif; font-size: 18px; line-height: 30.6px;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore m</span></p>
                    </div>
                  
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                      <tr>
                        <td style="overflow-wrap:break-word;word-break:break-word;padding:4px 55px 10px;font-family:'Cabin',sans-serif;" align="left">
                          
                    <div style="color: #000000; line-height: 170%; text-align: center; word-wrap: break-word;">
                      <p style="font-size: 14px; line-height: 170%;"><span style="font-family: Cabin, sans-serif; font-size: 16px; line-height: 27.2px;"><span style="font-size: 18px; line-height: 30.6px;">Use code</span> <span style="font-size: 18px; line-height: 30.6px;"><strong>xxxxxx</strong> to get a <strong>10% </strong>off on home and&nbsp;</span></span></p>
                  <p style="font-size: 14px; line-height: 170%;"><span style="font-family: Cabin, sans-serif; font-size: 16px; line-height: 27.2px;"><span style="font-size: 18px; line-height: 30.6px;">office decor, out team will ensure a safe and faster</span></span></p>
                  <p style="font-size: 14px; line-height: 170%;"><span style="font-family: Cabin, sans-serif; font-size: 16px; line-height: 27.2px;"><span style="font-size: 18px; line-height: 30.6px;">delivery!</span></span></p>
                    </div>
                  
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                      <tr>
                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 55px;font-family:'Cabin',sans-serif;" align="left">
                          
                  <div align="center">
                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;font-family:'Cabin',sans-serif;"><tr><td style="font-family:'Cabin',sans-serif;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://localhost:5000/" style="height:46px; v-text-anchor:middle; width:207px;" arcsize="8.5%" stroke="f" fillcolor="#34495e"><w:anchorlock/><center style="color:#e3e0f0;font-family:'Cabin',sans-serif;"><![endif]-->
                      <a href=${spt} target="_blank" style="box-sizing: border-box;display: inline-block;font-family:'Cabin',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #e3e0f0; background-color: #34495e; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
                        <span style="display:block;padding:13px 55px;line-height:120%;"><span style="font-family: Cabin, sans-serif; font-size: 16px; line-height: 19.2px;"><span style="line-height: 19.2px; font-size: 16px;">Join Meet</span></span></span>
                      </a>
                    <!--[if mso]></center></v:roundrect></td></tr></table><![endif]-->
                  </div>
                  
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                    <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                      </div>
                    </div>
                  </div>
                  
                  
                  
                  <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #fff5ee;">
                      <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #fff5ee;"><![endif]-->
                        
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                    
                    <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                      </div>
                    </div>
                  </div>
                  
                  
                  
                  <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #184e5a;">
                      <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #184e5a;"><![endif]-->
                        
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                    
                  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                      <tr>
                        <td style="overflow-wrap:break-word;word-break:break-word;padding:44px 55px;font-family:'Cabin',sans-serif;" align="left">
                          
                    <div style="color: #ffffff; line-height: 230%; text-align: center; word-wrap: break-word;">
                      <p style="font-size: 14px; line-height: 230%;"><strong><span style="font-family: Cabin, sans-serif; font-size: 18px; line-height: 41.4px;">★ ★ ★ ★ ★</span></strong></p>
                  <p style="font-size: 14px; line-height: 230%;"><em><span style="font-family: Cabin, sans-serif; font-size: 18px; line-height: 41.4px;">"The product is very helpful for everyone who used to get free courses online"</span></em></p>
                  <p style="font-size: 14px; line-height: 230%;"><em><span style="font-family: Cabin, sans-serif; font-size: 18px; line-height: 41.4px;">- Customer Name</span></em></p>
                    </div>
                  
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                    <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                      </div>
                    </div>
                  </div>
                  
                  
                  
                  <div class="u-row-container" style="padding: 0px 0px 17px;background-color: transparent">
                    <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                      <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px 0px 17px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
                        
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                    
                  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                      <tr>
                        <td style="overflow-wrap:break-word;word-break:break-word;padding:23px 10px 10px;font-family:'Cabin',sans-serif;" align="left">
                          
                  <div align="center">
                    <div style="display: table; max-width:31px;">
                    <!--[if (mso)|(IE)]><table width="31" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:31px;"><tr><![endif]-->
                    
                      
                      <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
                      <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                        <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                          <a href="https://instagram.com/" title="Instagram" target="_blank">
                            <img src="data:image/png;base64,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" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                          </a>
                        </td></tr>
                      </tbody></table>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      
                      
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                  
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                      <tr>
                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
                          
                    <div style="color: #575758; line-height: 170%; text-align: center; word-wrap: break-word;">
                      <p style="font-size: 14px; line-height: 170%;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit,</p>
                  <p style="font-size: 14px; line-height: 170%;">sed diam nonummy nibh euismod tincidunt ut</p>
                  <p style="font-size: 14px; line-height: 170%;">laoreet dolore magna aliquam era</p>
                    </div>
                  
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                    <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                      </div>
                    </div>
                  </div>
                  
                  
                      <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                    </tbody>
                    </table>
                    <!--[if mso]></div><![endif]-->
                    <!--[if IE]></div><![endif]-->
                  </body>
                  
                  </html>
                  `,
                  // plain text body
                  // html: "<b>Hello world?</b>", // html body
                });

                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                // Preview only available when sending through an Ethereal account
                console.log(
                  "Preview URL: %s",
                  nodemailer.getTestMessageUrl(info)
                );
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                //}

                // send mail with defined transport object
              }
              if (flag === 0) {
                main().catch(console.error);
              }
              console.log(special);
              res.render("eventDetailsUserf", {
                gmeet: spt,
                location: result.location,
              });
            }
          }
        );
      }
    });
  }
  flag = 0;
};
