# 🚗 OO JS — Sistema de Gestão de Frota

Exercício de Orientação a Objetos em JavaScript (ES2022+) demonstrando:

- **Classe abstrata** (`Vehicle`) — não instanciável, define contrato via `new.target`.
- **Encapsulamento real** — campos privados (`#id`, `#plate`, `#mileage`, `#fuelLevel`).
- **Herança** — `Car`, `Truck`, `Motorcycle` estendem `Vehicle`.
- **Polimorfismo** — `travel()` e `estimateCost()` com comportamentos distintos por tipo.
- **Template Method** — `travel()` orquestra o fluxo; subclasses implementam `_calculateFuelUsage`.
- **Validações ricas** — placa Mercosul/antiga, ano, assentos, carga, cilindrada.
- **Recursos exclusivos** — `Truck.estimateFreightCost()` e `Motorcycle.requiresSpecialLicense()`.

## ▶️ Executar

```bash
node src/index.js
```

## 🧠 Conceitos aplicados

| Conceito           | Onde                                              |
|--------------------|---------------------------------------------------|
| Abstração          | `Vehicle` (não instanciável)                      |
| Encapsulamento     | Campos `#private` + getters                       |
| Herança            | `extends Vehicle` nas 3 subclasses                |
| Polimorfismo       | Loop único chamando `travel()`                    |
| Template Method    | `Vehicle.travel()` → `_calculateFuelUsage()` hook |
| Imutabilidade      | `Object.freeze` no relatório de viagem            |
