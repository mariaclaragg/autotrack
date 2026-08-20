export type ContaReceber = {
  id: string
  documento: string
  emissao: string
  cliente: string
  valor: number
  vencimento: string
  valorRecebido: number
  contaOrigem: string
  status: "recebido" | "pendente" | "atrasado"
}

export type Cliente = {
  id: string
  nome: string
  documento: string
  cep: string
  logradouro: string
  bairro: string
  municipio: string
  uf: string
  telefone: string
}

export type Fornecedor = {
  id: string
  nome: string
  documento: string
  categoria: string
  municipio: string
  uf: string
  telefone: string
}

export type StatusViagem = "Planejada" | "Em Carregamento" | "Em Trânsito" | "Entregue"

export type Viagem = {
  id: string
  codigo: string
  motorista: string
  veiculo: string
  origem: string
  destino: string
  status: StatusViagem
  progresso: number
  cargaAtual: number
  cargaTotal: number
  previsao: string
}

export type NotaFiscal = {
  id: string
  numero: string
  tipo: string
  motorista: string
  valor: number
  data: string
  status: "pendente" | "aprovado" | "recusado"
}

export type VeiculoEmbarcado = {
  id: string
  placa: string
  modelo: string
  cor: string
  gps: string
  entregue: boolean
}

export type Despesa = {
  id: string
  tipo: string
  valor: number
  data: string
  comprovante: boolean
}

export const contasReceber: ContaReceber[] = [
  { id: "1", documento: "NF-8821", emissao: "01/08/2026", cliente: "Localiza Rent a Car S.A.", valor: 18450.0, vencimento: "15/08/2026", valorRecebido: 18450.0, contaOrigem: "Carreta Branca", status: "recebido" },
  { id: "2", documento: "NF-8822", emissao: "02/08/2026", cliente: "Movida Locação de Veículos", valor: 12300.5, vencimento: "18/08/2026", valorRecebido: 0, contaOrigem: "Guincho 3", status: "pendente" },
  { id: "3", documento: "NF-8823", emissao: "03/08/2026", cliente: "Unidas Frotas Ltda", valor: 27890.0, vencimento: "10/08/2026", valorRecebido: 0, contaOrigem: "Gaivota", status: "atrasado" },
  { id: "4", documento: "NF-8824", emissao: "05/08/2026", cliente: "Chevrolet Concessionária SP", valor: 9800.0, vencimento: "22/08/2026", valorRecebido: 9800.0, contaOrigem: "Carreta Branca", status: "recebido" },
  { id: "5", documento: "NF-8825", emissao: "06/08/2026", cliente: "Auto Shopping Fortaleza", valor: 15670.75, vencimento: "25/08/2026", valorRecebido: 0, contaOrigem: "Guincho 3", status: "pendente" },
  { id: "6", documento: "NF-8826", emissao: "08/08/2026", cliente: "Localiza Rent a Car S.A.", valor: 21400.0, vencimento: "05/08/2026", valorRecebido: 0, contaOrigem: "Gaivota", status: "atrasado" },
  { id: "7", documento: "NF-8827", emissao: "10/08/2026", cliente: "Volkswagen Distribuidora", valor: 33250.0, vencimento: "28/08/2026", valorRecebido: 0, contaOrigem: "Carreta Branca", status: "pendente" },
]

export const contasPagar: ContaReceber[] = [
  { id: "p1", documento: "BOL-5501", emissao: "01/08/2026", cliente: "Posto Ipiranga Rodovias", valor: 8900.0, vencimento: "12/08/2026", valorRecebido: 8900.0, contaOrigem: "Combustível", status: "recebido" },
  { id: "p2", documento: "BOL-5502", emissao: "03/08/2026", cliente: "Michelin Pneus Ltda", valor: 14500.0, vencimento: "20/08/2026", valorRecebido: 0, contaOrigem: "Manutenção", status: "pendente" },
  { id: "p3", documento: "BOL-5503", emissao: "05/08/2026", cliente: "Seguradora Porto Frota", valor: 6200.0, vencimento: "08/08/2026", valorRecebido: 0, contaOrigem: "Seguro", status: "atrasado" },
  { id: "p4", documento: "BOL-5504", emissao: "07/08/2026", cliente: "ANTT Pedágios EletrÔnicos", valor: 3450.9, vencimento: "18/08/2026", valorRecebido: 0, contaOrigem: "Pedágio", status: "pendente" },
]

export const clientes: Cliente[] = [
  { id: "1", nome: "Localiza Rent a Car S.A.", documento: "16.670.085/0001-55", cep: "31270-010", logradouro: "Av. Bernardo Monteiro, 1563", bairro: "Funcionários", municipio: "Belo Horizonte", uf: "MG", telefone: "(31) 3247-7000" },
  { id: "2", nome: "Movida Locação de Veículos", documento: "21.314.559/0001-66", cep: "04543-011", logradouro: "R. Dr. Renato Paes, 1017", bairro: "Vila Olímpia", municipio: "São Paulo", uf: "SP", telefone: "(11) 3230-5100" },
  { id: "3", nome: "Unidas Frotas Ltda", documento: "04.437.534/0001-30", cep: "04794-000", logradouro: "Av. Roque Petroni Jr, 850", bairro: "Vila Cordeiro", municipio: "São Paulo", uf: "SP", telefone: "(11) 4166-9500" },
  { id: "4", nome: "Chevrolet Concessionária SP", documento: "59.275.792/0001-50", cep: "01310-100", logradouro: "Av. Paulista, 2300", bairro: "Bela Vista", municipio: "São Paulo", uf: "SP", telefone: "(11) 3170-4400" },
  { id: "5", nome: "Auto Shopping Fortaleza", documento: "07.891.234/0001-12", cep: "60175-047", logradouro: "Av. Washington Soares, 909", bairro: "Edson Queiroz", municipio: "Fortaleza", uf: "CE", telefone: "(85) 3311-2200" },
  { id: "6", nome: "Volkswagen Distribuidora", documento: "59.104.422/0001-99", cep: "09823-000", logradouro: "Via Anchieta, Km 23,5", bairro: "Demarchi", municipio: "São Bernardo do Campo", uf: "SP", telefone: "(11) 4347-1000" },
]

