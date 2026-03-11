import json
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

for lang in ("ru","en"):
    p = Path(rf"C:\Users\Alex\.openclaw\workspace\maccabi\site\i18n\{lang}.json")
    data = json.loads(p.read_text(encoding="utf-8"))
    print(lang, data.get("footer", {}).get("copy"))
