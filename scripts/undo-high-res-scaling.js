/*
 * Finds AHLCG cards that may still be enlarged by plug-in 9.95b2 through
 * 9.95, which multiplied portrait scales and <size> tags by 4.
 *
 * The current AHLCG plug-in corrects affected cards when they are opened.
 * This script lists the cards it cannot correct with certainty:
 *
 *   - cards it corrected by its best guess, or where 9.95 reset a setting;
 *     the plug-in leaves a note on the card, shown here
 *   - Story asset and Asset story cards whose art may be enlarged: 9.95 did
 *     not record the change on these cards, so only the art size hints at it
 *   - Customizable cards with large <size> tags, for the same reason
 *
 * Run from the Quickscript window. It checks the open project, or a folder
 * you choose, and changes nothing until APPLY is true. To fix a card listed
 * below, add its path and the factor to FIXES, then set APPLY to true and run
 * again. Changed files are copied to a backup folder first.
 */

var APPLY = false;

// 'path/in/project.eon': factor to reduce the listed art or text by, or
// { Portrait: 4 } to reduce a portrait named in a plug-in note
var FIXES = {};

// remove the plug-in's note from the listed cards once you have checked them
var CLEAR_NOTES = false;

var BACKUP_FOLDER = 'high-res-backup';

importClass(java.io.File);
importClass(java.nio.file.Files);
importClass(java.nio.file.StandardCopyOption);
importClass(Packages.ca.cgjennings.graphics.ImageUtilities);

// Art that 9.95 may have enlarged without recording it, and the text fields
// of Customizable cards.
var SUSPECTS = {
    StoryAsset: { portrait: 'BackPortrait' },
    AssetStory: { portrait: 'Portrait' },
    Customizable: {
        fields: ['CustHeader', 'CustText1', 'CustText2', 'CustText3', 'CustText4',
            'CustText5', 'CustText6', 'CustText7', 'CustText8']
    }
};

// art this much larger than its fitted size is listed
var LARGE_ART = 12;
// <size> tags at least this large are listed
var LARGE_TEXT = 24;

function handlerOf(gc) {
    var script = gc.getHandlerScript ? String(gc.getHandlerScript()) : '';
    var m = /^ArkhamHorrorLCG\/diy\/(\w+)\.js$/.exec(script);
    return m ? m[1] : null;
}

// Portraits by name: AHLCG-StoryAsset-BackPortrait is BackPortrait.
function portrait(gc, name) {
    for (var i = 0; i < gc.getPortraitCount(); ++i) {
        var p = gc.getPortrait(i);
        if (p.getBaseKey && String(p.getBaseKey()).replace(/^.*-/, '') === name) return p;
    }
    return null;
}

// How far a portrait's scale is from the scale that just covers its clip.
function fitRatio(p) {
    var image = p.getImage();
    var clip = p.getClipDimensions();
    if (image == null || clip == null) return null;
    var ideal = ImageUtilities.idealCoveringScaleForImage(
        clip.width, clip.height, image.getWidth(), image.getHeight());
    return ideal > 0 ? p.getScale() / ideal : null;
}

function largestSize(settings, fields) {
    var largest = 0;
    for (var i = 0; i < fields.length; ++i) {
        var v = settings.get(fields[i]);
        if (v == null) continue;
        var re = /<size\s+(\d+(?:\.\d+)?)\s*>/gi;
        var m;
        while ((m = re.exec(String(v))) != null) largest = Math.max(largest, parseFloat(m[1]));
    }
    return largest;
}

function divideSizeTags(text, factor) {
    return String(text).replace(/(<size\s+)(\d+(?:\.\d+)?)(\s*>)/gi, function (m, a, n, b) {
        return a + String(parseFloat((parseFloat(n) / factor).toFixed(4))) + b;
    });
}

// Describes what may be enlarged on a card, or returns null.
function suspect(gc, handler) {
    var s = SUSPECTS[handler];
    if (s == null) return null;
    if (s.portrait) {
        var p = portrait(gc, s.portrait);
        var r = p ? fitRatio(p) : null;
        if (r == null || r < LARGE_ART) return null;
        return s.portrait + ' art is ' + r.toFixed(1) + 'x its fitted size (' +
            [4, 16, 64].map(function (f) {
                return 'factor ' + f + ' gives ' + (r / f).toFixed(1) + 'x';
            }).join(', ') + ')';
    }
    var largest = largestSize(gc.getSettings(), s.fields);
    if (largest < LARGE_TEXT) return null;
    return 'text uses <size ' + largest + '> (factor 4 gives <size ' + largest / 4 + '>)';
}

