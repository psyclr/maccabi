from pathlib import Path
import difflib

a = Path(r"C:\Users\Alex\.openclaw\workspace\maccabi\docx\правки_по_сайту_Maccabi---71f4624b-f029-4ede-85ad-df92003544d7.extracted.txt").read_text(encoding="utf-8").splitlines()
b = Path(r"C:\Users\Alex\.openclaw\workspace\maccabi\docx\правки_по_сайту_Maccabi---4174e60c-9873-4b3c-a35a-ec9c046dc519.extracted.txt").read_text(encoding="utf-8").splitlines()

d = list(difflib.unified_diff(a, b, fromfile="71f4", tofile="4174", lineterm=""))
print("\n".join(d[:250]))
print("\n...\n")
print("Total diff lines", len(d))
