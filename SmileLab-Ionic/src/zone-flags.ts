/**
 * @fileoverview Configuración de flags de Zone.js previos al arranque de Angular.
 * Optimiza el rendimiento desactivando el parcheo automático de Web Components de Ionic.
 */
/**
 * Prevents Angular change detection from
 * running with certain Web Component callbacks
 */
// eslint-disable-next-line no-underscore-dangle
(window as any).__Zone_disable_customElements = true;
