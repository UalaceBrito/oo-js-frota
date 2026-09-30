/**
 * Classe abstrata que representa um veículo genérico da frota.
 * Não pode ser instanciada diretamente — serve como contrato para as subclasses.
 *
 * @abstract
 */
export class Vehicle {
  #id;
  #plate;
  #brand;
  #model;
  #year;
  #mileage;
  #fuelLevel;
  #status;

  /**
   * @param {object} data
   * @param {string} data.plate   - Placa no padrão Mercosul ou antigo.
   * @param {string} data.brand   - Marca (ex.: "Volkswagen").
   * @param {string} data.model   - Modelo (ex.: "Gol").
   * @param {number} data.year    - Ano de fabricação.
   * @param {number} [data.mileage=0] - Quilometragem inicial.
   */
  constructor({ plate, brand, model, year, mileage = 0 }) {
    if (new.target === Vehicle) {
      throw new TypeError(
        'Vehicle é uma classe abstrata e não pode ser instanciada diretamente.'
      );
    }
    if (typeof year !== 'number' || year < 1900 || year > new Date().getFullYear() + 1) {
      throw new Error('Ano do veículo inválido.');
    }
    if (mileage < 0) throw new Error('Quilometragem não pode ser negativa.');

    this.#id        = crypto.randomUUID();
    this.#plate     = Vehicle.#normalizePlate(plate);
    this.#brand     = brand;
    this.#model     = model;
    this.#year      = year;
    this.#mileage   = mileage;
    this.#fuelLevel = 100; // sempre sai da concessionária cheio 😉
    this.#status    = 'AVAILABLE';
  }

  static #normalizePlate(plate) {
    const clean = String(plate).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const mercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/;   // ABC1D23
    const old      = /^[A-Z]{3}\d{4}$/;          // ABC1234
    if (!mercosul.test(clean) && !old.test(clean)) {
      throw new Error(`Placa inválida: ${plate}`);
    }
    return clean;
  }

  // ---------- Getters (encapsulamento) ----------
  get id()        { return this.#id; }
  get plate()     { return this.#plate; }
  get brand()     { return this.#brand; }
  get model()     { return this.#model; }
  get year()      { return this.#year; }
  get mileage()   { return this.#mileage; }
  get fuelLevel() { return this.#fuelLevel; }
  get status()    { return this.#status; }

  get fullName() { return `${this.#brand} ${this.#model} (${this.#year})`; }

  /** @protected */
  _setStatus(newStatus) {
    const allowed = ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'RETIRED'];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Status inválido: ${newStatus}`);
    }
    this.#status = newStatus;
  }

  /** @protected */
  _consumeFuel(percent) {
    if (percent < 0) throw new Error('Consumo deve ser positivo.');
    this.#fuelLevel = Math.max(0, this.#fuelLevel - percent);
  }

  /** @protected */
  _addMileage(km) {
    if (km < 0) throw new Error('Quilometragem adicionada não pode ser negativa.');
    this.#mileage += km;
  }

  /** Abastece o tanque (0–100). */
  refuel(percent = 100) {
    if (percent < 0 || percent > 100) {
      throw new Error('Percentual de abastecimento deve estar entre 0 e 100.');
    }
    this.#fuelLevel = Math.min(100, this.#fuelLevel + percent);
    return this.#fuelLevel;
  }

  /**
   * Método abstrato — toda subclasse DEVE implementar.
   * Retorna o custo estimado para uma determinada distância.
   * @abstract
   * @param {number} km
   * @returns {number}
   */
  estimateCost(km) {
    throw new Error('O método estimateCost() deve ser implementado pela subclasse.');
  }

  /**
   * Método abstrato — descreve características específicas do veículo.
   * @abstract
   * @returns {object}
   */
  describe() {
    throw new Error('O método describe() deve ser implementado pela subclasse.');
  }

  /**
   * Template Method: orquestra uma viagem.
   * Define o "esqueleto" — subclasses implementam os passos variáveis.
   * @param {number} km
   * @returns {object}
   */
  travel(km) {
    if (typeof km !== 'number' || km <= 0) {
      throw new Error('Distância da viagem deve ser um número positivo.');
    }
    if (this.#status !== 'AVAILABLE') {
      throw new Error(`Veículo ${this.#plate} não está disponível (status: ${this.#status}).`);
    }
    if (this.#fuelLevel <= 5) {
      throw new Error(`Veículo ${this.#plate} precisa abastecer antes de viajar.`);
    }

    this._setStatus('IN_USE');
    try {
      const fuelUsed = this._calculateFuelUsage(km);
      this._consumeFuel(fuelUsed);
      this._addMileage(km);
      const cost = this.estimateCost(km);

      this._setStatus('AVAILABLE');
      return Object.freeze({
        vehicleId: this.#id,
        plate: this.#plate,
        type: this.constructor.name,
        distanceKm: km,
        fuelUsedPercent: Number(fuelUsed.toFixed(2)),
        fuelRemaining: this.#fuelLevel,
        totalMileage: this.#mileage,
        estimatedCostBRL: Number(cost.toFixed(2)),
      });
    } catch (err) {
      this._setStatus('AVAILABLE'); // rollback
      throw new Error(`Falha na viagem [${this.constructor.name}]: ${err.message}`);
    }
  }

  /**
   * Consumo baseado no tipo — subclasses sobrescrevem.
   * @protected
   * @param {number} km
   * @returns {number} percentual de tanque consumido
   */
  _calculateFuelUsage(km) {
    return km * 0.01; // fallback: 1% por km
  }

  toString() {
    return `${this.constructor.name} | ${this.#plate} | ${this.fullName} | ${this.#status}`;
  }
}
