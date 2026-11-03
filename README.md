# An Arkham Horror LCG plugin for Strange Eons.

This plugin has been adopted by strange-eons, from the original StrangeEonsAHLCG
plugin by Pilute23/JaqenZann/tokeeto.

## How to use
1. Download and install [Strange Eons](https://strangeeons.org/).
2. The plugin is published to the Strange Eons plugin repository. Open the
   "Toolbox" menu in Strange Eons and select "Catalog...", and look for
   Arkham Horror: The Card Game.
3. Optionally, for high resolution exports, also down the Ark
4. Create new content for Arkham Horror LCG and share it with the community.
5. Repeat ad infinitum.

## How to contribute
If you wish to make changes to the AHLCG plugin yourself, and potentially make
a pull request, here's how to do it:

1. Clone/download this repository
2. Open the project in the [ArkhamHorrorLCG](ArkhamHorrorLCG) folder.
3. Right-click on the Plugin folder in SE, and click "test plugin". This will 
   open up a test instance of SE with your new version installed.
4. Open the Plugin[ArkhamHorrorLCG](ArkhamHorrorLCG/ArkhamHorrorLCG) folder in
   SE, find the file you want to change, and make changes. If you are adding
   new templates, be sure to add 600 dpi versions in
   [ArkhamHorrorLCGHD](ArkhamHorrorLCG/ArkhamHorrorLCGHD), and 150 dpi versions
   in the regular folder.
5. Repeat steps 3-4 until you're satisfied.
6. Make a pull request with your changes, and a solid description of what they fix.

### What even is github?
This "step by step" guide is a bit superficial - this is because git and
github usage is outside the scope of this guide. If you've made a change and
want to contribute it, but don't know how, use the "Issues" tab above, or join
the [Mythos Busters](https://discord.gg/uQdp8DmFN) discord server and look for
the [Strange Eons: AHLCG Plugin thread in the #arkham-dev-projects channel]
(https://discord.com/channels/225349059689447425/1194078865795059795).

### What is java and javascript?
Programming in general is also outside the scope of this guide, but many this
can be changed without knowing exactly why it works the way it does.

Generally, cards are handled by a `diy/CardType.js` file, and a
`settings/AHLCG-CardType.setting` file. In there, a lot of stuff, like
location on card, text alignment, color, font type, are plainly readable and
can be changed. More advanced stuff, like showing/hiding stuff under certain
conditions, requires javascript knowledge.

**NB:** If you _are_ familiar with JavaScript, be aware that (as of the 3.5
version) Strange Eons provides an older version of JavaScript that lacks
modern features such as classes or asynchronous behaviors, so the code in this
project may feel a bit antiquated. There is hope for a javascript upgrade in
future versions, but for now you may find that additions require more code.
Your contributions are appreciated!
