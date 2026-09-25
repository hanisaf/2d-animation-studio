// studio/markdown.js: a small Markdown → HTML renderer for the studio's docs pane (no dependencies).
// Supports headings, paragraphs, **bold**, *italic*, `code`, fenced code, links, images, blockquotes, horizontal rules,
// nested bullet / numbered lists and GitHub-style tables. Relative links and images resolve against the doc's folder.

function mdToHtml(md, baseDir = '') {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const resolve = href => {
    if (/^([a-z]+:|#|\/)/i.test(href)) return href;
    const parts = (baseDir ? baseDir + '/' + href : href).split('/'), out = [];
    for (const p of parts) { if (p === '..') out.pop(); else if (p !== '.' && p !== '') out.push(p); }
    return out.join('/');
  };
  const inline = s => {
    const codes = [];
    s = s.replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(esc(c)) - 1}\u0000`);
    s = esc(s)
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, src) => `<img src="${resolve(src)}" alt="${a}">`)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) => `<a href="${resolve(href)}" data-href="${resolve(href)}">${t}</a>`)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>')
      .replace(/(^|\W)_([^_\s][^_]*?)_(?!\w)/g, '$1<em>$2</em>');
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
  };
  const lines = md.replace(/\r/g, '').split('\n'), html = [];
  let i = 0;
  const isTableSep = l => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l);
  const cells = l => l.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => inline(c.trim().replace(/\\\|/g, '|')));
  const listRe = /^(\s*)([-*+]|\d+\.)\s+(.*)$/;
  while (i < lines.length) {
    const l = lines[i];
    if (/^\s*$/.test(l)) { i++; continue; }
    if (/^```/.test(l)) {                                            // fenced code
      const buf = []; i++; while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]); i++;
      html.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`); continue;
    }
    let m;
    if ((m = /^(#{1,6})\s+(.*)$/.exec(l))) { const n = m[1].length, id = m[2].toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'); html.push(`<h${n} id="${id}">${inline(m[2])}</h${n}>`); i++; continue; }
    if (/^\s*(-{3,}|\*{3,})\s*$/.test(l)) { html.push('<hr>'); i++; continue; }
    if (/^\s*>/.test(l)) {                                           // blockquote
      const buf = []; while (i < lines.length && /^\s*>/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ''));
      html.push(`<blockquote>${mdToHtml(buf.join('\n'), baseDir)}</blockquote>`); continue;
    }
    if (l.includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {   // table
      const head = cells(l); i += 2; const rows = [];
      while (i < lines.length && lines[i].includes('|') && !/^\s*$/.test(lines[i])) rows.push(cells(lines[i++]));
      html.push(`<div class="tablewrap"><table><thead><tr>${head.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (listRe.test(l)) {                                            // (nested) lists
      const stack = []; let out = '';
      while (i < lines.length && (listRe.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && stack.length))) {
        const lm = listRe.exec(lines[i]);
        if (!lm) { out += ' ' + inline(lines[i].trim()); i++; continue; }  // continuation line
        const ind = lm[1].length, tag = /\d/.test(lm[2]) ? 'ol' : 'ul';
        while (stack.length && ind < stack[stack.length - 1].ind) out += `</li></${stack.pop().tag}>`;
        if (!stack.length || ind > stack[stack.length - 1].ind) { out += `<${tag}>`; stack.push({ ind, tag }); }
        else out += '</li>';
        out += `<li>${inline(lm[3])}`; i++;
      }
      while (stack.length) out += `</li></${stack.pop().tag}>`;
      html.push(out); continue;
    }
    const buf = [];                                                  // paragraph
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,6}\s|```|\s*>|\s*(-{3,}|\*{3,})\s*$)/.test(lines[i]) && !listRe.test(lines[i]) && !(lines[i].includes('|') && isTableSep(lines[i + 1] || ''))) buf.push(lines[i++].trim());
    html.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return html.join('\n');
}
