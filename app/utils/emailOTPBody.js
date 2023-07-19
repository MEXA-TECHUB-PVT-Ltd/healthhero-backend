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
  return `
  <!DOCTYPE html>
<html>

<head>
    <title>Welcome Email</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        .div0 {
            background-color: rgb(236, 236, 236);
            font-family: 'Open Sans', sans-serif;
            font-size: 16px;
        }

        .div1 {
            width: 100%;
            height: 110px;
            background-color: orange;
            position: relative;
        }

        h1 {
            font-size: 24px;
        }

        p {
            margin-bottom: 10px;
            padding: 10px 0px;
            word-spacing: 0.1em;
            font-size: 1rem;
        }

        a {
            color: #000;
            font-size: 1rem;
            /* text-decoration: none; */
        }

        .div1-img {
            position: relative;
            height: 100%;
            width: 5%;
            padding-top: 10px;
        }

        .div2-container {
            display: grid;
            grid-template-columns: 20% 60% 20%;
        }

        .grid-div1 {
            height: 110px;
            background-color: orange;
        }

        .div2 {
            position: relative;
            margin-top: 0px;
            width: 70%;
            background-color: white;
            margin-left: 0px;
            padding: 20px 20px;
            text-align: justify;
        }

        .div3 {
            position: relative;
            height: 100px;
            width: 60%;
            margin-top: 50px;
            margin-left: 20%;
            padding: 20px 20px;
            text-align: justify;
            background-color: rgb(255, 234, 194);
        }

        .button {
            background-color: #0072C6;
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        th,
        td {
            border: 0px;
            padding: 8px;
            text-align: center;
            font-weight: 500;
        }
    </style>
</head>

<body>
    <div class="div0">
        <div class="div1">
            <center><img class="div1-img" src="https://drive.google.com/file/d/1SJbTAoHmmUUq_uQ5Bu5oL6JWniGt9R-b/view?usp=sharing"></img></center>
        </div>
        <table>
            <tr>
                <th class="grid-div1"></th>
                <th class="div2">
                    <center>
                        <h1>Welcome!</h1>
                    </center>

                </th>
                <th class="grid-div1"></th>
            </tr>
            <tr>
                <th></th>
                <th class="div2">
                    <p>
                        Welcome to Health Hero! We're thrilled to have you on board and want to extend a warm welcome to our
                        growing community. Get ready to unlock a world of possibilities and make the most of your experience
                        with our app.
                    </p>
                    <p>At Health Hero, our mission is to keep you fit and healthy with daily weekly workout plans. Whether
                        you're looking to stay smart, strong and healthy, or finding a good nutrition plan, we've got you
                        covered!</p>
                    <p><b>we provide you with:</b></p>
                    <p>1. 7x4 challenges</p>
                    <p>2. 7x4 challenges</p>
                    <p>3. Diet plans</p>
                    <p>4. Daily water consumption tracker</p>
                    <p>5. BMI calculation for fitness</p>
                    <p>6. Reminders for workout</p>
                    <p>We're thrilled to have you as part of our community, and we can't wait to see what you'll accomplish
                        with Health Hero. Join us on this journey as we strive to make your workout experience even better.
                    </p>
                    <p>Thank you once again for choosing Health Hero. We're excited to have you here!</p>
                    <p>Cheers,</p>
                    <p>The Health Hero Team</p>
                </th>
                <th></th>
            </tr>
        </table>
    
        <div class="div3">
            <center>
                <p>Need more help?</p>
            </center>
            <center><a href="mailto:gmail@gmail.com">We're here, ready to talk</a></center>
        </div><br><br>
    </div>
</body>

</html>
    `
}
module.exports = { emailOTPBody, thankYouEmailBody }