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

// Draw the workstation in cabinet projection, using its front as the x/z plane.
const ctx = document.querySelector('#machine').getContext('2d');
ctx.scale(2, 2);
const ink = '#282437';
function point(x, y, z) {
  return [116 + x + y * .69, 256 + x * .19 - y * .48 - z];
}
function face(vertices, fill, line = 1.3) {
  ctx.beginPath();
  vertices.forEach((vertex, index) => {
    const [x, y] = point(...vertex);
    if (index) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (line) { ctx.strokeStyle = ink; ctx.lineWidth = line; ctx.stroke(); }
}
function block(x,y,z,w,d,h,front,side,top) {
  face([[x,y,z],[x+w,y,z],[x+w,y,z+h],[x,y,z+h]],front);
  face([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],side);
  face([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],top);
}
face([[-19,-69,-4],[232,-69,-4],[232,106,-4],[-19,106,-4]],'#a697c3',0);
block(-7,0,0,220,103,27,'#d8d0bd','#999084','#f4eedb');
block(25,17,27,149,64,13,'#9a938b','#77717a','#ddd6c6');
block(3,9,40,198,87,163,'#eae2cf','#b3a99e','#fff6e1');
function panel(x,z,w,h,color) {
  face([[x,8.8,z],[x+w,8.8,z],[x+w,8.8,z+h],[x,8.8,z+h]],color,0);
}
panel(13,63,177,129,'#b6ac9d');
panel(17,67,170,121,ink);
const [sx,sy] = point(22,8.7,183);
ctx.save(); ctx.transform(1,.19,0,1,sx,sy);
ctx.fillStyle='#383949';ctx.beginPath();ctx.roundRect(0,0,160,111,12);ctx.fill();
ctx.save();ctx.clip();ctx.fillStyle='#292b36';
for(let row=0;row<111;row+=3) ctx.fillRect(0,row,160,.7);
ctx.fillStyle='#c4ffb1';ctx.font='bold 40px monospace';ctx.fillText('>_',19,67);
ctx.restore();ctx.restore();
panel(18,49,42,3,'#938979');panel(178,48,7,4,'#fa674b');
for(let i=0;i<13;i++) {
  const y=19+i*5;
  face([[201.1,y,74],[201.1,y+2.1,74],[201.1,y+2.1,117],[201.1,y,117]],'#716b70',0);
}
face([[120,-.1,13],[196,-.1,13],[196,-.1,18],[120,-.1,18]],ink,0);
block(-8,-75,0,217,61,8,'#bcb4a5','#a39a8e','#f0e8d5');
for(let row=0;row<4;row++) {
  for(let col=0;col<14;col++) {
    if(row===3 && col>2 && col<9) continue;
    const wide=row===3 && col===2;
    block(-2+col*14.7,-28-row*13,8,wide?100:12,9,3,'#a69c91','#8b8182',col===13?'#ff7857':'#ded6c7');
  }
}
