import { Producer, ProducerStatus, ProducerType } from '../models/producer.model';

/**
 * Mock producer data matching the screenshot
 */
export const mockProducers: Producer[] = [
  {
    id: '1',
    name: 'João Miguel Oliveira',
    type: ProducerType.FARM_GROUP,
    numberOfFarms: 4,
    serasa: '1/4',
    eudr: '1/4',
    status: ProducerStatus.CREATED,
    tenantId: 'tenant-1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Carolina Almeida Pereira',
    type: ProducerType.FARM_GROUP,
    numberOfFarms: 4,
    serasa: '1/4',
    eudr: '1/4',
    status: ProducerStatus.IN_REVIEW,
    tenantId: 'tenant-1',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '3',
    name: 'Bruno Silva',
    type: ProducerType.FARM_GROUP,
    numberOfFarms: 4,
    serasa: '1/4',
    eudr: '1/4',
    status: ProducerStatus.CREATED,
    tenantId: 'tenant-1',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  },
  {
    id: '4',
    name: 'Ana Paula Santos',
    type: ProducerType.FARM_GROUP,
    numberOfFarms: 4,
    serasa: '1/4',
    eudr: '1/4',
    status: ProducerStatus.IN_REVIEW,
    tenantId: 'tenant-1',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '5',
    name: 'Pedro Henrique Andrade',
    type: ProducerType.FARM_GROUP,
    numberOfFarms: 4,
    serasa: '1/4',
    eudr: '1/4',
    status: ProducerStatus.REJECTED,
    tenantId: 'tenant-1',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '6',
    name: 'Mariana Costa',
    type: ProducerType.FARM_GROUP,
    numberOfFarms: 4,
    serasa: '1/4',
    eudr: '1/4',
    status: ProducerStatus.CREATED,
    tenantId: 'tenant-1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '7',
    name: 'Ricardo Ferreira',
    type: ProducerType.FARM_GROUP,
    numberOfFarms: 4,
    serasa: '1/4',
    eudr: '1/4',
    status: ProducerStatus.IN_REVIEW,
    tenantId: 'tenant-1',
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-13')
  },
  {
    id: '8',
    name: 'Juliana Rodrigues',
    type: ProducerType.FARM_GROUP,
    numberOfFarms: 4,
    serasa: '1/4',
    eudr: '1/4',
    status: ProducerStatus.CREATED,
    tenantId: 'tenant-1',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '9',
    name: 'Fernando Alves',
    type: ProducerType.FARM_GROUP,
    numberOfFarms: 4,
    serasa: '1/4',
    eudr: '1/4',
    status: ProducerStatus.IN_REVIEW,
    tenantId: 'tenant-1',
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '10',
    name: 'Luciana Martins',
    type: ProducerType.FARM_GROUP,
    numberOfFarms: 4,
    serasa: '1/4',
    eudr: '1/4',
    status: ProducerStatus.CREATED,
    tenantId: 'tenant-1',
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06')
  },
  {
    id: '11',
    name: 'Gustavo Lima',
    type: ProducerType.FARM_GROUP,
    numberOfFarms: 4,
    serasa: '1/4',
    eudr: '1/4',
    status: ProducerStatus.APPROVED,
    tenantId: 'tenant-1',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10')
  },
  // Add more mock data to reach 1200 total (for pagination demo)
  ...Array.from({ length: 1189 }, (_, i) => ({
    id: `producer-${i + 12}`,
    name: `Producer ${i + 12}`,
    type: ProducerType.FARM_GROUP,
    numberOfFarms: Math.floor(Math.random() * 10) + 1,
    serasa: `${Math.floor(Math.random() * 4) + 1}/4`,
    eudr: `${Math.floor(Math.random() * 4) + 1}/4`,
    status: [
      ProducerStatus.CREATED,
      ProducerStatus.IN_REVIEW,
      ProducerStatus.APPROVED,
      ProducerStatus.REJECTED
    ][Math.floor(Math.random() * 4)] as ProducerStatus,
    tenantId: 'tenant-1',
    createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
    updatedAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1)
  }))
];

