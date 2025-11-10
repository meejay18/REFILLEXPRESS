const signUpTemplate = (otp, firstName) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to RefillXpress</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              width: 90%;
              max-width: 600px;
              margin: 30px auto;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              background-color: #ffffff;
          }
          .header {
              background: linear-gradient(90deg, #f97316, #2563eb);
              padding: 25px;
              text-align: center;
              color: #fff;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.6;
              color: #444;
          }
          .otp-box {
              text-align: center;
              background-color: #fef3c7;
              color: #f97316;
              padding: 15px;
              margin: 20px 0;
              border-radius: 8px;
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 3px;
          }
          .button-container {
              text-align: center;
              margin-top: 20px;
          }
          .button {
              display: inline-block;
              background-color: #f97316;
              color: #fff;
              padding: 14px 28px;
              border-radius: 6px;
              text-decoration: none;
              font-size: 16px;
              font-weight: bold;
              transition: background-color 0.3s ease;
          }
          .button:hover {
              background-color: #ea580c;
          }
          .footer {
              background-color: #2563eb;
              color: #e5e7eb;
              text-align: center;
              padding: 15px;
              font-size: 0.9em;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Welcome to RefillXpress</h1>
          </div>
          <div class="content">
              <p>Hi ${firstName},</p>
              <p>Welcome to <strong>RefillXpress</strong> — where convenience meets safety. We’re thrilled to have you on board!</p>
              <p>We bring <strong>clean, verified gas refills</strong> straight to your doorstep — fast, safe, and reliable. Start your journey to never running out of gas again.</p>
              <p>Here’s your one-time verification code:</p>
              
              <div class="otp-box">${otp}</div>

              <p>If you didn’t create an account with RefillXpress, please ignore this message.</p>
              <p>Let’s keep your kitchen fired up</p>
              <p>— The RefillXpress Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} RefillXpress. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};


const resendOtpTemplate = (newOtp, firstName) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RefillXpress OTP Verification</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              width: 90%;
              max-width: 600px;
              margin: 30px auto;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              background-color: #ffffff;
          }
          .header {
              background: linear-gradient(90deg, #f97316, #2563eb);
              padding: 25px;
              text-align: center;
              color: #fff;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.6;
              color: #444;
          }
          .otp-box {
              text-align: center;
              background-color: #fef3c7;
              color: #f97316;
              padding: 15px;
              margin: 20px 0;
              border-radius: 8px;
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 3px;
          }
          .footer {
              background-color: #2563eb;
              color: #e5e7eb;
              text-align: center;
              padding: 15px;
              font-size: 0.9em;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Verification Code Resent</h1>
          </div>
          <div class="content">
              <p>Hi ${firstName},</p>
              <p>Here’s your new one-time verification code to complete your RefillXpress sign-up:</p>
              <div class="otp-box">${newOtp}</div>
              <p>If you didn’t request a new OTP, please ignore this message.</p>
              <p>Stay fueled, stay safe!</p>
              <p>— The RefillXpress Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} RefillXpress. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

const forgotPasswordTemplate = (newOtp, firstName) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RefillXpress Password Reset</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              width: 90%;
              max-width: 600px;
              margin: 30px auto;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              background-color: #ffffff;
          }
          .header {
              background: linear-gradient(90deg, #f97316, #2563eb);
              padding: 25px;
              text-align: center;
              color: #fff;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.6;
              color: #444;
          }
          .otp-box {
              text-align: center;
              background-color: #fef3c7;
              color: #f97316;
              padding: 15px;
              margin: 20px 0;
              border-radius: 8px;
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 3px;
          }
          .footer {
              background-color: #2563eb;
              color: #e5e7eb;
              text-align: center;
              padding: 15px;
              font-size: 0.9em;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Password Reset Request</h1>
          </div>
          <div class="content">
              <p>Hi ${firstName},</p>
              <p>We received a request to reset your RefillXpress account password.</p>
              <p>Use the verification code below to proceed:</p>
              <div class="otp-box">${newOtp}</div>
              <p>If you didn’t request this, please ignore this message.</p>
              <p>Stay secure, stay connected.</p>
              <p>— The RefillXpress Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} RefillXpress. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};
