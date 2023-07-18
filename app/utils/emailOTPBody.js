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
    <html>
    <head>
        <style>
            /* Add your custom CSS styles here */
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
            }}
            
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }}
            
            h1 {{
                color: #333;
                text-align: center;
            }}
            
            p {{
                margin-bottom: 10px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Thank You!</h1>
            <p>Dear ${recipient_name},</p>
            <p>Welcome to ${companyName}! We're thrilled to have you on board and want to extend a warm welcome to our growing community. Get ready to unlock a world of possibilities and make the most of your experience with our app.
            At Health Hero, our mission is to keep you fit and healthy with daily weekly workout plans. Whether you're looking to stay smart, strong and healthy, or finding a good nutrition plan, we've got you covered!</p>
            <p>We provide you with:</p>
            <p>1. 7x4 challenges</p>
            <p>2. Workplans</p>
            <p>3. Diet plans</p>
            <p>4. Daily water consumption tracker</p>
            <p>5. BMI calculation for fitness</p>
            <p>6. Reminders for workout</p>
            <p>We're thrilled to have you as part of our community, and we can't wait to see what you'll accomplish with [App Name]. Join us on this journey as we strive to make your workout experience even better.</p>
            <p>Thank you once again for choosing Health Hero. We're excited to have you here!</p>
          </div>
    </body>
    </html>
    `
}
module.exports = {emailOTPBody, thankYouEmailBody}