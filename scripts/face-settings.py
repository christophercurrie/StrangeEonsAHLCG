#!/usr/bin/env python3
"""Prints starting settings for a face from a legacy card type.

    scripts/face-settings.py <CardType> <FacePrefix> [--parent <CardType>]
        [--with <regex>]

e.g. scripts/face-settings.py Asset AHLCG-AssetFace

Each AHLCG-<CardType>-<name> key becomes <FacePrefix>-<name>, falling back to
the parent type as getExpandedKey does. Templates named AHLCG-<CardType>...
-template become <FacePrefix>-...-template. Custom icon portrait regions become
the CollectorInfo regions; other set portrait keys are left out, since faces
share the AHLCG-Face set portraits. Shared AHLCG-<name> values a legacy card
falls back to are added where Face.settings has no matching AHLCG-Face-<name>;
--with adds the shared names it matches, such as 'Cost|Level|Skill'.
"""
import argparse
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SETTINGS = ROOT / 'ArkhamHorrorLCG/ArkhamHorrorLCG/resources/ArkhamHorrorLCG/settings'

# names legacy drawing resolves through getExpandedKey with shared fallbacks
SHARED = [
    'Name-style', 'Name-alignment', 'Subtitle-style', 'Subtitle-alignment',
    'Label-style', 'Label-alignment', 'Subtype-style', 'Subtype-alignment',
    'Body-style', 'Body-alignment', 'Body-tightness', 'Artist-style',
    'Artist-alignment', 'Artist-region', 'Copyright-style',
    'Copyright-alignment', 'Copyright-region', 'CollectionNumber-style',
    'CollectionNumber-alignment', 'CollectionNumber-region',
    'EncounterNumber-style', 'EncounterNumber-alignment',
    'EncounterNumber-region',
]

SET_REGIONS = {
    'Collection-portrait-clip-region': 'CollectionIcon-region',
    'Encounter-portrait-clip-region': 'EncounterIcon-region',
    'ReturnEncounter-portrait-clip-region': 'ReturnEncounterIcon-region',
}


def read(paths):
    values = {}
    for path in paths:
        for line in path.read_text(encoding='utf-8', errors='replace').splitlines():
            m = re.match(r'\s*([^#=\s][^=]*?)\s*=\s*(.*)', line)
            if m:
                values.setdefault(m.group(1), m.group(2).strip())
    return values


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('type')
    parser.add_argument('prefix')
    parser.add_argument('--parent')
    parser.add_argument('--with', dest='extra')
    args = parser.parse_args()

    legacy = read(sorted(SETTINGS.glob('*.settings')))
    faces = read([SETTINGS / 'faces/Face.settings'])

    out = {}
    types = [args.type] + ([args.parent] if args.parent else [])
    for card_type in reversed(types):
        head = 'AHLCG-' + card_type + '-'
        for key, value in legacy.items():
            if not key.startswith(head):
                continue
            name = key[len(head):]
            if name.startswith('Default-') or name.startswith('Default'):
                if name.replace('Default', '', 1) in SET_REGIONS:
                    continue
                if name in ('Default-template', 'Default-bleed-margin'):
                    continue
            if name == 'template':
                continue
            if name in SET_REGIONS:
                out[SET_REGIONS[name]] = value
            elif re.match(r'(Collection|Encounter|DefaultCollection|DefaultEncounter'
                          r'|ReturnEncounter|DefaultReturnEncounter)(Portrait)?-portrait', name):
                continue
            else:
                out[name] = value

    # card types, which share prefixes (Enemy, EnemyLocation)
    card_types = {key[6:-len('-Default-template')] for key in legacy
                  if key.startswith('AHLCG-') and key.endswith('-Default-template')}
    templates = {}
    for key, value in legacy.items():
        m = re.match(r'AHLCG-' + re.escape(args.type) + r'(\w*)((?:-\w+)*)-template$', key)
        if not m or 'portrait' in key or key.endswith('-Default-template'):
            continue
        if m.group(1) and args.type + m.group(1) in card_types:
            continue
        rest = m.group(1) + m.group(2)
        if rest and not rest.startswith('-'):
            rest = '-' + rest
        templates[args.prefix + rest + '-template'] = value

    shared_names = list(SHARED)
    if args.extra:
        for key in legacy:
            m = re.match(r'AHLCG-([A-Za-z0-9]+-(?:region|style|alignment|tint|tightness))$', key)
            if m and re.match(args.extra, m.group(1)) and m.group(1) not in shared_names:
                shared_names.append(m.group(1))
    for name in shared_names:
        if name in out:
            continue
        shared = legacy.get('AHLCG-' + name)
        if shared is not None and faces.get('AHLCG-Face-' + name) != shared:
            out[name] = shared

    print('# from legacy ' + ' / '.join(types))
    for key in sorted(templates):
        print(key + ' = ' + templates[key])
    for name in sorted(out):
        print(args.prefix + '-' + name + ' = ' + out[name])


if __name__ == '__main__':
    main()
