const user_verify_mail_template = (token) => `
<html lang="en">
  <head>
    <style>
    * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  body {
    padding: 4rem;
    background-color: white;
    color: black;
  }
  .container {
    width : calc(100% - 50px);
    text-align: center;
    max-width : 500px;
  }
  a {
    display: inline-block;
    width: calc(90% - 50px);
    background-color: blue;
    padding: 1rem 2rem;
    text-decoration: none;
    color: white;
    font-weight: 600;
    font-size : clamp(20px,2vw,25px);
  }

  #token{
    color : white;
    text-align : center;
  }

  .highlight{
    color : magenta;
    padding : 5px 5px;
  }

  .font_type_1 {
    font-size: clamp(20px, 4vw, 35px);
    font-weight: 500;
    padding: 10px;
  }

  .font_type_2 {
    font-size: clamp(15px, 3vw, 25px);
    font-weight: 400;
    padding: 10px;
  }
    </style>
  </head>
  <body>
    <div class="container">
      <h1 class="font_type_1">Welcome To E Commerce</h1>
      <h2 class="font_type_2">Click the Button to Verify</h2>
      <a id='token' href="http://localhost:5000/u/auth/verify_mail/${token}">Verify</a>
      <p class="highlight"><strong>This token expires in 1 hour</strong></p>
    </div>
  </body>
</html>`;


const user_reset_password_mail_template = (token) => `
<html lang="en">
  <head>
    <style>
    * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  body {
    padding: 4rem;
    background-color: white;
    color: black;
  }
  .container {
    width : calc(100% - 50px);
    text-align: center;
    max-width : 500px;
  }
  a {
    display: inline-block;
    width: calc(90% - 50px);
    background-color: blue;
    padding: 1rem 2rem;
    text-decoration: none;
    color: white;
    font-weight: 600;
    font-size : clamp(20px,2vw,25px);
  }

  #token{
    color : white;
    text-align : center;
  }

  .highlight{
    color : magenta;
    padding : 5px 5px;
  }

  .font_type_1 {
    font-size: clamp(20px, 4vw, 35px);
    font-weight: 500;
    padding: 10px;
  }

  .font_type_2 {
    font-size: clamp(15px, 3vw, 25px);
    font-weight: 400;
    padding: 10px;
  }
    </style>
  </head>
  <body>
    <div class="container">
      <h1 class="font_type_1">Welcome To E Commerce</h1>
      <h2 class="font_type_2">Click the Button To Reset Password</h2>
      <a id='token' href="http://localhost:5000/u/auth/reset/password?token=${token}">Reset Password</a>
      <p class="highlight"><strong>This token expires in 1 hour</strong></p>
    </div>
  </body>
</html>`;

export { user_verify_mail_template,user_reset_password_mail_template };
