useLibrary( 'extension' );
function getName() {
	return 'Arkham Horror LCG HD templates';
}
function getDescription() {
	return 'HD templates for the Arkham Horror LCG plugin';
}
function getVersion() {
	return 1.0;
}

function initialize() {
    var game = Game.get('AHLCG');
    if (game == null) {
        Eons.log.warning("Arkham Horror LCG HD cannot find the base plugin");
        return false;
    }

    game.masterSettings.addSettingsFrom('ArkhamHorrorLCG/hd/AHLCG-HD.settings');
    return true;
}

function unload() {
}
