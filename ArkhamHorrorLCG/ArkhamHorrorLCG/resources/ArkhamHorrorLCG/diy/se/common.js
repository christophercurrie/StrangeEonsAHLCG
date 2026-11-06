// Strange Eons application objects and types, from the common library.
//
// Module: returns { Eons, Language, Region, ResourceKit, Settings,
// StrangeImage, alert, confirm }.
/* global Eons, Language, Region, ResourceKit, Settings, resources, alert,
   confirm */
define(function () {
    return {
        Eons: Eons,
        Language: Language,
        Region: Region,
        ResourceKit: ResourceKit,
        Settings: Settings,
        StrangeImage: resources.StrangeImage,
        alert: alert,
        confirm: confirm,
    };
});
