"""도트 아이콘 생성기: 아래 ASCII 도트 그림을 public/assets/icons/*.svg 로 변환한다.

사용법: python3 tools/pixel-icons.py [미리보기.png]
  . = 투명, a~d = 게임보이 4색(진함 -> 밝음), r = 빨강, g = 초록 (신호등 전용)
"""
import os
import struct
import sys
import zlib

PALETTE = {
    'a': '#0f380f',
    'b': '#306230',
    'c': '#8bac0f',
    'd': '#9bbc0f',
    'r': '#d03a2b',
    'g': '#3fd16a',
}

ICONS = {
    'stop-at-7': [
        '......aaaa......',
        '.......aa.......',
        '.....aaaaaa..a..',
        '...aaddddddaaaa.',
        '..addddaddddaa..',
        '.adddddaddddda..',
        '.adddddadddddda.',
        'addddddaddddddda',
        'adddddaaaddddda.',
        'addddddddadddda.',
        '.adddddddddaddda',
        '.addddddddddadda',
        '..addddddddddda.',
        '...aadddddddaa..',
        '.....aaaaaaa....',
        '................',
    ],
    'traffic-light': [
        '.....aaaaaa.....',
        '....abbbbbba....',
        '....abrrrrba....',
        '....abrrrrba....',
        '....abbbbbba....',
        '....abccccba....',
        '....abccccba....',
        '....abbbbbba....',
        '....abggggba....',
        '....abggggba....',
        '....abbbbbba....',
        '.....aaaaaa.....',
        '.......aa.......',
        '.......aa.......',
        '.......aa.......',
        '.....aaaaaa.....',
    ],
    'nunchi': [
        '................',
        '................',
        '................',
        '.aaaaa....aaaaa.',
        'addddda..addddda',
        'adddaaa..adddaaa',
        'adddaaa..adddaaa',
        'addddda..addddda',
        '.aaaaa....aaaaa.',
        '................',
        '................',
        '......aaaa......',
        '................',
        '................',
        '................',
        '................',
    ],
    'bluffing-number': [
        '................',
        '.aaaaaaaaaaaaa..',
        '.addddddddddda..',
        '.adaaddddddadab.',
        '.adaaddddddadab.',
        '.addddddddddda b',
        '.adddddaadddda.b',
        '.adddddaadddda.b',
        '.addddddddddda.b',
        '.adaaddddddaada.',
        '.adaaddddddaadab',
        '.addddddddddda.b',
        '.aaaaaaaaaaaaa.b',
        '..bbbbbbbbbbbbbb',
        '................',
        '................',
    ],
    'truth-or-lie': [
        '................',
        '..aaaaaaaaaaaa..',
        '.addddddddddddа.',
        'addddaaddddaddda',
        'adddaddaddadadda',
        'adddddaddddaddda',
        'addddaddddaaddda',
        'adddddddddddddda',
        'addddaddddaddddа',
        '.adddddddddddda.',
        '..aaaaddaaaaaa..',
        '.....adda.......',
        '.....ada........',
        '.....aa.........',
        '................',
        '................',
    ],
    'liar-game': [
        '................',
        '................',
        '...aaaaaaaaaa...',
        '..abbbbbbbbbba..',
        '.abbbbbbbbbbbba.',
        'aaaaaaaaaaaaaaaa',
        '..adddddddddda..',
        '.addaaadaaaddda.',
        '.adabaadabaadda.',
        '.addaaadaaaddda.',
        '..adddddddddda..',
        '..adddaaaadddа..',
        '...adddddddda...',
        '....aaaaaaaa....',
        '................',
        '................',
    ],
    'indian-poker': [
        '................',
        '.aaaaaaa........',
        '.abcbcba........',
        '.acbcbaaaaaaaa..',
        '.abcbcadddddda..',
        '.acbcbadaaaada..',
        '.abcbcaddddada..',
        '.acbcbadddadda..',
        '.abcbcadddadda..',
        '.acbcbaddaddda..',
        '.abcbcaddaddda..',
        '.acbcbadddddda..',
        '.aaaaaadddddda..',
        '......aaaaaaaa..',
        '................',
        '................',
    ],
    'mbti-guess': [
        '................',
        '.....aaaaaa.....',
        '...aaccccccaa...',
        '..acccbccbccca..',
        '.acccbccccbccca.',
        '.accbccccccbcca.',
        'acccccbccbccccca',
        'accbccccccccbcca',
        'acccccbccbccccca',
        '.acccbccccbccca.',
        '.accccccccccca..',
        '..aaccccccccaa..',
        '....aacccaa.....',
        '......aca.......',
        '......aaa.......',
        '................',
    ],
    'image-game': [
        '................',
        'aaaaaaaaaaaaaaaa',
        'abbbbbbbbbbbbbba',
        'abddddddddddddba',
        'abddddddddcccdba',
        'abddddddddcccdba',
        'abddddddddddddba',
        'abdddaddddddddba',
        'abddabaddddaddba',
        'abdabbbadaabadba',
        'ababbbbbaabbbaba',
        'abbbbbbbbbbbbbba',
        'abbbbbbbbbbbbbba',
        'aaaaaaaaaaaaaaaa',
        '................',
        '................',
    ],
}


def normalize(rows):
    # 실수로 들어간 공백/전각문자는 투명으로 처리하고 16칸에 맞춘다
    out = []
    for row in rows:
        row = ''.join(ch if ch in PALETTE else '.' for ch in row)
        out.append((row + '.' * 16)[:16])
    return out


def to_svg(rows):
    rects = []
    for y, row in enumerate(rows):
        x = 0
        while x < len(row):
            ch = row[x]
            if ch == '.':
                x += 1
                continue
            run = 1
            while x + run < len(row) and row[x + run] == ch:
                run += 1
            rects.append(f'<rect x="{x}" y="{y}" width="{run}" height="1" fill="{PALETTE[ch]}"/>')
            x += run
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="64" height="64" '
        'shape-rendering="crispEdges">' + ''.join(rects) + '</svg>\n'
    )


def write_preview(path, icons, scale=8, gap=2):
    names = list(icons)
    w = len(names) * (16 + gap) * scale
    h = 16 * scale
    bg = (0x9b, 0xbc, 0x0f)
    pixels = [[bg] * w for _ in range(h)]
    for i, name in enumerate(names):
        for y, row in enumerate(icons[name]):
            for x, ch in enumerate(row):
                if ch == '.':
                    continue
                color = tuple(int(PALETTE[ch][k:k + 2], 16) for k in (1, 3, 5))
                for dy in range(scale):
                    for dx in range(scale):
                        pixels[y * scale + dy][(i * (16 + gap) + x) * scale + dx] = color
    raw = b''.join(b'\x00' + bytes(c for px in row for c in px) for row in pixels)

    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xFFFFFFFF)

    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
    png += chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b'')
    with open(path, 'wb') as f:
        f.write(png)


def main():
    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'assets', 'icons')
    os.makedirs(root, exist_ok=True)
    icons = {name: normalize(rows) for name, rows in ICONS.items()}
    for name, rows in icons.items():
        with open(os.path.join(root, f'{name}.svg'), 'w') as f:
            f.write(to_svg(rows))
    if len(sys.argv) > 1:
        write_preview(sys.argv[1], icons)


if __name__ == '__main__':
    main()
