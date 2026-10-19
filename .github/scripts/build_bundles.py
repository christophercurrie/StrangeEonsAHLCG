#!/usr/bin/env python3
"""Build Strange Eons plug-in bundles (.seext) from plug-in task folders.

A bundle is a ZIP archive of the task folder's contents with UTF-8 entry
names, prefixed by the "web-safe" marker bytes that Strange Eons writes.
Hidden files, the task's seproject file and the default project exclusions
are skipped, matching the Make Bundle task.
"""

import argparse
import fnmatch
import sys
import zipfile
from pathlib import Path

WEB_SAFE_MARKER = bytes((0x07, 0x88, 0x53, 0x45))
EXCLUDED = ('Thumbs.db', '_vti_cnf', '.hg*', '.svn*', '.git*')
TASK_SETTINGS = 'seproject'


def is_excluded(path):
    name = path.name
    return name.startswith('.') or any(fnmatch.fnmatch(name, p) for p in EXCLUDED)


def members(folder):
    """Yields the files and folders of a task folder in archive order."""
    for child in sorted(folder.iterdir()):
        if is_excluded(child):
            continue
        yield child
        if child.is_dir():
            yield from members(child)


def build(task, output):
    if not (task / 'eons-plugin').is_file():
        raise ValueError(f'{task} has no eons-plugin root file')
    output.parent.mkdir(parents=True, exist_ok=True)
    with open(output, 'wb') as out:
        out.write(WEB_SAFE_MARKER)
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as bundle:
            for path in members(task):
                rel = path.relative_to(task)
                if rel == Path(TASK_SETTINGS):
                    continue
                if path.is_dir():
                    bundle.writestr(rel.as_posix() + '/', b'')
                else:
                    bundle.write(path, rel.as_posix())
    return output


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument('tasks', nargs='+', type=Path, help='plug-in task folders')
    parser.add_argument('-o', '--out', type=Path, default=Path('dist'), help='output folder')
    args = parser.parse_args(argv)
    for task in args.tasks:
        bundle = build(task, args.out / (task.name + '.seext'))
        print(bundle)
    return 0


if __name__ == '__main__':
    sys.exit(main())
