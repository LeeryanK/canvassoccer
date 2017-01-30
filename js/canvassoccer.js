(function() {
  function CanvasSoccer(container) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

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
        // Check if the sum of the radii (the maximum distance they can be apart
        //   and still be touching) is equal to or greater than the two circle's
        //   actual distance.
        return this.radius + otherShape.radius >= this.position.getDifferenceFrom(otherShape.position).getMagnitude();

      case Shapes.RECTANGLE:
        // Create rectangular collision box around the rectangle with padding
        //   equal to the radius of this circle, and then checks if the circle
        //   is in it, through the following steps:

        // Cache the rectangle's properties in short variables.
        // ICYW: The 'o' prefix in the variables stands for 'Other shape.'
        var ox = otherShape.position.x;
        var oy = otherShape.position.y;
        var ow = otherShape.width;
        var oh = otherShape.height;

        // Cache my properties in short variables.
        var x = this.position.x;
        var y = this.position.y;
        var r = this.radius;

        // Create the sides of the extended collision box.
        // ICYW: The 'e' prefix stands for 'Extended collision box' and the
        //   other letters are for 'top', 'right', 'bottom', and 'left.'
        var et = oy - r;
        var er = ox + ow + r;
        var eb = oy + oh + r;
        var el = ox - r;

        // Check if the circle is in the collision box.
        return x < er && x > el && y > et && y < eb;
    }
  };

  function Rectangle(pos, vel, acc, w, h) {
    Movable.call(this, pos, vel, acc);

    this.width = w;
    this.height = h;
  }

  Rectangle.prototype = Object.create(Movable.prototype);

  Rectangle.prototype.shapeType = Shapes.RECTANGLE;

  Rectangle.prototype.isTouching = function(otherShape) {
    /**
     * @see {Circle#isTouching} for an explanation on the collision detection
     *   algorithms used here. These algorithms are built on the same concepts
     *   as the ones used in Circle#isTouching.
     */
    switch (otherShape.shapeType) {
      case Shapes.CIRCLE:
        var ox = otherShape.position.x;
        var oy = otherShape.position.y;
        var or = otherShape.radius;

        var x = this.position.x;
        var y = this.position.y;
        var w = this.width;
        var h = this.height;

        var et = y - or;
        var er = x + w + or;
        var eb = y + h + or;
        var el = x - or;

        return ox < er &&  ox > el && oy > et && oy < eb;

      case Shapes.RECTANGLE:
        // @todo Double-check the validity of this algorithm.
        var ox = otherShape.position.x;
        var oy = otherShape.position.y;
        var ow = otherShape.width;
        var oh = otherShape.height;

        var x = this.position.x;
        var y = this.position.y;
        var w = this.width;
        var h = this.height;

        var et = y - oh;
        var er = x + w;
        var eb = y + h;
        var el = x - ow;

        return ox < er && ox > el && oy > et && oy < eb;
    }
  };
})();
