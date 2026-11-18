/** Bounded CycloneDX Surface consumer API; no research runner or Lab authority. */
export {checkSurfaceBom, property, prefix, projectDependencies} from './surface-bom.js';
export type {Bom, Surface, Relationship, Entry, Evidence, Presentation} from './surface-bom.js';
export {renderSurface} from './surface-view.js';
export {saveSurface, readSurface, byteDigest} from './skill-surface-store.js';
