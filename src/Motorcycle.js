import { Vehicle } from './Vehicle.js';

export class Motorcycle extends Vehicle {
  #cylinderCapacity; // cilindradas
  #hasSidecar;
  #consumption;

  constructor(data, { cylinderCapacity, hasSidecar = false, consumption = 35 } = {}) {
    super(data);
    if (!cylinderCapacity || cylinderCapacity < 50) {
      throw new Error('Cilindrada mínima é 50cc.');
    }
    this.#cylinderCapacity = cylinderCapacity;
    this.#hasSidecar       = hasSidecar;
    this.#consumption      = consumption;
  }

  get cylinderCapacity() { return this.#cylinderCapacity; }
  get hasSidecar()       { return this.#hasSidecar; }

  _calculateFuelUsage(km) {
    return (km / this.#consumption) * 0.6;
  }

  estimateCost(km) {
    return (km / this.#consumption) * 5.89; // gasolina
  }

  /** Regra de negócio específica: motos acima de 500cc exigem CNH categoria A. */
  requiresSpecialLicense() {
    return this.#cylinderCapacity > 500;
  }

  describe() {
    return {
      category: 'Motocicleta',
      cylinderCapacity: `${this.#cylinderCapacity}cc`,
      sidecar: this.#hasSidecar ? 'Sim' : 'Não',
      consumption: `${this.#consumption} km/l`,
      specialLicense: this.requiresSpecialLicense() ? 'Categoria A' : 'Padrão',
    };
  }
}
