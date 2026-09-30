import { Vehicle } from './Vehicle.js';

export class Truck extends Vehicle {
  #capacityTons;
  #axles;
  #consumption; // km/l (caminhões consomem mais)

  constructor(data, { capacityTons, axles = 2, consumption = 4 } = {}) {
    super(data);
    if (!capacityTons || capacityTons <= 0) {
      throw new Error('Capacidade de carga (toneladas) é obrigatória.');
    }
    if (axles < 2 || axles > 9) throw new Error('Número de eixos deve ser entre 2 e 9.');

    this.#capacityTons = capacityTons;
    this.#axles        = axles;
    this.#consumption  = consumption;
  }

  get capacityTons() { return this.#capacityTons; }
  get axles()        { return this.#axles; }

  _calculateFuelUsage(km) {
    // Caminhão consome proporcionalmente mais
    return (km / this.#consumption) * 1.2;
  }

  estimateCost(km) {
    return (km / this.#consumption) * 6.15; // diesel
  }

  /** Método exclusivo da subclasse — carga extra impacta o custo. */
  estimateFreightCost(km, cargoTons) {
    if (cargoTons > this.#capacityTons) {
      throw new Error(`Carga de ${cargoTons}t excede a capacidade de ${this.#capacityTons}t.`);
    }
    const base = this.estimateCost(km);
    const overloadFactor = 1 + cargoTons / this.#capacityTons * 0.5;
    return Number((base * overloadFactor).toFixed(2));
  }

  describe() {
    return {
      category: 'Carga',
      capacityTons: this.#capacityTons,
      axles: this.#axles,
      consumption: `${this.#consumption} km/l (diesel)`,
    };
  }
}
