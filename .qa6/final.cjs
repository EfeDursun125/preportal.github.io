const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Users/Lachin/AppData/Local/ms-playwright/chromium-1255/chrome-win64/chrome.exe';
const pages = ['index.html','blog.html','category.html','category.html?cat=news','post.html?slug=how-preportal-works','user.html?slug=preportal','about.html','privacy.html','create.html','edit.html','admin.html','upload.html','apps.html','games.html'];
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  let bad = 0;
  for (const vp of [{w:1440,h:900},{w:390,h:844}]) {
    await p.setViewport({ width: vp.w, height: vp.h });
    for (const u of pages) {
      const errs = []; const h = (e) => errs.push(e.message);
      p.on('pageerror', h);
      await p.goto('http://127.0.0.1:56990/' + u, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 450));
      for (const code of ['en','ru','tr']) {
        await p.evaluate((c) => window.PP_I18N.setLang(c), code);
        await new Promise(r => setTimeout(r, 350));
      }
      const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      p.off('pageerror', h);
      if (errs.length || ov > 2) { bad++; console.log(`X ${vp.w} ${u} ov=${ov}`, errs.slice(0,2)); }
    }
  }
  console.log(bad ? `${bad} sorun` : 'OK 14 sayfa x 2 ekran x 3 dil: hata yok, tasma yok');
  await b.close();
})();
