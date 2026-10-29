# Builds PROMPT.txt for Lyria from the riddle grid in ../README.md (120 bpm, bars of 2 s, riddle i at S_R + RL i s).
# This is the grid asked for; scene.js uses the times measured on the take (they land within a beat of these).
S_R, RL, L_RID, L_FAST, L_GUESS, L_POP, L_OUT = 12, 24, 2, 10, 16, 18, 23.5
BARS = {10: 'ten', 12: 'twelve'}   # in words: "24-second" here gets the prompt refused (PROHIBITED_CONTENT)
S_RECAP = S_R + 7 * RL; S_DANCE, S_END, END = S_RECAP + 8, S_RECAP + 22, S_RECAP + 28
R = [
  ('pumpkin', "Fuzzy pumpkin, quick kick tricks, stacks sixty sticky square blocks! Who kicks quick and builds big block towers in his silly socks?",
   "It's Danny! Dashing Danny, dribbling, building block by block!"),
  ('pink ghost', "Pink ghost glides and twirls and swirls, a sparkly spinning sight! Who dances dizzy disco and drew these monsters late at night?",
   "It's Alma! Amazing Alma, the artist who drew us all!"),
  ('blue bird', "Blue bird flips the ball up high and figures how it flies! Who counts curves and kicks the goal with numbers in his eyes?",
   "It's Housam! High-flying Housam, the hat-trick math whiz!"),
  ('bee', "Busy bee bends backwards, bounces, buzzing bright! Who cartwheels quick, then sketches comic heroes left and right?",
   "It's Jenna! Jolly Jenna, jumping, drawing jokes!"),
  ('cat', "Stripy cat saws sixty sticks and sends a speedy text! Who spikes the ball and shakes her hair, the rebel coming next?",
   "It's Sarah! Super Sarah, sawing, spiking, so cool!"),
  ('owl', "Hooting owl with happy hearts says healthy habits, please! Who checks your chest and cheers for greens and broccoli and peas?",
   "It's Doctor Sami! Silly, smiley Doctor Sami!"),
  ('bat', "Big bat brings big brainy boards, explains, explains, explains! Who proves the problems properly, with pointers, chalk and brains?",
   "It's Professor Safadi! ...and his twin brother too!"),
]
ts = lambda s: f"{int(s)//60}:{int(s)%60:02d}" + (f".{int(round((s%1)*10))}" if s % 1 else "")
out = [f"""An original, silly, high-energy kids' cartoon game-show pop song, "Who's Inside?", for an animated music video. Exactly {END} seconds ({ts(END)}), a strict steady 120 BPM in 4/4 the whole way through (one bar = 2 seconds), no tempo changes, so the video can be cut on the beat. Bright bouncy game-show pop: punchy drums, slap bass, brass stabs, glockenspiel, handclaps, a bubbly synth lead. Voices: two goofy grown-up men (twin brothers), bright kids, and a whole audience of children as a choir shouting the questions. Clean, clear English diction, kid-friendly, the singers really trip over the tongue twisters and giggle.

The song repeats the same {BARS[RL // 2]}-bar riddle structure seven times, one for each monster costume. Keep every section boundary exactly on the timestamps below.

[0:00 - 0:12] Intro. A big game-show fanfare, then the groove kicks in. Kids sing:
"Seven little monsters on the stage tonight,
twist your tongue and guess who's hiding inside!
Listen to the riddle, say it fast, say it slow,
one, two, three, here we go!"
"""]
for i, (kind, rid, ans) in enumerate(R):
    t = S_R + RL * i
    out.append(f"""[{ts(t)} - {ts(t+L_RID)}] Riddle {i+1} sting: a brass sting and a cymbal hit, the choir shouts "Who's this?"
[{ts(t+L_RID)} - {ts(t+L_FAST)}] Riddle {i+1}, the {kind} sings the tongue twister, bouncy and clear, filling these four bars: "{rid}"
[{ts(t+L_FAST)} - {ts(t+L_GUESS)}] The same twister again in three bars, faster and rushing, tripping over the words, the band building up: "{rid}"
[{ts(t+L_GUESS)} - {ts(t+L_POP)}] The music drops out to a tense snare drumroll; the choir whispers "Who's inside? Who's inside?"
[{ts(t+L_POP)} - {ts(t+RL)}] At exactly {ts(t+L_POP)}: a big POP sound and a cymbal crash, cheering, the full groove returns. The answer twister: "{ans}" sung joyfully, then repeated, with the crowd cheering; a quick whoosh at {ts(t+L_OUT)}.
""")
out.append(f"""[{ts(S_RECAP)} - {ts(S_DANCE)}] Recap. All seven monsters line up; the groove builds; from {ts(S_RECAP+4)} seven quick POP sounds, one per beat, and the crowd cheers.
[{ts(S_DANCE)} - {ts(S_END)}] Finale dance party, the biggest, fullest chorus, everyone singing together, sung twice:
"Twist it, troll it, now you know,
seven silly monsters in the show!
The professor, the doctor and all of the kids,
tongue-tied and laughing at what we did!"
[{ts(S_END)} - {ts(END)}] Outro: a final big hit at {ts(S_END)}, then a wave of laughter from everyone and a short button ending. Silence at {ts(END)}.
""")
open('PROMPT.txt', 'w').write("\n".join(out))
