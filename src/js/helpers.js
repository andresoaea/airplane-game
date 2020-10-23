export default {
    capFirstLetter(val) {
        return val.charAt(0).toUpperCase() + val.slice(1);
    },
    removeSpaces(val) {
        return val.replace(/\s+/g, ' ').trim();
    },
};
