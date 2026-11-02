// Builds blog posts from content/blog/*.md into posts/*.html and fills the list in blog.html.
// No dependencies. Runs on Netlify before publishing (see netlify.toml).
const fs = require('fs'), path = require('path');
const SITE = 'https://biobrainscience.com'; // update when the domain is final
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const niceDate = d => { const m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${+m[3]} ${months[+m[2]-1]} ${m[1]}` : String(d); };

function parse(src) {
  const m = src.replace(/^﻿/,'').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  m[1].split(/\r?\n/).forEach(l => {
    const k = l.match(/^([A-Za-z_]+):\s*(.*)$/); if (!k) return;
    let v = k[2].trim();
    if ((v[0]==='"'&&v.slice(-1)==='"')||(v[0]==="'"&&v.slice(-1)==="'")) v = v.slice(1,-1).replace(/\\"/g,'"');
    meta[k[1]] = v;
  });
  return { meta, body: m[2] };
}

function inline(s) {
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_,a,u)=>`<img src="${u}" alt="${a}" loading="lazy">`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_,t,u)=>/^https?:/.test(u)?`<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`:`<a href="${u}">${t}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>');
  s = s.replace(/`([^`]+)`/g,'<code>$1</code>');
  return s;
}
function md(src) {
  const lines = src.replace(/\r/g,'').split('\n'); const out = []; let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = l.match(/^(#{1,6})\s+(.*)$/))) { const n = Math.max(2, m[1].length); out.push(`<h${n}>${inline(m[2])}</h${n}>`); i++; continue; }
    if (/^>\s?/.test(l)) { const b=[]; while (i<lines.length && /^>\s?/.test(lines[i])) b.push(lines[i++].replace(/^>\s?/,'')); out.push(`<blockquote>${inline(b.join(' '))}</blockquote>`); continue; }
    if (/^\s*[-*]\s+/.test(l)) { const b=[]; while (i<lines.length && /^\s*[-*]\s+/.test(lines[i])) b.push(`<li>${inline(lines[i++].replace(/^\s*[-*]\s+/,''))}</li>`); out.push(`<ul>${b.join('')}</ul>`); continue; }
    if (/^\s*\d+\.\s+/.test(l)) { const b=[]; while (i<lines.length && /^\s*\d+\.\s+/.test(lines[i])) b.push(`<li>${inline(lines[i++].replace(/^\s*\d+\.\s+/,''))}</li>`); out.push(`<ol>${b.join('')}</ol>`); continue; }
    if (/^(-{3,}|\*{3,})\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    const p=[]; while (i<lines.length && lines[i].trim() && !/^(#{1,6}\s|>|\s*[-*]\s+|\s*\d+\.\s+)/.test(lines[i])) p.push(lines[i++]);
    out.push(`<p>${inline(p.join(' '))}</p>`);
  }
  return out.join('\n      ');
}

const read = f => fs.readFileSync(f, 'utf8');
const tpl = read('post-template.html');
const dir = 'content/blog';
const posts = (fs.existsSync(dir) ? fs.readdirSync(dir).filter(f=>f.endsWith('.md')) : []).map(f => {
  const { meta, body } = parse(read(path.join(dir,f)));
  return { slug: f.replace(/\.md$/,''), title: meta.title || f, date: meta.date || '', summary: meta.summary || '', category: meta.category || '', author: meta.author || 'BioBrain', image: meta.image || '', alt: meta.image_alt || '', body };
}).sort((a,b)=> String(b.date).localeCompare(String(a.date)));

fs.mkdirSync('posts', { recursive: true });
fs.readdirSync('posts').filter(f=>f.endsWith('.html')).forEach(f=>fs.unlinkSync(path.join('posts',f)));

posts.forEach(p => {
  let h = tpl.replace(/<meta name="robots" content="noindex">\s*/,'');
  h = h.replace(/(href|src)="(?!https?:|#|\/|mailto:)([^"]+)"/g, '$1="../$2"');
  h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(p.title)} – BioBrain Blog</title>`);
  h = h.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(p.summary)}">\n<link rel="canonical" href="${SITE}/posts/${p.slug}.html">\n<meta property="og:title" content="${esc(p.title)}">\n<meta property="og:description" content="${esc(p.summary)}">\n<meta property="og:type" content="article">` + (p.image ? `\n<meta property="og:image" content="${SITE}${p.image}">` : ''));
  h = h.replace(/<h1>Post title<\/h1>/, `<h1>${esc(p.title)}</h1>`);
  h = h.replace(/<p class="sub post-meta">[\s\S]*?<\/p>/, `<p class="sub post-meta">${niceDate(p.date)}${p.category ? ' &middot; ' + esc(p.category) : ''} &middot; ${esc(p.author)}</p>`);
  const img = p.image ? `<img class="post-img" src="${p.image}" alt="${esc(p.alt)}">\n      ` : '';
  h = h.replace(/(<div class="wrap post-body">)[\s\S]*?(<p class="post-back">)/, (_,a,b)=>`${a}\n      ${img}${md(p.body)}\n      ${b}`);
  const ld = `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"Article",headline:p.title,datePublished:p.date,description:p.summary,author:{"@type":p.author==="Yuval Gal-Shahaf"?"Person":"Organization",name:p.author},publisher:{"@type":"Organization",name:"BioBrain"}})}</script>\n`;
  h = h.replace('</head>', ld + '</head>');
  fs.writeFileSync(`posts/${p.slug}.html`, h);
});

// blog list
const cards = posts.map(p => `      <article class="post-card reveal" data-cat="${esc(p.category)}">
        <a href="posts/${p.slug}.html">
          <span class="post-date">${niceDate(p.date)}${p.category ? ' &middot; <span class="post-cat">' + esc(p.category) + '</span>' : ''}</span>
          <h2>${esc(p.title)}</h2>
          <p>${esc(p.summary)}</p>
          <span class="more">Read the post <span aria-hidden="true">&rarr;</span></span>
        </a>
      </article>`).join('\n');
let blog = read('blog.html');
blog = blog.replace(/<!--POSTS-->[\s\S]*?<!--\/POSTS-->/, `<!--POSTS-->\n${cards}\n      <!--/POSTS-->`);
const cats = [...new Set(posts.map(p=>p.category).filter(Boolean))];
const filters = cats.length > 1 ? `<div class="post-filters" role="group" aria-label="Filter by category"><button class="on" data-f="">All</button>${cats.map(c=>`<button data-f="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : '';
blog = blog.replace(/<!--FILTERS-->[\s\S]*?<!--\/FILTERS-->/, `<!--FILTERS-->${filters}<!--/FILTERS-->`);
blog = blog.replace(/<div class="blog-empty[\s\S]*?<\/div>\s*(?=<\/div>\s*<\/section>)/, posts.length ? '' : '$&');
fs.writeFileSync('blog.html', blog);

// sitemap
const pages = ['index','about','ai-solutions','scientific-intelligence','blog','contact'].map(n=>n==='index'?'':`${n}.html`).concat(posts.map(p=>`posts/${p.slug}.html`));
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(u=>`  <url><loc>${SITE}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Built ${posts.length} post(s).`);
