import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generatePDF } from '../utils/pdfGenerator.js';

// ✅ Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateResumePDF = async (req, res) => {
  try {
    console.log('📥 PDF Generation Request Received');
    console.log('Data:', JSON.stringify(req.body, null, 2));

    const { template, data } = req.body;

    // ✅ Validation
    if (!data || !data.personal || !data.personal.fullName) {
      return res.status(400).json({
        error: 'Resume data is required. Please fill at least your name.'
      });
    }

    // ✅ Default to "modern" if no template specified
    const templateName = template || 'modern';
    console.log(`🎨 Using template: ${templateName}`);

    // ✅ Build absolute template path
    const templatePath = path.resolve(__dirname, `../templates/${templateName}.html`);
    console.log('🧩 Template path:', templatePath);

    // 🔍 DEBUG: Check if templates folder exists
    const templatesDir = path.resolve(__dirname, '../templates');
    console.log('📁 Templates directory:', templatesDir);
    console.log('📁 Templates directory exists?', fs.existsSync(templatesDir));
    
    if (fs.existsSync(templatesDir)) {
      const files = fs.readdirSync(templatesDir);
      console.log('📄 Files in templates folder:', files);
    }

    // ✅ Check if template file exists
    console.log('🔍 Checking if template exists:', fs.existsSync(templatePath));
    
    if (!fs.existsSync(templatePath)) {
      // Try to list available templates
      const templatesDir = path.resolve(__dirname, '../templates');
      let availableTemplates = [];
      
      if (fs.existsSync(templatesDir)) {
        availableTemplates = fs.readdirSync(templatesDir)
          .filter(file => file.endsWith('.html'))
          .map(file => file.replace('.html', ''));
      }
      
      return res.status(404).json({
        error: 'Template not found',
        requestedTemplate: templateName,
        templatePath: templatePath,
        availableTemplates: availableTemplates,
        hint: 'Make sure modern.html exists in the templates folder'
      });
    }

    // ✅ Generate PDF
    const pdfBuffer = await generatePDF(templatePath, data);

    console.log('✅ PDF Generated Successfully');

    // ✅ File name cleanup
    const safeName = data.personal.fullName.replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
    const fileName = `${safeName}_Resume.pdf`;

    // ✅ Set correct headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    // ✅ Send PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ PDF Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate PDF',
      details: error.message
    });
  }
};