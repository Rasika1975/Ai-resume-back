import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePDF = async (templatePath, resumeData) => {
  let browser;
  
  try {
    console.log('📂 Template path received:', templatePath);

    // ✅ Use the templatePath directly (it's already the full path from controller)
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    const templateHTML = fs.readFileSync(templatePath, 'utf-8');
    console.log('✅ Template loaded successfully');

    const template = Handlebars.compile(templateHTML);

    const data = {
      fullName: resumeData.personal?.fullName || 'Your Name',
      email: resumeData.personal?.email || '',
      phone: resumeData.personal?.phone || '',
      location: resumeData.personal?.location || '',
      linkedin: resumeData.personal?.linkedin || '',
      website: resumeData.personal?.website || '',
      experience: resumeData.experience || [],
      education: resumeData.education || [],
      skills: (resumeData.skills || []).filter(s => s && s.trim()),
      custom: resumeData.custom || []
    };

    console.log('📝 Data prepared');

    const html = template(data);
    console.log('✅ HTML compiled');

    console.log('🚀 Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    console.log('✅ Content loaded in browser');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    console.log('✅ PDF buffer created successfully');
    return pdfBuffer;

  } catch (error) {
    console.error('❌ PDF Generator Error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Browser closed');
    }
  }
};