export const fornecedores: Fornecedor[] = [
  { id: "1", nome: "Posto Ipiranga Rodovias", documento: "33.000.167/0001-01", categoria: "Combustível", municipio: "Ribeirão Preto", uf: "SP", telefone: "(16) 3620-1100" },
  { id: "2", nome: "Michelin Pneus Ltda", documento: "33.417.144/0001-30", categoria: "Manutenção", municipio: "Campo Grande", uf: "RJ", telefone: "(21) 2483-9000" },
  { id: "3", nome: "Seguradora Porto Frota", documento: "61.198.164/0001-60", categoria: "Seguros", municipio: "São Paulo", uf: "SP", telefone: "(11) 3366-3377" },
  { id: "4", nome: "Oficina Diesel Master", documento: "12.345.678/0001-90", categoria: "Manutenção", municipio: "Curitiba", uf: "PR", telefone: "(41) 3022-8080" },
]

export const viagens: Viagem[] = [
  { id: "1", codigo: "#1042", motorista: "Roberto Silva", veiculo: "Cegonha - Carreta Branca", origem: "São Paulo/SP", destino: "Rio de Janeiro/RJ", status: "Em Trânsito", progresso: 62, cargaAtual: 4, cargaTotal: 8, previsao: "Hoje, 18:30" },
  { id: "2", codigo: "#1043", motorista: "Carlos Mendes", veiculo: "Cegonha - Gaivota", origem: "Belo Horizonte/MG", destino: "Salvador/BA", status: "Em Carregamento", progresso: 15, cargaAtual: 6, cargaTotal: 10, previsao: "Amanhã, 09:00" },
  { id: "3", codigo: "#1044", motorista: "José Aparecido", veiculo: "Guincho 3", origem: "Curitiba/PR", destino: "Florianópolis/SC", status: "Entregue", progresso: 100, cargaAtual: 2, cargaTotal: 2, previsao: "Concluída" },
  { id: "4", codigo: "#1045", motorista: "Marcos Antônio", veiculo: "Cegonha - Carreta Azul", origem: "Fortaleza/CE", destino: "Recife/PE", status: "Planejada", progresso: 0, cargaAtual: 0, cargaTotal: 8, previsao: "22/08, 06:00" },
]

export const notasFiscais: NotaFiscal[] = [
  { id: "1", numero: "NF-e 44521", tipo: "Combustível", motorista: "Roberto Silva", valor: 850.0, data: "15/08/2026", status: "pendente" },
  { id: "2", numero: "NF-e 44522", tipo: "Pedágio", motorista: "Carlos Mendes", valor: 234.5, data: "15/08/2026", status: "pendente" },
  { id: "3", numero: "NF-e 44510", tipo: "Alimentação", motorista: "José Aparecido", valor: 92.0, data: "14/08/2026", status: "aprovado" },
  { id: "4", numero: "NF-e 44499", tipo: "Manutenção", motorista: "Marcos Antônio", valor: 1450.0, data: "13/08/2026", status: "recusado" },
]

export const veiculosEmbarcados: VeiculoEmbarcado[] = [
  { id: "1", placa: "RJK-1A22", modelo: "Volkswagen Nivus", cor: "Branco", gps: "São Paulo/SP", entregue: true },
  { id: "2", placa: "FCP-9E88", modelo: "Fiat Pulse", cor: "Vermelho", gps: "Guarulhos/SP", entregue: true },
  { id: "3", placa: "GBR-4K10", modelo: "Hyundai Creta", cor: "Cinza", gps: "São José dos Campos/SP", entregue: false },
  { id: "4", placa: "PZT-2B55", modelo: "Toyota Corolla", cor: "Preto", gps: "Resende/RJ", entregue: false },
]

export const fluxoCaixaData = [
  { mes: "Mar", receita: 185000, despesa: 142000 },
  { mes: "Abr", receita: 210000, despesa: 158000 },
  { mes: "Mai", receita: 198000, despesa: 149000 },
  { mes: "Jun", receita: 245000, despesa: 171000 },
  { mes: "Jul", receita: 268000, despesa: 183000 },
  { mes: "Ago", receita: 283907, despesa: 192400 },
]

export const composicaoFrota = [
  { nome: "Carreta Branca", value: 38, cor: "#2563eb" },
  { nome: "Gaivota", value: 27, cor: "#0f172a" },
  { nome: "Guincho 3", value: 21, cor: "#16a34a" },
  { nome: "Carreta Azul", value: 14, cor: "#d97706" },
]

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}
