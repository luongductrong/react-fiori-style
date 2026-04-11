import type { BoType, BoStatus } from './constants';

export function displayBoType(boType?: BoType | undefined | null) {
  switch (boType) {
    case 'PORDER':
      return 'Purchase Order';
    case 'SORDER':
      return 'Sales Order';
    case 'INVOICE':
      return 'Invoice';
    default:
      return boType ? `"${boType}"` : '-';
  }
}

export function displayBoStatus(boStatus?: BoStatus | undefined | null) {
  switch (boStatus) {
    case 'NEW':
      return 'New';
    case 'INPR':
      return 'In Progress';
    case 'COMP':
      return 'Complete';
    default:
      return boStatus ? `"${boStatus}"` : '-';
  }
}
