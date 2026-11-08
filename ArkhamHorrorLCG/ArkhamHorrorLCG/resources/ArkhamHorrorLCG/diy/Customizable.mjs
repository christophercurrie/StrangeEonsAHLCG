// A customizable upgrade sheet with its own back.
import ShimHandler from './handlers/ShimHandler.mjs';
import CustomizableBackFace from './faces/CustomizableBackFace.mjs';
import CustomizableFace from './faces/CustomizableFace.mjs';

export class CustomizableHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-Customizable-Default',
                'AHLCG-CustomizableBack-Default',
            ],
            faces: [CustomizableFace, CustomizableBackFace],
            legacyPortraits: ['Collection'],
        });
    }
}
