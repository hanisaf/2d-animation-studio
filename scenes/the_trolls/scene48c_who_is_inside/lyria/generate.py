# Generates a take from a prompt file with the Gemini API's Lyria models. Usage: KEY=... python3 generate.py [model] [out.mp3] [prompt]
import base64, json, os, sys, urllib.request
model = sys.argv[1] if len(sys.argv) > 1 else 'lyria-3-pro-preview'
out = sys.argv[2] if len(sys.argv) > 2 else 'take.mp3'
prompt = open(sys.argv[3] if len(sys.argv) > 3 else os.path.join(os.path.dirname(__file__), 'PROMPT.txt')).read()
req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
  data=json.dumps({'contents': [{'parts': [{'text': prompt}]}]}).encode(),
  headers={'Content-Type': 'application/json', 'x-goog-api-key': os.environ['KEY']})
res = json.load(urllib.request.urlopen(req, timeout=600))
if 'candidates' not in res: sys.exit(json.dumps(res))
for part in res['candidates'][0]['content']['parts']:
  if 'inlineData' in part:
    open(out, 'wb').write(base64.b64decode(part['inlineData']['data']))
    print('saved', out, part['inlineData']['mimeType'])
  elif 'text' in part:
    print(part['text'])
