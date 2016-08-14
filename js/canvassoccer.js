(function() {
  function CanvasSoccer() {

  }

  function CanvasSoccerGame() {

  }

  /**
   * @constructor Vector A 2D Vector class.
   */
  function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  /**
   * @function fromAngleAndMagnitude Creates a new Vector give the angle and
   *   magnitude.
   * @param {number} angle The angle in radians.
   * @param {number} magnitude The magnitude of the vector.
   * @return {Vector} The created vector.
   */
  Vector.fromAngleAndMagnitude = function(angle, magnitude) {
    return new Vector(Math.cos(angle) * magnitude, Math.sin(angle) * magnitude);
  };

  Vector.ZERO = new Vector(0, 0);

  Vector.prototype.clone = function() {
    return new Vector(this.x, this.y);
  };

  Vector.prototype.add = function(otherVector) {
    this.x += otherVector.x;
    this.y += otherVector.y;
    return this;
  };

  Vector.prototype.multiply = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  };

  Vector.prototype.getMagnitude = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  Vector.prototype.getAngle = function() {
    return Math.atan(this.y / this.x);
  };

  function Movable(pos, vel, acc) {
    this.position = pos || Vector.ZERO.clone();
    this.velocity = vel || Vector.ZERO.clone();
    this.acceleration = acc || Vector.ZERO.clone();
  }

  Movable.prototype.update = function(multiplier) {
    multiplier = multiplier || 1;

    this.velocity.add(this.acceleration.clone().multiply(multiplier));
    this.position.add(this.velocity.clone().multiply(multiplier));
  };
})();
