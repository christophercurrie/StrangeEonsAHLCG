import io
import struct
import tempfile
import unittest
import zipfile
from pathlib import Path

import build_bundles

EOCD_SIZE = 22


class BuildTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        root = Path(self.tmp.name)
        self.task = root / 'Plugin'
        (self.task / 'resources').mkdir(parents=True)
        (self.task / 'eons-plugin').write_text('id = test\n')
        (self.task / 'resources' / 'a.txt').write_text('a')
        (self.task / 'seproject').write_text('')
        (self.task / '.hidden').write_text('')
        (self.task / 'Thumbs.db').write_text('')
        self.output = root / 'out' / 'Plugin.seext'

    def tearDown(self):
        self.tmp.cleanup()

    def unwrapped(self):
        data = build_bundles.build(self.task, self.output).read_bytes()
        self.assertEqual(data[:4], build_bundles.WEB_SAFE_MARKER)
        return data[4:]

    def test_offsets_relative_to_marker(self):
        data = self.unwrapped()
        size, offset = struct.unpack('<II', data[-EOCD_SIZE + 12:-EOCD_SIZE + 20])
        self.assertEqual(offset + size, len(data) - EOCD_SIZE)
        self.assertEqual(data[offset:offset + 4], b'PK\x01\x02')

    def test_entries(self):
        with zipfile.ZipFile(io.BytesIO(self.unwrapped())) as bundle:
            self.assertEqual(
                bundle.namelist(), ['eons-plugin', 'resources/', 'resources/a.txt'])
            self.assertEqual(bundle.read('resources/a.txt'), b'a')

    def test_requires_root_file(self):
        (self.task / 'eons-plugin').unlink()
        with self.assertRaises(ValueError):
            build_bundles.build(self.task, self.output)


if __name__ == '__main__':
    unittest.main()
