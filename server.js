const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/CoventechDb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ContactForm = mongoose.model('ContactForm', {
    Name: String,
    Email: String,
    Subject: String,
    message: String,
  });

app.use(cors({ origin: 'http://localhost:3000' }));

app.options('*', cors());

app.use(bodyParser.json());


app.get('/' , async(req,res)=>{
  try {
    // Fetch all records from MongoDB
    const formSubmissions = await ContactForm.find();

    // Send the fetched data as the response
    res.status(200).json({ success: true, data: formSubmissions });
    
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
})

// Route to handle form submissions
app.post('/', async (req, res) => {
    try {
      const { Name, Email , Subject , message } = req.body;
  
      // Save the form data to MongoDB
      const contactEntry = new ContactForm({ Name, Email , Subject , message });
      await contactEntry.save();

      console.log('Received form submission:', req.body);
      // Send email
      res.status(200).json({ success: true, message: 'Form data saved successfully' });
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      auth: {
        user: 'aqib@co-ventech.com',
        pass: 'Aqib@aqib1',
      },
    });

    const mailOptions = {
      from: 'aqib@co-ventech.com',
      to: 'sales@co-ventech.com',
      subject: 'Coventect Contact Form',
      text: `Name: ${Name}\nEmail: ${Email}\nSubject: ${Subject} \nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  // Start the server
app.listen(PORT, () => {
  
    console.log(`Server is running onn http://localhost:${PORT}`);
  });
  //update after modification
