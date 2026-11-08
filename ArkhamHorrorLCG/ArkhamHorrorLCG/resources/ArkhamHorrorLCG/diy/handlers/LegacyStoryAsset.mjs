// Legacy story assets were of the Neutral or Weakness class; as assets they
// are of the Story or StoryWeakness class.
//
// Module: returns { upgrade }.

function upgrade(settings, suffix) {
    var key = 'CardClass' + suffix;
    var weakness = String(settings.get(key)) === 'Weakness';
    settings.set(key, weakness ? 'StoryWeakness' : 'Story');
}

export default { upgrade: upgrade };
