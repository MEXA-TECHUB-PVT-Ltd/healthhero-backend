function emailOTPBody(otp, companyName, color) {

  return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: ${color};text-decoration:none;font-weight:600">${companyName}</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing ${companyName}. Use the following OTP to complete your procedures.</p>
      <h2 style="background: ${color};margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
      <p style="font-size:0.9em;">Regards,<br />${companyName}</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>${companyName}:</p>
        <p>Address</p>
        <p>Country</p>
      </div>
    </div>
  </div>`
}
function thankYouEmailBody(companyName, recipient_name) {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        .nav {
            height: 65px;
            background-color: rgb(49, 132, 255);
            position: relative;
        }

        .nav img {
            position: relative;
            margin-top: 8px;
            width: 9%;
            height: 75%;
        }

        .bg-img {
            width: 100%;
            height: 220px;
        }

        .body-div {
            padding: 3% 10%;
        }

        .header {
            padding-top: 1%;
            padding-bottom: 1%;
            font-style: italic;
        }

        .main {
            max-width: 420px;
            margin-top: 2%;
            margin-bottom: 1%;
            background-color: white;
            text-align: justify;
        }

        .body-class {
            background-color: #00000012;
        }
        .last-div{
            margin-top: 5%;
        }
        .last-img{
            cursor: pointer;
        }
        .btn{
            margin-top: 2%;
            height: 50px;
            width: 160px;
            border-radius: 80px;
            border: 0px;
            background-color: rgb(49, 132, 255);
            color: white;
            font-weight: 600;
        }
    </style>
</head>

<body class="body-class">
    <center><div class="main">
        <div class="nav">
            <center><img src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1689760004459--logo.png" />
            </center>
        </div>
        <img class="bg-img" src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1690200614974--chest_intermediate.jpg" />
        <div class="body-div">
            <h2 class="header">Welcome, Dear User</h2>
            <p>
                Thank you for registering with <b>Health Heros.</b>
            </p><br/>
            <p>At Health Hero, our mission is to keep you fit and healthy with daily weekly workout plans. Whether
                you're looking to stay smart, strong and healthy, or finding a good nutrition plan, we've got you
                covered!</p>
            <p>Please click the link below to visit our website</p>
            <center><a href="http://www.healthhero.club" target="_blank"><button class="btn">Visit Website</button></a></center>
            <p class="header"><b>Cheers,</b></p>
            <p>The Health Hero Team</p>
        </div>
    </div></center>
    <center>
        <p><b>Download Our App Now</b></p>
    </center>
    <center><div class="last-div">
        <img class="last-img" height="15%" width="15%" src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1690196807681--appstore.jpg" />
        <a href="https://play.google.com/store/apps/details?id=com.healthheromtechub" target="_blank"><img class="last-img" height="16%" width="16%" src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1690196760645--playstore%20(2).png" /></a>
    </div></center>
</body>

</html>`
}
module.exports = { emailOTPBody, thankYouEmailBody }