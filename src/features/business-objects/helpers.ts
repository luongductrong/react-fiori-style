import type { BoType, BoStatus } from './constants';

export function displayBoType(boType?: BoType | string | null | undefined) {
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

export function displayBoStatus(boStatus?: BoStatus | string | null | undefined) {
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
