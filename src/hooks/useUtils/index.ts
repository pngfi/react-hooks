import { u64 } from '@solana/spl-token';
import Decimal from 'decimal.js';
import {
  DecimalUtil,
  ONE_DECIMAL,
  ONE_HUNDRED_DECIMAL,
  ZERO_DECIMAL,
} from '../../helpers/decimal';

export interface IUtils {
  ZERO_DECIMAL: Decimal;
  ONE_DECIMAL: Decimal;
  ONE_HUNDRED_DECIMAL: Decimal;
  fromStringToDecimal: (input: string, shift?: number) => Decimal;
  fromNumberToDecimal: (input: number, shift?: number) => Decimal;
  fromU64ToDecimal: (input: u64, shift?: number) => Decimal;
  toU64: (input: Decimal, shift?: number) => u64;
  beautify: (input: Decimal, fixed?: number) => string;
}

export const useUtils = (): IUtils => {
  return {
    ZERO_DECIMAL,
    ONE_DECIMAL,
    ONE_HUNDRED_DECIMAL,
    fromStringToDecimal: DecimalUtil.fromString,
    fromNumberToDecimal: DecimalUtil.fromNumber,
    fromU64ToDecimal: DecimalUtil.fromU64,
    toU64: DecimalUtil.toU64,
    beautify: DecimalUtil.beautify,
  };
};
