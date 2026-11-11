import React from 'react';
import { Mark } from './Icons.jsx';

const RX =
  /(\/\/.*$|\{\/\*.*?\*\/\})|('[^']*'|"[^"]*"|`[^`]*`)|\b(import|from|function|const|let|return|export|default)\b|\b(\d+)\b|\b([A-Za-z_$][\w$]*)(?=\()/g;

function highlight(line) {
  const out = [];
  let last = 0;
  let m;
  RX.lastIndex = 0;
  while ((m = RX.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const cls = m[1] ? 'c-com' : m[2] ? 'c-str' : m[3] ? 'c-kw' : m[4] ? 'c-num' : 'c-fn';
    const tag = m[1] && (/\bBAD\b/.test(m[0]) ? 'no' : /\bGOOD\b/.test(m[0]) ? 'ok' : null);
    if (tag) out.push(<Mark key={`m${m.index}`} name={tag} size={11} />);
    out.push(<span key={m.index} className={cls}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

/** White code well with PDF-style token colours. Indentation is 2 spaces/level. */
export default function Code({ code, size = 15 }) {
  const lines = code.replace(/\n$/, '').split('\n');
  return (
    <div className="code" style={{ fontSize: size }}>
      {lines.map((ln, i) => {
        const indent = ln.match(/^ */)[0].length;
        return (
          <div
            key={i}
            className={'code-line' + (ln.trim() === '' ? ' blank' : '')}
            style={{ paddingLeft: `${indent * 0.55}em`, textIndent: 0, '--i': i }}
          >
            {highlight(ln.trimStart())}
          </div>
        );
      })}
    </div>
  );
}
