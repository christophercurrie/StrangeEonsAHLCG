useLibrary( 'extension' );
function getName() {
	return 'Arkham Horror LCG HD templates';
}
function getDescription() {
	return 'HD templates for the Arkham Horror LCG plugin';
}
function getVersion() {
	return 9.96;
}

function initialize() {
    var game = Game.get('AHLCG');
    if (game == null) {
        alert("[Arkham Horror LCG HD] Cannot find registered game, Arkham Horror LCG plugin is mising", true);
        return false;
    }

    let found = false;
    for (let ext of arkham.plugins.BundleInstaller.getInstalledExtensions()) {
        if (ext.getCatalogID().getUUID().toString().equals("0b899f3c-78ae-40b8-bcfc-b06479b1f136")) {
            if (ext.getPlugin().getPluginVersion() < getVersion()) {
                alert("[Arkham Horror LCG HD] Arkham Horror LCG plugin version must be " + getVersion() + " or later", true);
                return false;
            }
            found = true;
            break;
        }
    }

    if (!found) {
        alert("[Arkham Horror LCG HD] Arkham Horror LCG plugin is mising", true);
        return false;
    }

    game.masterSettings.addSettingsFrom('ArkhamHorrorLCG/hd/AHLCG-HD.settings');
    return true;
}

function unload() {
}
