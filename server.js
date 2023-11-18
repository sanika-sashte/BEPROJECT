const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const ExcelJS = require('exceljs');
const path = require('path');
const basicAuth = require('express-basic-auth');

const app = express();
const port = 3000;

// Mock user credentials for demonstration purposes
const mockUsers = {
    'sanika': '123', // username: password
    // Add more users as needed
};

// Basic authentication middleware for all routes
app.use('/*', basicAuth({
    users: mockUsers,
    challenge: true,
    unauthorizedResponse: 'Unauthorized',
}));

// Configure Multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files (stylesheets, scripts, etc.) from the 'public' directory
app.use(express.static('public'));

// Serve the HTML file for authentication
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'auth.html'));
});

// Handle file upload and conversion
app.post('/upload', upload.single('pdfFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const pdfBuffer = req.file.buffer;

        // Extract text from PDF
        const pdfData = await pdf(pdfBuffer);

        // Create Excel file using exceljs
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        // Extract lines from PDF text
        const textLines = pdfData.text.split('\n');

        // Process each line to create columns
        textLines.forEach((line, index) => {
            const columns = line.split(',');

            // If it's the first line, treat it as header and add columns
            if (index === 0) {
                worksheet.addRow(columns);
            } else {
                // Add data rows
                worksheet.addRow(columns);
            }
        });

        // Send the Excel file as a response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=result.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Redirect to index.html after successful authentication
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
