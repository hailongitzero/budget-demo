export class Utils {
  static getMonthsInRange(from: number, to: number): string[] {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months.slice(from - 1, to);
  }
}
