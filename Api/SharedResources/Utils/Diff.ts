export class Diff {
  static Datetime = class {
    diff: number;

    constructor(now: Date, past: Date) {
      this.diff = now.getTime() - past.getTime();
    }

    getHours(): number {
      return this.getSeconds() / 60 / 60;
    }

    getSeconds(): number {
      return this.diff / 1000;
    }
  };

  static Numbers = class {
    diff: number;

    constructor(biggest: number | string | undefined, smallest: number) {
      this.diff = Number(biggest || smallest) - smallest;
    }

    getRounded(): number {
      return Math.round(this.diff);
    }
  };
}
