/******************
 Conway Game of Life algorithm & code written by:
 Brett Alistair Kromkamp
 http://www.quesucede.com/public/gameoflife/index.html
*******************/
(function() {
    Array.matrix = function (m, n, initial) {
      var a, i, j, mat = [];
      for (i = 0; i < m; i += 1) {
        a = [];
        for (j = 0; j < n; j += 1) {
          a[j] = 0;
        }
        mat[i] = a;
      }
      return mat;
    };

    var Life = {};

    Life.CELL_SIZE = 8;
    Life.X = 320;
    Life.Y = 320;
    Life.WIDTH = Life.X / Life.CELL_SIZE;
    Life.HEIGHT = Life.Y / Life.CELL_SIZE;
    Life.DEAD = 0;
    Life.ALIVE = 1;
    Life.DELAY = 500;
    Life.STOPPED = 0;
    Life.RUNNING = 1;

    Life.minimum = 2;
    Life.maximum = 3;
    Life.spawn = 3;

    Life.state = Life.STOPPED;
    Life.interval = null;

    Life.counter = 0;

    Life.updateState = function() {
      var neighbours;

      var nextGenerationGrid = Array.matrix(Life.HEIGHT, Life.WIDTH, 0);

      for (var h = 0; h < Life.HEIGHT; h++) {
        for (var w = 0; w < Life.WIDTH; w++) {
          neighbours = Life.calculateNeighbours(h, w);
          if (Life.grid[h][w] !== Life.DEAD) {
            if ((neighbours >= Life.minimum) &&
              (neighbours <= Life.maximum)) {
                nextGenerationGrid[h][w] = Life.ALIVE;
            }
          } else {
            if (neighbours === Life.spawn) {
              nextGenerationGrid[h][w] = Life.ALIVE;
            }
          }
        }
      }
      Life.copyGrid(nextGenerationGrid, Life.grid);
      Life.counter++;
    };

    Life.calculateNeighbours = function(y, x) {
      var total = (Life.grid[y][x] !== Life.DEAD) ? -1 : 0;
      for (var h = -1; h <= 1; h++) {
        for (var w = -1; w <= 1; w++) {
          if (Life.grid
            [(Life.HEIGHT + (y + h)) % Life.HEIGHT]
            [(Life.WIDTH + (x + w)) % Life.WIDTH] !== Life.DEAD) {
                total++;
          }
        }
      }
      return total;
    };

    Life.copyGrid = function(source, destination) {
      if (!destination) destination = [];
      for (var h = 0; h < Life.HEIGHT; h++) {
        destination[h] = source[h].slice(0);
      }

      return destination;
    };

    Life.init = function(height, width) {
      Life.HEIGHT = height;
      Life.WIDTH = width;
      Life.grid = Array.matrix(height, width, 0);

      return Life;
    };

    //leak globally
    window.Life = Life;

})();
