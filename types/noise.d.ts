// Type definitions for noisejs
// Project: https://github.com/xixixao/noisejs
// Definitions by: Atsushi Izumihara <https://github.com/izmhr>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module noise {
  /**
   * 2D simplex noise
   * @param  {number} x
   * @param  {number} y
   * @return {number} noise value
   */
  function simplex2(x: number, y: number): number;

  /**
   * 3D simplex noise
   * @param  {number} x
   * @param  {number} y
   * @param  {number} z
   * @return {number} noise value
   */
  function simplex3(x: number, y: number, z: number): number;

  /**
   * 2D Perlin Noise
   * @param  {number} x
   * @param  {number} y
   * @return {number} noise value
   */
  function perlin2(x: number, y: number): number;

  /**
   * 3D Perlin Noise
   * @param  {number} x
   * @param  {number} y
   * @param  {number} z
   * @return {number} noise value
   */
  function perlin3(x: number, y: number, z: number): number;

  /**
   * This isn't a very good seeding function, but it works ok. It supports 2^16
   * different seed values. Write something better if you need more seeds.
   * @param {number} seed [description]
   */
  function seed(seed: number): void;
}
