asset({
  title: 'Dr. Sami: The Horse of Imru’ al-Qays',
  logline: 'د. سامي يشرح وصف فرس امرئ القيس: أيطلا ظبي، وساقا نعامة، وإرخاء سرحان، وتقريب تتفل.',
  files: ['scene.js'], docs: 'README.md', cast: ['sami'], locations: ['lecture_hall'],
  dialogue: [
    {at: .8, speaker:'sami', text:'هذا بيت لامرئ القيس من معلقته، يصف فيه فرسه.', cps:9, hold:4},
    {at:12.8, speaker:'sami', text:'أيطلا ظبي: أي خاصرتان ضامرتان كخاصرتَي الظبي.', cps:9, hold:4},
    {at:24.8, speaker:'sami', text:'وساقا نعامة: ساقان طويلتان تعينان على سرعة العدو.', cps:9, hold:4},
    {at:36.8, speaker:'sami', text:'السرحان هو الذئب، والإرخاء عدو سهل ممتد.', cps:9, hold:4},
    {at:48.8, speaker:'sami', text:'التتفل ولد الثعلب، والتقريب عدو بوثبات متقاربة.', cps:9, hold:4},
    {at:60.8, speaker:'sami', text:'أربع صور تجتمع في فرس واحد: رشاقة وسرعة وخفة!', cps:9, hold:4},
  ],
  music: {prompt:'A gentle, curious poetry lesson, quiet plucked melody and warm marimba, with soft chimes at each illustrated comparison.',
    bpm:80, tonic:57, motif:[0,2,3,7,5,3], chords:[0,3,5,4],
    sections:[{at:0,energy:.12},{at:12,energy:.16},{at:60,energy:.22},{at:70,energy:.04}],
    cues:[12,24,36,48,60].map(at=>({at,type:'ding'}))},
});
