import { Ordering } from '@app/shared/models/enums/ordering.enum';

export interface ColumnSort {
  dir: Ordering;
  prop: string;
}

export function formatColumnSortAsString(columnSort: ColumnSort): string {
  if (!columnSort) {
    return undefined;
  }
  return (columnSort.dir === Ordering.DESC ? '-' : '') + columnSort.prop;
}
