import nodemailer from 'nodemailer';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.BREVO_API_KEY;

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
    from: 'MegaRock SellOff',
    to: 'polina.rykova.hr@gmail.com',
    subject: 'Nova narudžba',
    html: `<html>
              <body>
                <h1>Detalji narudžbe</h1>
                <p>Majica: ${req.body.item}</p> 
                <p>Veličina: ${req.body.size}</p>
                <p>Ime: ${req.body.firstName}</p>
                <p>Prezime: ${req.body.lastName}</p> 
                <p>Mail: ${req.body.email}</p>
                <p>Broj mobitela: ${req.body.phone}</p>
              </body>
            </html>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: info.response });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
