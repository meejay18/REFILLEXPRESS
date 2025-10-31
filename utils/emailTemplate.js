const signUpTemplate = (otp, firstName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Final Project</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color:rgb(244, 7, 7);
                background-color: #2c2c2c; /* Dark background */
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                background-color: #f4f4f4; /* Light grey background */
            }
            .header {
                background: ##28a745;
                padding: 20px;
                text-align: center;
                border-bottom: 1px solid #ddd;
                color: #ffffff;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
                color: #333333;
            }
            .button-container {
                text-align: center;
                margin: 20px 0;
                color: #fff
            }
            .button {
                display: inline-block;
                background-color: #28a745; /* Green background */
                color: #ffffff;
                padding: 15px 30px;
                font-size: 18px;
                text-decoration: none;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #218838;
            }
            .footer {
                background: #333333;
                padding: 10px;
                text-align: center;
                border-top: 1px solid #ddd;
                font-size: 0.9em;
                color: #cccccc;
                border-radius: 0 0 10px 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome Onboard😇</h1>
            </div>
            <div class="content">
                <p>Hello ${firstName},</p>
                <p>Welcome to Morning Munch. We are excited to have you on board. We are at your service for any kind of meals and deliveries in ajegunle. You have an opportunity to partner with us, become a vendor or a rider😇❤️</p>
                <p>Please click the button  to verify:</p>
                <div class="button-container">
                <p>Your verification code is</p>
                    <p>${otp}</p>
                </div>
                <p>If you did not sign up on our platform, kindly ignore this email.</p>
                <p>Best regards,<br>Morning munch</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} . All rights reserved.</p>
            </div>  
        </div>
    </body>
    </html>
    
  
    `
}

const resendOtpTemplate = (newOtp, firstName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Final Project</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color:rgb(244, 7, 7);
                background-color: #2c2c2c; /* Dark background */
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                background-color: #f4f4f4; /* Light grey background */
            }
            .header {
                background: ##28a745;
                padding: 20px;
                text-align: center;
                border-bottom: 1px solid #ddd;
                color: #ffffff;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
                color: #333333;
            }
            .button-container {
                text-align: center;
                margin: 20px 0;
                color: #fff
            }
            .button {
                display: inline-block;
                background-color: #28a745; /* Green background */
                color: #ffffff;
                padding: 15px 30px;
                font-size: 18px;
                text-decoration: none;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #218838;
            }
            .footer {
                background: #333333;
                padding: 10px;
                text-align: center;
                border-top: 1px solid #ddd;
                font-size: 0.9em;
                color: #cccccc;
                border-radius: 0 0 10px 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>OTP resend mail</h1>
            </div>
            <div class="content">
                <p>Hello ${firstName},</p>
                <p>Here is your one-time password to complete your verification</p>
               <div class="button-container">
                <p>Your new verification code is</p>
                    <p>${newOtp}</p>
                </div>
                <p>If you did not resend an OTP, kindly ignore this email.</p>
                <p>Best regards,<br>Refill Express</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} . All rights reserved.</p>
            </div>  
        </div>
    </body>
    </html>
    
  
    `
}

const forgotPasswordTemplate = (newOtp, firstName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Final Project</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color:rgb(244, 7, 7);
                background-color: #2c2c2c; /* Dark background */
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                background-color: #f4f4f4; /* Light grey background */
            }
            .header {
                background: ##28a745;
                padding: 20px;
                text-align: center;
                border-bottom: 1px solid #ddd;
                color: #ffffff;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
                color: #333333;
            }
            .button-container {
                text-align: center;
                margin: 20px 0;
                color: #fff
            }
            .button {
                display: inline-block;
                background-color: #28a745; /* Green background */
                color: #ffffff;
                padding: 15px 30px;
                font-size: 18px;
                text-decoration: none;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #218838;
            }
            .footer {
                background: #333333;
                padding: 10px;
                text-align: center;
                border-top: 1px solid #ddd;
                font-size: 0.9em;
                color: #cccccc;
                border-radius: 0 0 10px 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Reset password</h1>
            </div>
            <div class="content">
                <p>Hello ${firstName},</p>
                 <p>A reset password was requested on your account</p>
              <p>Here is your one-time password to complete your verification</p>
               <div class="button-container">
                <p>Your new verification code is</p>
                    <p>${newOtp}</p>
                </div>
                <p>If you did not request to reset your password, kindly ignore this email.</p>
                <p>Best regards,<br>Refill Express</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} . All rights reserved.</p>
            </div>  
        </div>
    </body>
    </html>
    `
}
const kycVerificationTemplate = (status, businessName) => {
  const isVerified = status === 'verified'

  const message = isVerified
    ? `<p>🎉 Great news! Your KYC documents have been <strong>approved</strong>.</p>
       <p>You now have full access to vendor features on Refill Express. We’re excited to have you onboard!</p>`
    : `<p>⚠️ Unfortunately, your KYC documents have been <strong>rejected</strong>.</p>
       <p>Please log in to your dashboard to review the issues and resubmit your documents.</p>`

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KYC Verification Status</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #2c2c2c;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                background-color: #f4f4f4;
            }
            .header {
                background: #28a745;
                padding: 20px;
                text-align: center;
                border-bottom: 1px solid #ddd;
                color: #ffffff;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
                color: #333333;
            }
            .footer {
                background: #333333;
                padding: 10px;
                text-align: center;
                border-top: 1px solid #ddd;
                font-size: 0.9em;
                color: #cccccc;
                border-radius: 0 0 10px 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>KYC Verification Update</h1>
            </div>
            <div class="content">
                <p>Hello ${businessName},</p>
                ${message}
                <p>Best regards,<br>Refill Express</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Refill Express. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `
}


const orderStatusTemplate  = (action, customerName, orderNumber, quantity, price)  => {
  const isAccepted = action === 'accept';

  const message = isAccepted
    ? `<p>🎉 Great news! Your gas order <strong>#${orderNumber}</strong> for <strong>${quantity}kg</strong> has been <strong>accepted</strong>.</p>
       <p>Our delivery team will be on their way shortly. The total cost is <strong>₦${price}</strong>.</p>`
    : `<p>⚠️ Unfortunately, your gas order <strong>#${orderNumber}</strong> for <strong>${quantity}kg</strong> has been <strong>rejected</strong>.</p>
       <p>Please contact support or place a new order. We apologize for the inconvenience.</p>`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px; }
        .container { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .footer { margin-top: 20px; font-size: 0.9em; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hello ${customerName},</h2>
        ${message}
        <p>Best regards,<br><strong>RefillXpress Team</strong></p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} RefillXpress. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = { signUpTemplate, resendOtpTemplate, forgotPasswordTemplate, kycVerificationTemplate, orderStatusTemplate }
