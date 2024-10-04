export default function emailHtml(
  inviteLink,
  appLogoUrl = 'https://firebasestorage.googleapis.com/v0/b/photogallery-9451.appspot.com/o/logo.svg?alt=media&token=956a1a25-8cc1-44b9-b102-0727ebeb6c6e'
) {
  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to Dhanush</title>
      <style>
          /* Global Styles */
          body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              box-sizing: border-box;
              color: #10316B;
          }
  
          .container {
              margin: auto;
              text-align: center;
              background-color: #F2F7FF;
              width: 70%;
              height: auto;
              padding: 16px;
              margin-top: 100px;
              border-radius: 5px;
          }
  
          .logo {
              width: 100%;
              max-width: 100px;
              margin: auto;
          }
  
          .logo img {
              height: auto;
              width: 100%;
          }
  
          .text-box {
              width: 80%;
              margin: auto;
          }
  
          a {
              text-decoration: none;
          }
  
          button {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 20px;
              background-color: #10316b;
              color: #ffffff;
              border-radius: 4px;
              font-size: 16px;
              border: none;
          }
      </style>
  </head>
  
  <body>
      <div class="main">
          <div class="container">
              <div class="logo">
                  <img src="https://i.postimg.cc/h43M2t0M/Black-and-Yellow-Minimalist-Female-Archer-Illustration-Archery-Club-Logo-1.png"
                      alt="Dhanush" />
              </div>
              <strong>
                  <h1>Welcome To Dhanush</h1>
              </strong>
              <div class="text-box">
                  <p>Click the magic link button below, and it will automatically log you in securely. Alternatively, if
                      the
                      button doesn't work for any reason, you can copy the provided magic link URL below and paste it into
                      a
                      new tab on your web browser.
                  </p>
              </div>
              <a href="${inviteLink}">
                  <button>Sign in</button>
              </a>
              <div class="text-box">
                  <p>or sign in using this link</p>
                  <a href="${inviteLink}">${inviteLink}</a>
              </div>
          </div>
      </div>
  </body>
  
  </html>`;
}
