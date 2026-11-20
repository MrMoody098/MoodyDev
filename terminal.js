// Project a sampled height field onto a Braille character grid.
const width = 116, height = 72;
const cells = Array.from({length: height / 4}, () => Array(width / 2).fill(0));
const dots = [[1, 8], [2, 16], [4, 32], [64, 128]];
function plot(x, z) {
  const peak = (cx, cz, spread) => Math.exp(-((x-cx)**2 + (z-cz)**2) / spread);
  const elevation = 26 * peak(-.22, -.22, .16) + 18 * peak(.48, -.06, .09) + 10 * peak(-.52, .37, .08);
  const col = Math.round(57 + (x - z) * 27);
  const row = Math.round(40 + (x + z) * 13 - elevation);
  if (col >= 0 && row >= 0 && col < width && row < height) {
    cells[row >> 2][col >> 1] |= dots[row % 4][col % 2];
  }
}
for (let line = 0; line <= 22; line++) {
  for (let sample = 0; sample <= 220; sample++) {
    const a = line / 11 - 1, b = sample / 110 - 1;
    plot(a, b); plot(b, a);
  }
}
document.querySelector('#terrain').textContent = cells.map(row => String.fromCharCode(...row.map(bits => 0x2800 + bits))).join('\n');
const input = document.querySelector('#cmd');
const response = document.querySelector('#response');
const sections = ['work', 'experience', 'ise', 'contact'];
input.form.addEventListener('submit', event => {
  event.preventDefault();
  const command = input.value.trim().toLowerCase();
  if (!command) return;
  input.value = '';
  if (sections.includes(command)) {
    const section = document.getElementById(command);
    location.hash = command;
    section.tabIndex = -1;
    section.focus();
    response.textContent = '~/'.concat(command);
  } else if (command === 'clear') {
    response.textContent = '';
  } else {
    response.textContent = command === 'help' ? 'work · experience · ise · contact · clear' : 'Unknown command. Type help.';
  }
});
