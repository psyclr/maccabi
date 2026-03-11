import sys
from pathlib import Path

DOCX = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(r"C:\Users\Alex\.openclaw\media\inbound\правки_по_сайту_Maccabi---6378e3ce-4731-41cb-a40f-857391eeba63.docx")
out_name = DOCX.stem + ".extracted.txt"
OUT = Path(r"C:\Users\Alex\.openclaw\workspace\maccabi\docx") / out_name

try:
    import docx  # python-docx
except Exception as e:
    print("ERROR: python-docx is not installed or failed to import:", repr(e))
    sys.exit(2)

if not DOCX.exists():
    print("ERROR: docx not found:", DOCX)
    sys.exit(1)

document = docx.Document(str(DOCX))
lines = []
for p in document.paragraphs:
    t = (p.text or "").rstrip()
    if t:
        lines.append(t)

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
print(f"Wrote {OUT} ({len(lines)} non-empty paragraphs)")
