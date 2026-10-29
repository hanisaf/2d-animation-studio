# The song: "Who's Inside?" (Lyria)

`../audio.mp3` was made with Google's Lyria 3 music models through the Gemini API (`generateContent`), from the riddle timing and the lyrics in [`../README.md`](../README.md).

## Models

The API key could use these music models (`GET /v1beta/models`, October 2026):

| Model | What it makes |
|---|---|
| `lyria-3-pro-preview` | a full song with vocals, up to about 3:00 (it answered as `lyria-3.5`) |
| `lyria-3.5` | the same, "Music Generation model" |
| `lyria-3-clip-preview` | a 30 s clip with vocals |
| `lyria-realtime-exp` | streaming instrumental (`bidiGenerateMusic`), not used |

Every take returns an MP3 and the lyrics it sang (`[[A0]]`, `[[B1]]` … section markers).

## How the song was made

1. **The first grid did not fit.** The scene's original 20 s riddle gave each twister 2 bars (4 s). A twister is about 50 syllables, so neither model could sing it there. Both sang each pass in about 7 s, so the riddles drifted to 23–28 s. `lyria-3.5` ran out of time after the owl.
2. **A 12-bar riddle.** `make_prompt.py` writes `PROMPT.txt`: the style, the intro, then seven riddles of 24 s each (sting 0–2, the twister 2–10, again 10–16, drumroll 16–18, POP 18, the answer to 24), each with a timestamp. Takes on `lyria-3-pro-preview` all stop at about 3:00 with the seventh riddle, so the API caps a take at about 3 minutes. The first kept take sang Housam as "HOW-sam". In the lyrics the name is now spelled **Hussam** (حُسام, HOO-sam), and the take kept from that (`v4.mp3`) says it right. It is exactly 120 bpm, its riddles are exactly 24 s apart, and riddle 1 starts 12.37 s in.
3. **The encore.** `FINALE.txt` asks `lyria-3-clip-preview` for the recap, the chorus and the laughter as a 30 s clip. Of 12 takes, the one kept has the right order: "Here they are! Let's give a cheer!", seven sung pops, a crash, "Twist it, troll it…" twice, a dropout, laughter. The clip model ignores the key it is asked for, so the encore is in another key. It comes after the main take has fully ended, so the change is not heard as a clash.
4. **The join.** `stitch.py v4.mp3 fin8.mp3 ../audio.mp3 0.37 0.537 184` trims the main take by 0.37 s, so riddle 1 starts on 12.0 and every beat is on 0 + 0.5 n. It lets the main take ring out to its own ending (about 181). Then it starts the encore with its first beat on 184, and fades out the encore's last 1.5 s, where the 30 s clip is cut off. The two takes (`v4.mp3`, `fin8.mp3`) are not in git.
5. **The picture follows the song.** The times in `scene.js` were measured on `audio.mp3`, not taken from the prompt: spectral-flux onsets and beat phase, loudness dips, and Gemini (`gemini-pro-latest`) asked to time short clips. Inside each riddle: "Who's this?" ~0.75, the twister 2–10 and 10–16, "Who's inside?" 16–18, the crash at 18.0 (`L_POP`), the answer at ~18.1 and ~21.5 to 24. The finale: the pops at 188.5 + 0.25 i (`P_POP`), the crash at 190 (`S_DANCE`), the dropout at about 207, laughter 208.5–211.5 (`S_END` = 208), the end at 214.

6. **The karaoke.** `../lyrics.js` has every sung line with a time for each word. No word-level recognizer could run here (the Whisper and wav2vec2 model downloads are blocked, and `gemini-3.5-transcribe` gives no timestamps). Instead, `gemini-pro-latest` timed each line's start and end on 13 s windows of `audio.mp3`, given the lyric sheet. The seven riddles share one layout, so a line more than 0.35 s from the median of the seven takes the median. Inside a line the words are spread by syllable count.

## Notes for another take

- `KEY=… python3 generate.py lyria-3-pro-preview take.mp3 PROMPT.txt` (or `FINALE.txt` with `lyria-3-clip-preview`) makes one take. Make a few and keep the best.
- Lyria follows the timestamps to within a beat or two, not exactly. Always measure the take and move the constants in `scene.js` to it.
- The prompt filter is touchy. The same prompt with "24-second riddle" and "Exactly 208 seconds (3:28)" was refused every time (`PROHIBITED_CONTENT`). Saying "twelve-bar riddle" instead was fine. A pronunciation line for the names was refused too.
- Lyria sings what is spelled: write names as they sound ("Hussam", not "Housam"). A pronunciation note in the prompt is refused, and Lyria won't take audio, so a take can't be patched. The encore leaves out "The professor, the doctor and all of the kids…".
- The filter refused "Hussam" with this exact prompt too, while "Hoosam", "Husam" and the same prompt with "game show" for "game-show" all passed. The kept take is that last one, so `PROMPT.txt` says "game show".
