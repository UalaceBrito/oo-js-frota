import { Car }        from './Car.js';
import { Truck }      from './Truck.js';
import { Motorcycle } from './Motorcycle.js';
import { Vehicle }    from './Vehicle.js';

/** Mapa polimórfico — a frota trata todos os veículos uniformemente. */
const fleet = [
  new Car(
    { plate: 'ABC1D23', brand: 'Volkswagen', model: 'Gol', year: 2023, mileage: 12000 },
    { seats: 5, fuelType: 'FLEX', consumption: 14 }
  ),
  new Truck(
    { plate: 'XYZ9876', brand: 'Volvo', model: 'FH 460', year: 2022, mileage: 85000 },
    { capacityTons: 25, axles: 3, consumption: 3.5 }
  ),
  new Motorcycle(
    { plate: 'MOT1234', brand: 'Honda', model: 'CB 650R', year: 2024, mileage: 3200 },
    { cylinderCapacity: 649, consumption: 22 }
  ),
];

const run = () => {
  console.log('🚗  GESTÃO DE FROTA — DEMO OO/JS\n');
  console.log('─'.repeat(70));

  // 1) Descrição polimórfica
  fleet.forEach(v => {
    console.log(`\n▶ ${v.toString()}`);
    console.log('  ', v.describe());
  });

  console.log('\n' + '─'.repeat(70));
  console.log('\n🛣️  SIMULAÇÃO DE VIAGENS\n');

  // 2) Viagens polimórficas
  fleet.forEach(v => {
    try {
      const report = v.travel(150);
      console.log(`✅ ${report.plate} (${report.type})`);
      console.log('  ', report, '\n');
    } catch (err) {
      console.error(`❌ ${err.message}\n`);
    }
  });

  // 3) Recurso exclusivo de Truck
  const truck = fleet.find(v => v instanceof Truck);
  console.log('📦  Custo de frete (Truck, 500 km, 20t):',
    `R$ ${truck.estimateFreightCost(500, 20)}`);

  // 4) Recurso exclusivo de Motorcycle
  const moto = fleet.find(v => v instanceof Motorcycle);
  console.log('🏍️  Moto requer CNH especial?', moto.requiresSpecialLicense() ? 'Sim' : 'Não');

  // 5) Validação — tentar instanciar a classe abstrata
  console.log('\n' + '─'.repeat(70));
  console.log('\n⚠️  Testando proteção contra instanciar a classe abstrata...\n');
  try {
    new Vehicle({ plate: 'AAA0000', brand: 'X', model: 'Y', year: 2020 });
  } catch (err) {
    console.log(`✔️  Bloqueado corretamente: ${err.message}`);
  }
};

run();