const kycVerificationTemplate = (status, businessName) => {
  const isVerified = status === 'verified';

  const message = isVerified
    ? `<p>🎉 Great news! Your KYC documents have been <strong>approved</strong>.</p>
       <p>You now have full access to vendor features on Refill Express. We’re excited to have you onboard!</p>`
    : `<p>⚠️ Unfortunately, your KYC documents have been <strong>rejected</strong>.</p>
       <p>Please log in to your dashboard to review the issues and resubmit your documents.</p>`;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>KYC Verification Status</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              width: 90%;
              max-width: 600px;
              margin: 30px auto;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              background-color: #ffffff;
          }
          .header {
              background: linear-gradient(90deg, #f97316, #2563eb);
              padding: 25px;
              text-align: center;
              color: #fff;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.6;
              color: #444;
          }
          .footer {
              background-color: #2563eb;
              color: #e5e7eb;
              text-align: center;
              padding: 15px;
              font-size: 0.9em;
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
  `;
};

const orderStatusTemplate = (
  action,
  customerName,
  orderNumber,
  quantity,
  totalPrice,
  rejectionMessage = ''
) => {
  const isAccepted = action === 'accept';

  const message = isAccepted
    ? `<p>🎉 Great news! Your gas order <strong>#${orderNumber}</strong> for <strong>${quantity}kg</strong> has been <strong>accepted</strong>.</p>
       <p>Our delivery team will be on their way shortly. The total cost is <strong>₦${totalPrice}</strong>.</p>`
    : `<p>⚠️ Unfortunately, your gas order <strong>#${orderNumber}</strong> for <strong>${quantity}kg</strong> has been <strong>rejected</strong>.</p>
       <p><strong>Reason:</strong> <em>${rejectionMessage}</em></p>
       <p>Please contact support or place a new order. We apologize for the inconvenience.</p>`;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Status Update</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              width: 90%;
              max-width: 600px;
              margin: 30px auto;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              background-color: #ffffff;
          }
          .header {
              background: linear-gradient(90deg, #f97316, #2563eb);
              padding: 25px;
              text-align: center;
              color: #fff;
          }
          .header h2 {
              margin: 0;
              font-size: 22px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.6;
              color: #444;
          }
          .footer {
              background-color: #2563eb;
              color: #e5e7eb;
              text-align: center;
              padding: 15px;
              font-size: 0.9em;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h2>Order Status Update</h2>
          </div>
          <div class="content">
              <p>Hello ${customerName},</p>
              ${message}
              <p>Best regards,<br><strong>RefillXpress Team</strong></p>
          </div>
          <div class="footer">
              &copy; ${new Date().getFullYear()} RefillXpress. All rights reserved.
          </div>
      </div>
  </body>
  </html>
  `;
};


const vendorSignUpTemplate = (otp, businessName) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to RefillXpress</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              width: 90%;
              max-width: 600px;
              margin: 30px auto;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              background-color: #ffffff;
          }
          .header {
              background: linear-gradient(90deg, #f97316, #2563eb);
              padding: 25px;
              text-align: center;
              color: #fff;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.6;
              color: #444;
          }
          .otp-box {
              text-align: center;
              background-color: #fef3c7;
              color: #f97316;
              padding: 15px;
              margin: 20px 0;
              border-radius: 8px;
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 3px;
          }
          .button-container {
              text-align: center;
              margin-top: 20px;
          }
          .button {
              display: inline-block;
              background-color: #f97316;
              color: #fff;
              padding: 14px 28px;
              border-radius: 6px;
              text-decoration: none;
              font-size: 16px;
              font-weight: bold;
              transition: background-color 0.3s ease;
          }
          .button:hover {
              background-color: #ea580c;
          }
          .footer {
              background-color: #2563eb;
              color: #e5e7eb;
              text-align: center;
              padding: 15px;
              font-size: 0.9em;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Welcome to RefillXpress</h1>
          </div>
          <div class="content">
              <p>Hi ${businessName},</p>
              <p>Welcome to <strong>RefillXpress</strong> — where your business meets opportunity. We’re excited to have you join our vendor network!</p>
              <p>As a trusted partner, you’ll help deliver <strong>clean, verified gas refills</strong> to homes across the region. Together, we’ll make energy access safer, faster, and more reliable.</p>
              <p>Here’s your one-time verification code to activate your vendor account:</p>
              
              <div class="otp-box">${otp}</div>

              <p>If you didn’t register as a vendor with RefillXpress, please ignore this message.</p>
              <p>Let’s fuel the future — together.</p>
              <p>— The RefillXpress Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} RefillXpress. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

 const forgotPasswordVendorTemplate = (newOtp, businessName) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RefillXpress Vendor Password Reset</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              width: 90%;
              max-width: 600px;
              margin: 30px auto;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              background-color: #ffffff;
          }
          .header {
              background: linear-gradient(90deg, #f97316, #2563eb);
              padding: 25px;
              text-align: center;
              color: #fff;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.6;
              color: #444;
          }
          .otp-box {
              text-align: center;
              background-color: #fef3c7;
              color: #f97316;
              padding: 15px;
              margin: 20px 0;
              border-radius: 8px;
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 3px;
          }
          .footer {
              background-color: #2563eb;
              color: #e5e7eb;
              text-align: center;
              padding: 15px;
              font-size: 0.9em;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Vendor Password Reset</h1>
          </div>
          <div class="content">
              <p>Hi ${businessName},</p>
              <p>We received a request to reset your vendor account password on RefillXpress.</p>
              <p>Use the verification code below to proceed:</p>
              <div class="otp-box">${newOtp}</div>
              <p>If you didn’t request this, please disregard this message.</p>
              <p>We’re here to support your business.</p>
              <p>— The RefillXpress Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} RefillXpress. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

const resendOtpVendorTemplate = (newOtp, businessName) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RefillXpress Vendor Verification</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              width: 90%;
              max-width: 600px;
              margin: 30px auto;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              background-color: #ffffff;
          }
          .header {
              background: linear-gradient(90deg, #f97316, #2563eb);
              padding: 25px;
              text-align: center;
              color: #fff;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.6;
              color: #444;
          }
          .otp-box {
              text-align: center;
              background-color: #fef3c7;
              color: #f97316;
              padding: 15px;
              margin: 20px 0;
              border-radius: 8px;
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 3px;
          }
          .footer {
              background-color: #2563eb;
              color: #e5e7eb;
              text-align: center;
              padding: 15px;
              font-size: 0.9em;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Vendor Verification Code</h1>
          </div>
          <div class="content">
              <p>Hi ${businessName},</p>
              <p>Your new one-time verification code is ready to complete your onboarding with RefillXpress:</p>
              <div class="otp-box">${newOtp}</div>
              <p>If you didn’t request this, please disregard this message.</p>
              <p>We’re excited to have you as a trusted partner!</p>
              <p>— The RefillXpress Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} RefillXpress. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

const placeOrderTemplate = (orderNumber, firstName, quantity, totalPrice, deliveryAddress, vendorName) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - RefillXpress</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              width: 90%;
              max-width: 600px;
              margin: 30px auto;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              background-color: #ffffff;
          }
          .header {
              background: linear-gradient(90deg, #f97316, #2563eb);
              padding: 25px;
              text-align: center;
              color: #fff;
          }
          .header h1 {
              margin: 0;
              font-size: 22px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.6;
              color: #444;
          }
          .order-box {
              background-color: #fef3c7;
              color: #f97316;
              padding: 15px;
              margin: 20px 0;
              border-radius: 8px;
              font-weight: bold;
              text-align: center;
          }
          .details {
              background-color: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              margin-top: 15px;
          }
          .footer {
              background-color: #2563eb;
              color: #e5e7eb;
              text-align: center;
              padding: 15px;
              font-size: 0.9em;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Order Placed Successfully</h1>
          </div>
          <div class="content">
              <p>Hi ${firstName},</p>
              <p>Thank you for choosing <strong>RefillXpress</strong>! Your order has been placed successfully and will be processed shortly.</p>

              <div class="order-box">
                  Order Number: <strong>${orderNumber}</strong>
              </div>

              <div class="details">
                  <p><strong>Vendor:</strong> ${vendorName}</p>
                  <p><strong>Quantity:</strong> ${quantity} kg</p>
                  <p><strong>Total Price:</strong> ₦${totalPrice}</p>
                  <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
                  <p><strong>Status:</strong> Pending Confirmation</p>
              </div>

              <p>We’ll notify you once your gas is on its way. Thank you for trusting RefillXpress — your safety and satisfaction are our priority.</p>
              <p>— The RefillXpress Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} RefillXpress. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `
}

const riderSignUpTemplate = (otp, firstName) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to RefillXpress Riders</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              width: 90%;
              max-width: 600px;
              margin: 30px auto;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              background-color: #ffffff;
          }
          .header {
              background: linear-gradient(90deg, #2563eb, #f97316);
              padding: 25px;
              text-align: center;
              color: #fff;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.6;
              color: #444;
          }
          .otp-box {
              text-align: center;
              background-color: #fef3c7;
              color: #f97316;
              padding: 15px;
              margin: 20px 0;
              border-radius: 8px;
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 3px;
          }
          .button-container {
              text-align: center;
              margin-top: 20px;
          }
          .button {
              display: inline-block;
              background-color: #2563eb;
              color: #fff;
              padding: 14px 28px;
              border-radius: 6px;
              text-decoration: none;
              font-size: 16px;
              font-weight: bold;
              transition: background-color 0.3s ease;
          }
          .button:hover {
              background-color: #1d4ed8;
          }
          .footer {
              background-color: #f97316;
              color: #fff;
              text-align: center;
              padding: 15px;
              font-size: 0.9em;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Welcome to RefillXpress Riders</h1>
          </div>
          <div class="content">
              <p>Hi ${firstName},</p>
              <p>Welcome to <strong>RefillXpress</strong> — where your dedication keeps homes and businesses powered every day!</p>
              <p>You’re joining a trusted team of professional riders who deliver clean, verified gas refills quickly and safely to customers who depend on us.</p>
              <p>Before we get started, please verify your email using the code below:</p>

              <div class="otp-box">${otp}</div>

              <p>This code expires in <strong>5 minutes</strong>. Enter it in the RefillXpress Rider App or portal to complete your registration.</p>
              <p>If you didn’t sign up to become a RefillXpress rider, please ignore this message.</p>
              <p>Let’s ride safe, deliver fast, and keep every home fired up </p>
              <p>— The RefillXpress Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} RefillXpress. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

const riderResendOtpTemplate = (newOtp, firstName) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RefillXpress Rider OTP Verification</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f3f4f6;
              margin: 0;
              padding: 0;
              color: #1f2937;
          }
          .container {
              width: 90%;
              max-width: 600px;
              margin: 40px auto;
              border-radius: 12px;
              overflow: hidden;
              background-color: #ffffff;
              box-shadow: 0 4px 14px rgba(0,0,0,0.1);
          }
          .header {
              background: linear-gradient(90deg, #f97316, #2563eb);
              padding: 25px;
              text-align: center;
              color: #fff;
          }
          .header h1 {
              margin: 0;
              font-size: 22px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.6;
              color: #374151;
          }
          .otp-box {
              text-align: center;
              background-color: #fef3c7;
              color: #f97316;
              padding: 15px;
              margin: 20px 0;
              border-radius: 10px;
              font-size: 28px;
              font-weight: bold;
              letter-spacing: 4px;
              border: 2px dashed #f59e0b;
          }
          .footer {
              background-color: #2563eb;
              color: #e5e7eb;
              text-align: center;
              padding: 12px;
              font-size: 0.9em;
          }
          .footer a {
              color: #facc15;
              text-decoration: none;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Rider Verification Code Resent</h1>
          </div>
          <div class="content">
              <p>Hi ${firstName},</p>
              <p>We’ve sent you a new one-time verification code to complete your <strong>Rider Account Verification</strong> on RefillXpress.</p>
              <div class="otp-box">${newOtp}</div>
              <p>This code is valid for <strong>5 minutes</strong>. Please enter it in your app or dashboard to verify your account.</p>
              <p>If you didn’t request a new OTP, kindly ignore this message — your account is secure.</p>
              <p>Ride smart, stay safe!</p>
              <p>— The RefillXpress Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} RefillXpress. All rights reserved.</p>
              <p><a href="https://refillxpress.com">Visit our website</a></p>
          </div>
      </div>
  </body>
  </html>
  `;
};

