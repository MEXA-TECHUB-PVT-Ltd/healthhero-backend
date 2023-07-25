function emailOTPBody(year, content) {
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
        font-family: Interstate;
    }

    .nav {
        height: 65px;
        background-color: transparent;
        position: relative;
    }

    .nav img {
        position: relative;
        margin-top: 8px;
        width: 110px;
        height: 60px;
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
        color: #FF6700;
        font: normal normal bold 24px/24px Interstate;
    }

    .main {
        max-width: 420px;
        margin-top: 4%;
        margin-bottom: 4%;
        background-color: white;
        text-align: justify;
    }

    .body-class {
        background-color: #00000012;
    }

    .last-div {
        margin-top: 0%;
    }

    .last-img {
        cursor: pointer;
    }

    .btn {
        margin-top: 1%;
        letter-spacing: 0.2em;
        height: 35px;
        width: 160px;
        border-radius: 10px;
        border: 0px;
        background-color: #FF6700;
        color: white;
        font-weight: 600;
        cursor: pointer;
    }

    .otp-btn {
        margin-top: 1%;

        height: 35px;
        width: 160px;
        border-radius: 10px;
        border: 0px;
        background-color: #FF6700;
        color: white;
        font-weight: 600;
        cursor: pointer;
        letter-spacing: 0.5em;
    }

    .footer-text {
        font-size: 12px;
        color: rgb(122, 122, 122) !important;
        text-decoration:none;
    }

    .footer-div {
        margin-top: 1%;
    }

    .footer-img {
        cursor: pointer;
        margin: 0 5px;
    }

    .footer {
        margin-top: 2%;
    }

    .first-img {
        margin-bottom: 5%;
    }
    .ptag-class{
        color: rgb(122, 122, 122);
    }
    .table-th {
        width: 90%;
    }
    .download-app-p{
        color: black;
    }
        </style>
    </head>
    
    <body class="body-class"><br/>
    <center>
    <div class="main">
            <div class="nav">
                <center><img src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1690269791112--logo1.png" />
                </center>
            </div>
            
                    <div class="body-div">
                        ${content}
                    </div>
                <br />
            <center>
                <p class="download-app-p"><b>Download Our App Now</b></p>
            </center>
            <center>
                <div class="last-div">
                    <img class="last-img" height="50px" width="130px"
                        src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1690196807681--appstore.jpg" />
                    <a href="https://play.google.com/store/apps/details?id=com.healthheromtechub" target="_blank"><img
                            class="last-img" height="50px" width="130px"
                            src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1690196760645--playstore%20(2).png" /></a>
                </div>
            </center>
            <div class="footer">
                <center>
                    <p class="footer-text"><a class="footer-text" href="mailto:support@healthheros.com">support@healthheros.com</a> | +1 888-995-2507</p>
                </center>
                <center>
                    <div class="footer-div">
                        <a href="https://www.facebook.com/" target="_blank"><img class="footer-img" height="20px"
                        width="20px"
                                src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1690281104841--icons8-facebook-480.png" /></a>
                        <a href="https://www.instagram.com/" target="_blank">
                            <img class="footer-img" height="20px"
                            width="20px"
                                src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1690281208209--icons8-instagram-480.png" /></a>
                        <a href="https://www.linkedin.com/" target="_blank"><img class="footer-img" height="20px"
                        width="20px"
                                src="https://staging-healthhero-be.mtechub.com/admin_profile_images/1690281050481--icons8-linkedin-500.png" /></a>
                    </div>
                </center>
            </div><br/>
            <center>
                <div>
                    <p class="footer-text">All rights reserved at M Techubllc ${year}</p>
                </div>
            </center>
            </div>
            </center><br/>
    </body>
    
    </html>`
}
module.exports = { emailOTPBody }
