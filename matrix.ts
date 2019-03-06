export class Matrix {
  constructor(rows:number, cols:number) {
    this.rows = rows;
    this.cols = cols;
    this.data = Array(this.rows).fill(0).map(() => Array(this.cols).fill(0));
  }

  rows: number;
  cols: number;
  data: number[][];

  copy():Matrix {
    let m = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        m.data[i][j] = this.data[i][j];
      }
    }
    return m;
  }

  static fromArray = (arr:number[]):Matrix => new Matrix(arr.length, 1).map((e, i) => arr[i]);

  static subtract(a:Matrix, b:Matrix):Matrix {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      console.log('Columns and Rows of A must match Columns and Rows of B.');
      return;
    }

    // Return a new Matrix a-b
    return new Matrix(a.rows, a.cols)
      .map((_, i, j) => a.data[i][j] - b.data[i][j]);
  }

  toArray():number[] {
    let arr = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  randomize = ():Matrix => this.map(e => Math.random() * 2 - 1);

  add(n:Matrix):Matrix {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }
      return this.map((e, i, j) => e + n.data[i][j]);
    } else {
      return this.map(e => e + n);
    }
  }

  static transpose(matrix:Matrix):Matrix {
    return new Matrix(matrix.cols, matrix.rows)
      .map((_, i, j) => matrix.data[j][i]);
  }

  static multiply(a:Matrix, b:Matrix):Matrix {
    // Matrix product
    if (a.cols !== b.rows) {
      console.log('Columns of A must match rows of B.')
      return;
    }

    return new Matrix(a.rows, b.cols)
      .map((e, i, j) => {
        // Dot product of values in col
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        return sum;
      });
  }

  multiply(n:Matrix | number):Matrix {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }

      // hadamard product
      return this.map((e, i, j) => e * n.data[i][j]);
    } else {
      // Scalar product
      return this.map(e => e * n);
    }
  }

  map(func:Function):Matrix {
    // Apply a function to every element of matrix
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val, i, j);
      }
    }
    return this;
  }

  static map(matrix:Matrix, func:Function):Matrix {
    // Apply a function to every element of matrix
    return new Matrix(matrix.rows, matrix.cols)
      .map((e, i, j) => func(matrix.data[i][j], i, j));
  }

  print():Matrix {
    console.table(this.data);
    return this;
  }

  serialize = ():string => JSON.stringify(this);

  static deserialize(data:string):Matrix {
    const parsedData = JSON.parse(data) as Matrix;
    let matrix = new Matrix(parsedData.rows, parsedData.cols);
    matrix.data = parsedData.data;
    return matrix;
  }
}