import { Pipe, PipeTransform } from '@angular/core';

// ← PERSONALIZAR MONEDA: Cambiar el símbolo y formato de moneda aquí
@Pipe({ name: 'currencyFormat', standalone: true })
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currency: 'COP' | 'USD' | 'EUR' = 'COP'): string {
    const symbols: Record<string, string> = { COP: '$', USD: 'US$', EUR: '€' };
    const formatted = new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 }).format(value);
    return `${symbols[currency]}${formatted}`;
  }
}