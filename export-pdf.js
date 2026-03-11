const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Iniciando script de generación de PDF Multi-versión...');

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // 1. PDF Premium
  const premiumHtml = path.resolve(__dirname, 'guide-premium.html');
  const premiumUrl = 'file:///' + premiumHtml.replace(/\\/g, '/');
  const premiumOut = path.resolve(__dirname, 'Reinicia-tu-Foco-Premium.pdf');

  console.log('📄 Cargando Premium:', premiumUrl);
  await page.goto(premiumUrl, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluateHandle('document.fonts.ready');
  await page.pdf({
    path: premiumOut,
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false
  });
  console.log(`✅ PDF Premium Generado (${premiumOut})`);

  // 2. PDF Gratis (Ahora apunta al archivo premium para dar la guía completa)
  const freeHtml = path.resolve(__dirname, 'guide-premium.html');
  const freeUrl = 'file:///' + freeHtml.replace(/\\/g, '/');
  const freeOut = path.resolve(__dirname, 'Reinicia-tu-Foco-Gratis.pdf');

  console.log('📄 Cargando Gratis:', freeUrl);
  await page.goto(freeUrl, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluateHandle('document.fonts.ready');
  await page.pdf({
    path: freeOut,
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false
  });
  console.log(`✅ PDF Gratis Generado (${freeOut})`);

  await browser.close();
  console.log('\n🎯 ¡Los dos archivos PDF están listos para la distribución!');
})();
