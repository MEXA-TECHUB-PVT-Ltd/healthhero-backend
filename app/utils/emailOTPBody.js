function emailOTPBody(year, content) {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>

    </head>
    
    <body style="background-color: #00000012;margin: 0;
    padding: 0;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;"><br/>
    <center>
    <div style="max-width: 420px; margin-top: 4%; margin-bottom: 4%; background-color: white; text-align: justify;">
            <div style = "height: 65px; background-color: transparent; position: relative; margin-bottom: 40px;">
                <br/><center><img style="position: relative; margin-top: 8px; width: 110px; height: 60px;" src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1690269791112--logo1.png" />
                </center>
            </div>
            
                    <div style="padding: 3% 10%; margin-bottom: 40px;">
                        ${content}
                    </div>
               
            <center>
                <p style="color: black;
                margin-bottom: 20px;"><b>Download Our App Now</b></p>
            </center>
            <center>
                <div style="margin-top: 0%;">
                <a href="https://play.google.com/store/apps/details?id=com.healthheromtechub" target="_blank"><img style="cursor: pointer;" height="52px" width="130px"
                        src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1690196807681--appstore.jpg" /></a>
                    <a href="https://play.google.com/store/apps/details?id=com.healthheromtechub" target="_blank"><img
                            style="cursor: pointer;" height="52px" width="130px"
                            src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1690196760645--playstore%20(2).png" /></a>
                </div>
            </center>
            <div style="margin-top: 2%;">
                <center>
                    <p style="font-size: 10px;
                    color: rgb(122, 122, 122) !important;
                    text-decoration:none;
                    margin-bottom: 20px;"><a style="font-size: 10px;
                    color: rgb(122, 122, 122) !important;
                    text-decoration:none;
                    margin-bottom: 20px;" href="mailto:info@healthhero.club">info@healthhero.club</a> | <a style="font-size: 10px;
                    color: rgb(122, 122, 122) !important;
                    text-decoration:none;
                    margin-bottom: 20px;" href="mailto:info@healthhero.club">healthhero.info@gmail.com</a></p>
                </center>
                <center>
                    <div style="margin-top: 1%;">
                        <a href="https://www.facebook.com/" target="_blank"><img style="cursor: pointer !important;
                        margin: 0 5px;" height="20px"
                        width="20px"
                                src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1690281104841--icons8-facebook-480.png" /></a>
                        <a href="https://www.instagram.com/" target="_blank">
                            <img style="cursor: pointer !important;
                            margin: 0 5px;" height="20px"
                            width="20px"
                                src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1690281208209--icons8-instagram-480.png" /></a>
                        <a href="https://www.linkedin.com/" target="_blank"><img style="cursor: pointer !important;
                        margin: 0 5px;" height="20px"
                        width="20px"
                                src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1690281050481--icons8-linkedin-500.png" /></a>
                    </div>
                </center>
            </div><br/>
            <center>
                <div>
                    <p style="font-size: 10px;
                    color: rgb(122, 122, 122) !important;
                    text-decoration:none;
                    margin-bottom: 20px;">All rights reserved at M TECHUB LLC ${year}</p>
                </div><br/> 
            </center>
            </div>
            </center><br/>
    </body>
    
    </html>`
}
module.exports = { emailOTPBody }
