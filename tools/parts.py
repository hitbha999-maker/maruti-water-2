"""Indexes every part the catalogue names, against the products that list it.

Reads  src/data/products.js
Writes tools/parts.json and tools/product_ids.json
Run this first, then gen_accessories.py.
"""
import io, os, re, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = os.path.join(ROOT, 'src', 'data', 'products.js')
s = io.open(src, encoding='utf-8').read()

# Walk the products array literal by brace matching — far safer than one big regex.
start = s.index('export const products = [')
i = s.index('[', start)
depth = 0
end = i
for j in range(i, len(s)):
    if s[j] == '[':
        depth += 1
    elif s[j] == ']':
        depth -= 1
        if depth == 0:
            end = j + 1
            break
body = s[i:end]

# Split into product objects at top level
objs = []
depth = 0
cur = ''
for ch in body[1:-1]:
    if ch == '{':
        depth += 1
    if depth > 0:
        cur += ch
    if ch == '}':
        depth -= 1
        if depth == 0:
            objs.append(cur)
            cur = ''

STR = re.compile(r"'((?:[^'\\]|\\.)*)'")


def field_array(obj, key):
    m = re.search(re.escape(key) + r':\s*\[', obj)
    if not m:
        return []
    k = m.end() - 1
    d = 0
    for j in range(k, len(obj)):
        if obj[j] == '[':
            d += 1
        elif obj[j] == ']':
            d -= 1
            if d == 0:
                return [x.replace("\\'", "'") for x in STR.findall(obj[k:j + 1])]
    return []


def field_str(obj, key):
    m = re.search(re.escape(key) + r":\s*'((?:[^'\\]|\\.)*)'", obj)
    return m.group(1).replace("\\'", "'") if m else ''


parts = {}
for o in objs:
    pid = field_str(o, 'id')
    section = field_str(o, 'section')
    # Ids, not names: four models share a name with a sibling build (frame vs
    # cabinet, MSPC vs stainless, auto vs manual), and the AUTO and MANUAL MPVs
    # belong to different 1000 LPH plants — a name-keyed index merges them.
    for item in field_array(o, 'cartridges') + field_array(o, 'components'):
        rec = parts.setdefault(item, {'products': [], 'sections': set()})
        if pid not in rec['products']:
            rec['products'].append(pid)
        rec['sections'].add(section)

print(f'{len(objs)} products parsed, {len(parts)} distinct parts named in the catalogue\n')
for k, v in sorted(parts.items(), key=lambda kv: (-len(kv[1]['products']), kv[0])):
    print(f"{len(v['products']):>2}x  {k:<42} {','.join(sorted(v['sections']))}")

out = {k: {'products': v['products'], 'sections': sorted(v['sections'])} for k, v in parts.items()}
here = os.path.dirname(os.path.abspath(__file__))
p = os.path.join(here, 'parts.json')
json.dump(out, open(p, 'w', encoding='utf-8'), indent=1)
print('\nwritten', p)

# The authoritative product-id list, from the same brace walk — a regex over the
# file pairs `id:` with the wrong `name:` once it reaches the sections array.
ids = [field_str(o, 'id') for o in objs]
q = os.path.join(here, 'product_ids.json')
json.dump(ids, open(q, 'w', encoding='utf-8'), indent=1)
print(f'written {q} ({len(ids)} ids)')
