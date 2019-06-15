const daysOfWeek = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6
};

export interface TableRowMetadata {
  key: string;
  type: string;
  isLink?: boolean;
}

export class TabularDataUtils {
  public static sortData(
    data: Array<object>,
    metadata: { [key: string]: TableRowMetadata },
    sortOrder: Array<[string, 'ASC' | 'DESC']>
  ): Array<object> {
    if (!sortOrder || sortOrder.length === 0) {
      return;
    }

    let i = 0;
    let columnKey = sortOrder[i][0];
    let columnSort = sortOrder[i][1];
    let columnMetadata = metadata[columnKey];
    const dataSorted = this.sortDataPartial(data, columnMetadata, columnSort);
    let equalityRanges = this._getEqualValueRanges(dataSorted, columnMetadata);

    while (++i < sortOrder.length && equalityRanges.length > 0) {
      let equalityRangesNext: Array<[number, number]>;
      columnKey = sortOrder[i][0];
      columnSort = sortOrder[i][1];
      columnMetadata = metadata[columnKey];
      equalityRangesNext = [];

      for (const range of equalityRanges) {
        const dataRangeSorted = this.sortDataPartial(dataSorted.slice(range[0], range[1]), columnMetadata, columnSort);
        dataSorted.splice(range[0], range[1] - range[0], ...dataRangeSorted);
        equalityRangesNext = equalityRangesNext.concat(
          this._getEqualValueRanges(dataRangeSorted, columnMetadata, range[0])
        );
      }

      equalityRanges = equalityRangesNext;
    }

    return dataSorted;
  }

  public static sortDataPartial(
    data: Array<object>,
    metadata: TableRowMetadata,
    order?: 'ASC' | 'DESC'
  ): Array<object> {
    const sign = !order || order !== 'DESC' ? 1 : -1,
      key = metadata.key;
    let sorted: object[] = [];

    switch (metadata.type) {
      case 'number': {
        sorted = data.sort((a, b) => {
          const aVal = metadata.isLink ? a[key][0] : a[key],
            bVal = metadata.isLink ? b[key][0] : b[key];
          if (!isFinite(aVal) && !isFinite(bVal)) {
            return 0;
          }
          if (!isFinite(aVal)) {
            return 1 * sign;
          }
          if (!isFinite(bVal)) {
            return -1 * sign;
          }
          if (aVal < bVal) {
            return -1 * sign;
          }
          if (aVal > bVal) {
            return 1 * sign;
          }
          return 0;
        });
        break;
      }
      case 'boolean': {
        sorted = data.sort((a, b) => {
          const aVal = metadata.isLink ? a[key][0] : a[key],
            bVal = metadata.isLink ? b[key][0] : b[key];
          if (typeof aVal !== 'string' && typeof bVal !== 'string') {
            return 0;
          }
          if (typeof aVal !== 'string') {
            return -1 * sign;
          }
          if (typeof bVal !== 'string') {
            return 1 * sign;
          }
          return -1 * sign * aVal.localeCompare(bVal);
        });
        break;
      }
      case 'dayOfWeek': {
        const dayNames = Object.keys(daysOfWeek);
        sorted = data.sort((a, b) => {
          let aIdx: number, bIdx: number;
          if (typeof a[key] === 'string') {
            aIdx = dayNames.indexOf(a[key].trim().toLowerCase());
          } else {
            aIdx = -1;
          }
          if (typeof b[key] === 'string') {
            bIdx = dayNames.indexOf(b[key].trim().toLowerCase());
          } else {
            bIdx = -1;
          }
          if (aIdx < 0 && bIdx < 0) {
            return 0;
          }
          if (aIdx < 0) {
            return 1 * sign;
          }
          if (bIdx < 0) {
            return -1 * sign;
          }
          if (aIdx < bIdx) {
            return -1 * sign;
          }
          if (aIdx > bIdx) {
            return 1 * sign;
          }
          return 0;
        });
        break;
      }
      default: {
        // sort as string
        sorted = data.sort((a, b) => {
          const aVal = metadata.isLink ? a[key][0] : a[key],
            bVal = metadata.isLink ? b[key][0] : b[key];
          if (typeof aVal !== 'string' && typeof bVal !== 'string') {
            return 0;
          }
          if (typeof aVal !== 'string') {
            return 1 * sign;
          }
          if (typeof bVal !== 'string') {
            return -1 * sign;
          }
          return sign * aVal.localeCompare(bVal);
        });
        break;
      }
    }

    return sorted;
  }

  // For an array of objects and for a given column (defined by 'metadata.key')
  // it returns indexes of ranges where the object.key values are equal
  // EXLUDING ranges of length 1 (just 1 element with a given value)
  // E.g for [{a:0, b:"foo"}, {a:0, b:"bar"}, {a:2, b:"foo"}, {a:8, b:"baz"}, {a:8, b:"bar"}]
  // and key==="a"
  // the result is: [[0,2], [3,5]]
  // (between the two indexes, a is the same)
  //
  // The array MUST be already sorted by the selected key!
  private static _getEqualValueRanges(
    data: Array<object>,
    metadata: TableRowMetadata,
    baseIndex = 0
  ): Array<[number, number]> {
    const rangeList: Array<[number, number]> = [],
      key = metadata.key;

    let i = 0;
    while (i < data.length) {
      const val = data[i][key],
        range: [number, number] = [i, i];
      do {
        i++;
      } while (i < data.length && data[i][key] === val);
      range[1] = i;
      if (range[1] - range[0] > 1) {
        rangeList.push(<[number, number]>range.map(idx => idx + baseIndex));
      }
    }

    return rangeList;
  }
}
