import nodemailer from "nodemailer";


const sendMail = async (mail_addr,subj,func ) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.ADMIN_MAIL_ADDRESS,
        pass: process.env.ADMIN_MAIL_PASS,
      },
    });

    const detail = {
      from: process.env.ADMIN_MAIL_ADDRESS,
      to: mail_addr,
      subject: subj,
      html: func(),
    };

    const mail_send = await transporter.sendMail(detail);

    if(mail_send){
      return true;
    }
    else{
      return false;
    }

  } catch (e) {
    return false;
  }
};





export {
  sendMail
}