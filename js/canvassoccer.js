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

  Vector.prototype.getDifferenceFrom = function(otherVector) {
    return new Vector(otherVector.x - this.x, otherVector.y - this.y);
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

  var Shapes = {
    CIRCLE: 0,
    RECTANGLE: 1
  };

  function Circle(pos, vel, acc, radius) {
    Movable.call(this, pos, vel, acc);
    this.radius = radius;
  }

  Circle.prototype = Object.create(Movable.prototype);

  Circle.prototype.shapeType = Shapes.CIRCLE;

  Circle.prototype.isTouching = function(otherShape) {
    switch (otherShape.shapeType) {
      case Shapes.CIRCLE:
        return (this.radius + otherShape.radius) >= this.position.getDifferenceFrom(otherShape.position).getMagnitude();

      case Shapes.RECTANGLE:
        // Created rectangular collision box with padding equal to the radius of
        //   this circle.
        var ox = otherShape.position.x;
        var oy = otherShape.position.y;
        var ow = otherShape.width;
        var oh = otherShape.height;

        var x = this.position.x;
        var y = this.position.y;
        var r = this.radius;

        var et = oy - r;
        var er = ox + ow + r;
        var eb = oy + oh + r;
        var el = ox - r;

        return x < er && x > el && y > et && y < eb;
    }
  };
})();
