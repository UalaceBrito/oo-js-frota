import { Vehicle } from './Vehicle.js';

export class Car extends Vehicle {
  #seats;
  #fuelType;      // 'GASOLINE' | 'FLEX' | 'ELECTRIC' | 'HYBRID'
  #consumption;   // km/l (ou km/kWh se elétrico)

  constructor(data, { seats = 5, fuelType = 'FLEX', consumption = 12 } = {}) {
    super(data);
    if (seats < 1 || seats > 9) throw new Error('Número de assentos deve ser entre 1 e 9.');
    if (consumption <= 0) throw new Error('Consumo deve ser positivo.');

    this.#seats       = seats;
    this.#fuelType    = fuelType;
    this.#consumption = consumption;
  }

  get seats()     { return this.#seats; }
  get fuelType()  { return this.#fuelType; }

  _calculateFuelUsage(km) {
    // Quanto maior o consumo (km/l), menos % do tanque usa
    return (km / this.#consumption) * 0.8;
  }

  estimateCost(km) {
    const pricePerUnit = this.#fuelType === 'ELECTRIC' ? 0.85 : 5.89; // R$/kWh ou R$/l
    return (km / this.#consumption) * pricePerUnit;
  }

  describe() {
    return {
      category: 'Passeio',
      seats: this.#seats,
      fuelType: this.#fuelType,
      consumption: `${this.#consumption} km/l`,
    };
  }
}