const riderForgotPasswordTemplate = (newOtp, firstName) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RefillXpress Rider Password Reset</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              width: 90%;
              max-width: 600px;
              margin: 30px auto;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              background-color: #ffffff;
          }
          .header {
              background: linear-gradient(90deg, #f97316, #2563eb);
              padding: 25px;
              text-align: center;
              color: #fff;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.6;
              color: #444;
          }
          .otp-box {
              text-align: center;
              background-color: #fef3c7;
              color: #f97316;
              padding: 15px;
              margin: 20px 0;
              border-radius: 8px;
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 3px;
          }
          .footer {
              background-color: #2563eb;
              color: #e5e7eb;
              text-align: center;
              padding: 15px;
              font-size: 0.9em;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Rider Password Reset Request</h1>
          </div>
          <div class="content">
              <p>Hi ${firstName},</p>
              <p>We received a request to reset your <strong>RefillXpress Rider</strong> account password.</p>
              <p>Use the verification code below to proceed with resetting your password:</p>
              <div class="otp-box">${newOtp}</div>
              <p>This OTP will expire in <strong>5 minutes</strong>. Please do not share it with anyone.</p>
              <p>If you didn’t request this reset, you can safely ignore this email.</p>
              <p>Ride safe, and stay connected!</p>
              <p>— The RefillXpress Team</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} RefillXpress. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};


