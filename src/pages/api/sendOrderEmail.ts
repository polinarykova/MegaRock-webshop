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
    subject: 'Majice - Nova narudžba',
    html: `<html>
              <body>
                <h1>Detalji narudžbe:</h1>
                <p>Majica: ${req.body.item}</p> 
                <p>Veličina: ${req.body.size}</p>
                <p>Ime: ${req.body.firstName}</p>
                <p>Prezime: ${req.body.lastName}</p> 
                <p>Mail: ${req.body.email}</p>
                <p>Broj mobitela: ${req.body.phone}</p>
              </body>
            </html>`,
  };

  const mailOptionsNaručitelj = {
    from: 'info@megarock.hr',
    to: req.body.email,
    subject: 'Megarock majice - narudžba',
    html: `<html>
              <body>
                <h1>Detalji vaše narudžbe:</h1>
                <p>Majica: ${req.body.item}</p> 
                <p>Veličina: ${req.body.size}</p>
              </body>
            </html>`,
  };

  try {
    const info1 = await transporter.sendMail(mailOptions);

    const info2 = await transporter.sendMail(mailOptionsNaručitelj);

    res.status(200).json(info1.response + info2.response)
    
  } catch (error) {
    console.error("Error sending email", error);
    res.status(500).json({ error: 'Pogreška pri slanju maila' });
  }
}
