export const DONUT_W = 40;
export const DONUT_H = 20;

const CHARS = '.,-~:;=!*#$@';
const R1 = 1;
const R2 = 2;
const K2 = 5;
const K1 = (DONUT_W * K2 * 3) / (8 * (R1 + R2));
const K1Y = K1 / 2;

export function donutFrame(A: number, B: number): string {
  const size = DONUT_W * DONUT_H;
  const lum = new Int8Array(size).fill(-1);
  const zbuf = new Float32Array(size);
  const cA = Math.cos(A), sA = Math.sin(A);
  const cB = Math.cos(B), sB = Math.sin(B);

  for (let t = 0; t < 6.283; t += 0.07) {
    const ct = Math.cos(t), st = Math.sin(t);
    const cx = R2 + R1 * ct;
    const cy = R1 * st;
    for (let p = 0; p < 6.283; p += 0.02) {
      const cp = Math.cos(p), sp = Math.sin(p);
      const x = cx * (cB * cp + sA * sB * sp) - cy * cA * sB;
      const y = cx * (sB * cp - sA * cB * sp) + cy * cA * cB;
      const ooz = 1 / (K2 + cA * cx * sp + cy * sA);
      const xp = Math.floor(DONUT_W / 2 + K1 * ooz * x);
      const yp = Math.floor(DONUT_H / 2 - K1Y * ooz * y);
      if (xp < 0 || xp >= DONUT_W || yp < 0 || yp >= DONUT_H) continue;
      const L = cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp);
      const i = yp * DONUT_W + xp;
      if (L > 0 && ooz > zbuf[i]) {
        zbuf[i] = ooz;
        lum[i] = Math.min(11, Math.floor(L * 8));
      }
    }
  }

  let html = '';
  for (let r = 0; r < DONUT_H; r++) {
    let run = '';
    let runLvl = -2;
    for (let c = 0; c < DONUT_W; c++) {
      const lvl = lum[r * DONUT_W + c];
      if (lvl !== runLvl) {
        html += flush(run, runLvl);
        run = '';
        runLvl = lvl;
      }
      run += lvl < 0 ? ' ' : CHARS[lvl];
    }
    html += flush(run, runLvl) + (r < DONUT_H - 1 ? '\n' : '');
  }
  return html;
}

function flush(run: string, lvl: number): string {
  if (!run) return '';
  return lvl < 0 ? run : `<span class="d${lvl}">${run}</span>`;
}
