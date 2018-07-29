export class Matrix {

  constructor() {
    this.grid = [];
  }

  forEach(callback) {
    this.grid.forEach((column, x) => {
      column.forEach((value, y) => {
        callback(value, x, y);
      });
    });
  }

  get(x, y) {
    const col = this.grid[x];
    if (col) {
      return col[y]
    }

    return undefined;
  }

  set(x, y, value) {
    if (!this.grid[x]) {
      this.grid[x] = [];
    }

    this.grid[x][y] = value;
  }

}

export class Vec2 {

  constructor(x, y) {
    this.set(x, y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  sum() {
    return this.x + this.y;
  }

  absSum() {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  diag() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

}
