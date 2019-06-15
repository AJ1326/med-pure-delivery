const hours24FormatRegex = /^[0-2][0-9]:[0-5][0-9]:[0-5][0-9]$/;
const hours12FormatRegex = /^((0?[1-9])|10|11|12):[0-5][0-9](AM|PM)$/;

export class FormatUtils {
  public static formatTime24to12(input: string): string {
    let numbers: number[];
    let hrs: number, min: number, sec: number;
    let output = '';

    if (typeof input !== 'string' || !hours24FormatRegex.test(input.trim())) {
      console.warn(
        'FormatUtils.formatTime24to12: Input is not a string in the correct format (HH:MM:SS), input = ',
        input
      );
      return undefined;
    }

    numbers = input
      .trim()
      .split(':')
      .map(item => parseInt(item, 10));
    hrs = numbers[0];
    min = numbers[1];
    sec = numbers[2];
    if (hrs < 0 || hrs > 23 || min < 0 || min > 59 || sec < 0 || sec > 59) {
      console.warn(
        'FormatUtils.formatTime24to12: Input is not a string in the correct format (HH:MM:SS), input = ',
        input
      );
      return undefined;
    }

    const meridian = hrs > 11 ? 'PM' : 'AM';
    const hours = (hrs - (hrs > 12 ? 12 : 0) + (hrs === 0 ? 12 : 0)).toString();
    output += hours.length === 1 ? '0' + hours : hours;
    output += `:${min < 10 ? '0' + min : min}${meridian}`;

    return output;
  }

  public static formatTime12to24(input: string): string {
    let numbers: number[];
    let hrs: number, min: number;
    let meridian: string;
    let output = '';

    const pad = function(x: number): string {
      return (x < 10 ? '0' : '') + x;
    };

    if (typeof input !== 'string' || !hours12FormatRegex.test(input.trim())) {
      console.warn(
        'FormatUtils.formatTime12to24: Input is not a string in the correct format (HH:MM AM/PM), input = ',
        input
      );
      return undefined;
    }

    input = input.trim();
    meridian = input.substring(input.length - 2);
    input = input.substring(0, input.length - 2);
    numbers = input.split(':').map(item => parseInt(item, 10));
    hrs = numbers[0];
    min = numbers[1];
    if (hrs < 1 || hrs > 12 || min < 0 || min > 59) {
      console.warn(
        'FormatUtils.formatTime12to24: Input is not a string in the correct format (H:MM AM/PM), input = ',
        input
      );
      return undefined;
    }

    output += pad(hrs + (meridian === 'PM' ? 12 : 0) - (hrs === 12 ? 12 : 0));
    output += ':' + pad(min);
    output += ':00';

    return output;
  }
}
