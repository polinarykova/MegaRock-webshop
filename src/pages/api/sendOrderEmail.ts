import nodemailer from 'nodemailer';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'BREVO_API_KEY is not set' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: '864f96001@smtp-brevo.com',
      pass: apiKey,
    },
  });

  const mailOptions = {
    from: 'polina.rykova.hr@gmail.com',
    to: 'polina.rykova.hr@gmail.com',
    subject: 'New Order',
    html: `<html><body><h1>Order Details</h1><p>Item: ${req.body.item} <br>Size: ${req.body.size} <br>Ime: ${req.body.firstName} <br>Prezime: ${req.body.lastName} <br>Mail: ${req.body.email} <br>Broj mobitela: ${req.body.phone} </p></body></html>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Mail poslan uspješno' });
  } catch (error) {
    console.error("Error sending email", error);
    res.status(500).json({ error: 'Pogreška pri slanju maila' });
  }
}