const acceptOrderStatusTemplate = (
  customerName,
  orderNumber,
  quantity,
  totalPrice,
  otp
) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Accepted - OTP Confirmation</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              width: 90%;
              max-width: 600px;
              margin: 30px auto;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              background-color: #ffffff;
          }
          .header {
              background: linear-gradient(90deg, #f97316, #2563eb);
              padding: 25px;
              text-align: center;
              color: #fff;
          }
          .header h2 {
              margin: 0;
              font-size: 22px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.6;
              color: #444;
          }
          .otp-box {
              margin: 20px 0;
              text-align: center;
          }
          .otp-box p {
              font-weight: bold;
              font-size: 16px;
              color: #2563eb;
          }
          .otp-code {
              background-color: #f3f4f6;
              display: inline-block;
              padding: 15px 25px;
              border-radius: 8px;
              font-size: 28px;
              letter-spacing: 5px;
              font-weight: bold;
              color: #111;
          }
          .footer {
              background-color: #2563eb;
              color: #e5e7eb;
              text-align: center;
              padding: 15px;
              font-size: 0.9em;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h2>Order Confirmed</h2>
          </div>
          <div class="content">
              <p>Hello ${customerName},</p>
              <p>Great news! Your gas order <strong>#${orderNumber}</strong> for <strong>${quantity}kg</strong> has been <strong>accepted</strong>.</p>
              <p>Our delivery team will be on their way shortly. The total cost is <strong>₦${totalPrice}</strong>.</p>
              <div class="otp-box">
                <p>Please provide this OTP to the rider upon delivery:</p>
                <div class="otp-code">${otp}</div>
              </div>
              <p>Keep this OTP safe, it will be required to complete your delivery.</p>
              <p>Best regards,<br><strong>RefillXpress Team</strong></p>
          </div>
          <div class="footer">
              &copy; ${new Date().getFullYear()} RefillXpress. All rights reserved.
          </div>
      </div>
  </body>
  </html>
  `
}

const completeOrderStatusTemplate = (
  customerName,
  orderNumber,
  quantity,
  totalPrice
) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Completed</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              width: 90%;
              max-width: 600px;
              margin: 30px auto;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              background-color: #ffffff;
          }
          .header {
              background: linear-gradient(90deg, #f97316, #2563eb);
              padding: 25px;
              text-align: center;
              color: #fff;
          }
          .header h2 {
              margin: 0;
              font-size: 22px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.6;
              color: #444;
          }
          .summary-box {
              margin: 20px 0;
              background-color: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              font-size: 16px;
              color: #111;
          }
          .footer {
              background-color: #2563eb;
              color: #e5e7eb;
              text-align: center;
              padding: 15px;
              font-size: 0.9em;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h2>Order Completed</h2>
          </div>
          <div class="content">
              <p>Hello ${customerName},</p>
              <p>Your gas order <strong>#${orderNumber}</strong> has been <strong>successfully delivered</strong>.</p>
              <div class="summary-box">
                  <p><strong>Quantity:</strong> ${quantity}kg</p>
                  <p><strong>Total Paid:</strong> ₦${totalPrice}</p>
              </div>
              <p>Thank you for choosing RefillXpress. We hope to serve you again soon!</p>
              <p>Best regards,<br><strong>RefillXpress Team</strong></p>
          </div>
          <div class="footer">
              &copy; ${new Date().getFullYear()} RefillXpress. All rights reserved.
          </div>
      </div>
  </body>
  </html>
  `;
};



module.exports = { signUpTemplate, resendOtpTemplate, forgotPasswordTemplate, kycVerificationTemplate, orderStatusTemplate, vendorSignUpTemplate, resendOtpVendorTemplate , forgotPasswordVendorTemplate, placeOrderTemplate, riderSignUpTemplate, riderResendOtpTemplate, riderForgotPasswordTemplate, acceptOrderStatusTemplate,completeOrderStatusTemplate}
