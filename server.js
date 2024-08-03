const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const uuid = require('uuid'); // For generating unique file names

const app = express();
const port = 3000;

// Set up multer for file uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.csv' && ext !== '.xlsx') {
      return cb(new Error('Only CSV and Excel files are allowed'), false);
    }
    cb(null, true);
  }
});

// Serve static files
app.use(express.static('public'));

// Handle file upload, convert to JSON, store and delete
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const fileName = req.file.originalname;
  const ext = path.extname(fileName).toLowerCase();
  const jsonFileName = `${uuid.v4()}.json`; // Unique name for JSON file
  const jsonFilePath = path.join('uploads', jsonFileName);

  let jsonData = {
    filename: fileName,
    column_names: [],
    column_values: []
  };

  const parseCSV = () => {
    const columns = new Set();
    const values = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('headers', (headers) => {
        jsonData.column_names = headers;
      })
      .on('data', (row) => {
        values.push(Object.values(row));
      })
      .on('end', () => {
        jsonData.column_values = values;

        // Write JSON data to file
        fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
          if (err) {
            console.error('Failed to write JSON file:', err);
            return res.status(500).json({ error: 'Failed to process file' });
          }

          // Delete the original file
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Failed to delete uploaded file:', err);
              return res.status(500).json({ error: 'Failed to process file' });
            }
            res.json({ message: 'File uploaded, converted to JSON, and processed successfully!', jsonFileName });
          });
        });
      });
  };

  const parseExcel = () => {
    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Get data as an array of arrays

    jsonData.column_names = data[0];
    jsonData.column_values = data.slice(1);

    // Write JSON data to file
    fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Failed to write JSON file:', err);
        return res.status(500).json({ error: 'Failed to process file' });
      }

      // Delete the original file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete uploaded file:', err);
          return res.status(500).json({ error: 'Failed to process file' });
        }
        res.json({ message: 'File uploaded, converted to JSON, and processed successfully!', jsonFileName });
      });
    });
  };

  // Check file extension and parse accordingly
  if (ext === '.csv') {
    parseCSV();
  } else if (ext === '.xlsx') {
    parseExcel();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
