/**
 * Classe Loader minimale pour satisfaire la dépendance dans omk.js
 */
export class loader {
    constructor() {
        // Le constructeur est minimal
    }

    show() {
        console.log('Loader: Displaying...');
    }

    hide(instant = false) {
        console.log('Loader: Hiding...');
    }
}