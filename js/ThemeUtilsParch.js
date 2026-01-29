import ThemeUtils from 'qwc2/utils/ThemeUtils';

// Sauvegarder la fonction originale
const originalApplyTranslations = ThemeUtils.applyTranslations;

// Patch pour gérer les items sans translations
ThemeUtils.applyTranslations = function(group) {
    if (!group) return group;
    
    // Assurer que chaque item a un objet translations
    const patchedGroup = {
        ...group,
        subdirs: group.subdirs ? group.subdirs.map(ThemeUtils.applyTranslations) : null,
        items: group.items ? group.items.map(item => ({
            ...item,
            translations: item.translations || {}  // Fix ici !
        })) : null
    };
    
    return originalApplyTranslations(patchedGroup);
};

export default ThemeUtils;