function reduce(gc, handler, factor) {
    if (typeof factor === 'object') {
        for (var name in factor) {
            var named = portrait(gc, name);
            if (named == null) throw new Error('no ' + name + ' portrait');
            named.setScale(named.getScale() / factor[name]);
            named.setPanX(named.getPanX() / factor[name]);
            named.setPanY(named.getPanY() / factor[name]);
        }
        return;
    }
    var s = SUSPECTS[handler];
    if (s == null) throw new Error('give the portrait to reduce, such as { Portrait: 4 }');
    if (s.portrait) {
        var p = portrait(gc, s.portrait);
        p.setScale(p.getScale() / factor);
        p.setPanX(p.getPanX() / factor);
        p.setPanY(p.getPanY() / factor);
        return;
    }
    var settings = gc.getSettings();
    for (var i = 0; i < s.fields.length; ++i) {
        var v = settings.get(s.fields[i]);
        if (v != null && String(v).length > 0) settings.set(s.fields[i], divideSizeTags(v, factor));
    }
}

function pluginCorrectsCards() {
    var url = ResourceKit.composeResourceURL('ArkhamHorrorLCG/diy/AHLCG-utilLibrary.js');
    if (url == null) return false;
    var scanner = new java.util.Scanner(url.openStream(), 'UTF-8').useDelimiter('\\A');
    try {
        return scanner.hasNext() && String(scanner.next()).indexOf('recoverHighResCard') >= 0;
    } finally {
        scanner.close();
    }
}

function backup(root, file) {
    var rel = root.toPath().relativize(file.toPath());
    var target = new File(new File(root, BACKUP_FOLDER), rel.toString());
    target.getParentFile().mkdirs();
    Files.copy(file.toPath(), target.toPath(), StandardCopyOption.REPLACE_EXISTING);
}

function eonFiles(dir, out) {
    var list = dir.listFiles();
    if (list == null) return out;
    for (var i = 0; i < list.length; ++i) {
        var f = list[i];
        if (f.isDirectory()) {
            if (String(f.getName()) !== BACKUP_FOLDER) eonFiles(f, out);
        } else if (/\.eon$/i.test(String(f.getName()))) {
            out.push(f);
        }
    }
    return out;
}

function chooseFolder() {
    var project = Eons.getOpenProject ? Eons.getOpenProject() : null;
    if (project != null) return project.getFile();
    var chooser = new javax.swing.JFileChooser();
    chooser.setFileSelectionMode(javax.swing.JFileChooser.DIRECTORIES_ONLY);
    chooser.setDialogTitle('Folder of AHLCG cards to check');
    if (chooser.showOpenDialog(Eons.window) !== javax.swing.JFileChooser.APPROVE_OPTION) return null;
    return chooser.getSelectedFile();
}

function run(root) {
    var counts = { checked: 0, listed: 0, changed: 0, failed: 0 };
    var files = eonFiles(root, []);
    var unused = {};
    for (var key in FIXES) unused[key] = true;
    println('Checking cards in ' + root);
    for (var i = 0; i < files.length; ++i) {
        var file = files[i];
        var name = String(root.toPath().relativize(file.toPath())).replace(/\\/g, '/');
        try {
            var gc = ResourceKit.getGameComponentFromFile(file, false);
            var handler = gc == null ? null : handlerOf(gc);
            if (handler == null) continue;
            ++counts.checked;
            var note = gc.getSettings().get('HighResNote');
            var hint = suspect(gc, handler);
            var factor = FIXES[name];
            if (note == null && hint == null && factor == null) continue;
            ++counts.listed;
            println('  ' + name + ' (' + handler + ')');
            if (note != null) println('      plug-in: ' + note);
            if (hint != null) println('      ' + hint);
            if (!APPLY) continue;
            var changed = false;
            if (factor != null) {
                delete unused[name];
                reduce(gc, handler, factor);
                println('      reduced by ' + JSON.stringify(factor));
                changed = true;
            }
            if (note != null && CLEAR_NOTES) {
                gc.getSettings().reset('HighResNote');
                println('      note cleared');
                changed = true;
            }
            if (changed) {
                backup(root, file);
                ResourceKit.writeGameComponentToFile(file, gc);
                ++counts.changed;
            }
        } catch (ex) {
            ++counts.failed;
            println('  ' + name + ': failed: ' + ex);
        }
    }
    for (key in unused) println('  ' + key + ': listed in FIXES but not found');
    println(counts.checked + ' AHLCG cards checked, ' + counts.listed + ' listed, ' +
        counts.changed + ' changed, ' + counts.failed + ' failed');
    if (APPLY && counts.changed > 0) println('Originals were copied to ' + new File(root, BACKUP_FOLDER));
    return counts;
}

if (!pluginCorrectsCards()) {
    println('Install the current AHLCG plug-in first: it corrects most affected cards when they are opened.');
} else {
    var root = chooseFolder();
    if (root != null) run(root);
}
