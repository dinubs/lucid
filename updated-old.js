var Clarity = function () {

    this.alert_errors   = false;
    this.log_info       = true;
    this.tile_size      = 16;
    this.limit_viewport = false;
    this.jump_switch    = 0;
    this.loading        = true;
    this.current_map_url = '';

    this.viewport = {
        x: 200,
        y: 200
    };

    this.camera = {
        x: 0,
        y: 0
    };

    this.key = {
        left: false,
        right: false,
        up: false
    };

    this.player = {

        loc: {
            x: 0,
            y: 0
        },

        vel: {
            x: 0,
            y: 0
        },

        can_jump: true
    };

    window.onkeydown = this.keydown.bind(this);
    window.onkeyup   = this.keyup.bind(this);
};

Clarity.prototype.error = function (message) {

    if (this.alert_errors) alert(message);
    if (this.log_info) console.log(message);
};

Clarity.prototype.log = function (message) {

    if (this.log_info) console.log(message);
};

Clarity.prototype.set_viewport = function (x, y) {

    this.viewport.x = x;
    this.viewport.y = y;
};

Clarity.prototype.keydown = function (e) {

    var _this = this;

    switch (e.keyCode) {
    case 65:
    case 37:
        _this.key.left = true;
        break;
    case 87:
    case 38:
        _this.key.up = true;
        break;
    case 68:
    case 39:
        _this.key.right = true;
        break;
    }
};

Clarity.prototype.keyup = function (e) {

    var _this = this;

    switch (e.keyCode) {
    case 65:
    case 37:
        _this.key.left = false;
        break;
    case 87:
    case 38:
        _this.key.up = false;
        break;
    case 68:
    case 39:
        _this.key.right = false;
        break;
    case 82:
        _this.reload_map();
        break;
    }
};

Clarity.prototype.reload_map = function() {
  this.load_map_http(this.current_map_url);
}

Clarity.prototype.load_map = function (map) {

    if (typeof map      === 'undefined'
     || typeof map.data === 'undefined'
     || typeof map.keys === 'undefined') {

        this.error('Error: Invalid map data!');

        return false;
    }

    this.current_map = map;
    this.update_intro_tag();

    this.current_map.background = map.background || '#333';
    this.current_map.gravity = map.gravity || {x: 0, y: 0.3};
    this.tile_size = map.tile_size || 16;

    var _this = this;

    this.current_map.width = 0;
    this.current_map.height = 0;

    map.keys.forEach(function (key) {

        map.data.forEach(function (row, y) {

            _this.current_map.height = Math.max(_this.current_map.height, y);

            row.forEach(function (tile, x) {

                _this.current_map.width = Math.max(_this.current_map.width, x);

                if (tile == key.id)
                    _this.current_map.data[y][x] = key;
            });
        });
    });

    this.current_map.width_p = this.current_map.width * this.tile_size;
    this.current_map.height_p = this.current_map.height * this.tile_size;

    this.player.loc.x = map.player.x * this.tile_size || 0;
    this.player.loc.y = map.player.y * this.tile_size || 0;
    this.player.colour = map.player.colour || '#000';
    this.player.can_move = true;

    this.part_message = '';
    this.last_message_draw = new Date();
    this.drawing_message = false;
    this.message_speed = 100;

    this.key.left     = false;
    this.key.up       = false;
    this.key.right    = false;

    this.camera = {
        x: 0,
        y: 0
    };

    this.player.vel = {
        x: 0,
        y: 0
    };

    return true;
};

Clarity.prototype.load_map_http = function(url) {
  this.loading = true;
  this.current_map_url = url;
  fetch('/maps/' + url)
    .then(function(response) {
      return response.json();
    }).then(function(map_data) {
      this.load_map(map_data);
      this.loading = false;
    }.bind(this));
}

Clarity.prototype.get_tile = function (x, y) {

    return (this.current_map.data[y] && this.current_map.data[y][x]) ? this.current_map.data[y][x] : 0;
};

Clarity.prototype.draw_tile = function (x, y, tile, context) {

    if (!tile || !tile.colour) return;

    context.fillStyle = (tile.colour === 'ref_bg') ? this.current_map.bg_color : tile.colour;
    context.fillRect(
        x,
        y,
        this.tile_size,
        this.tile_size
    );
};

Clarity.prototype.draw_map = function (context, fore) {

    for (var y = 0; y < this.current_map.data.length; y++) {

        for (var x = 0; x < this.current_map.data[y].length; x++) {

            if ((!fore && !this.current_map.data[y][x].fore) || (fore && this.current_map.data[y][x].fore)) {

                var t_x = (x * this.tile_size) - this.camera.x;
                var t_y = (y * this.tile_size) - this.camera.y;

                if(t_x < -this.tile_size
                || t_y < -this.tile_size
                || t_x > this.viewport.x
                || t_y > this.viewport.y) continue;

                this.draw_tile(
                    t_x,
                    t_y,
                    this.current_map.data[y][x],
                    context
                );
            }
        }
    }

    if (!fore) this.draw_map(context, true);
};

Clarity.prototype.move_player = function () {

    var tX = this.player.loc.x + this.player.vel.x;
    var tY = this.player.loc.y + this.player.vel.y;

    var offset = Math.round((this.tile_size / 2) - 1);

    var tile = this.get_tile(
        Math.round(this.player.loc.x / this.tile_size),
        Math.round(this.player.loc.y / this.tile_size)
    );

    if(tile.gravity) {

        this.player.vel.x += tile.gravity.x;
        this.player.vel.y += tile.gravity.y;

    } else {

        this.player.vel.x += this.current_map.gravity.x;
        this.player.vel.y += this.current_map.gravity.y;
    }

    if (tile.friction) {

        this.player.vel.x *= tile.friction.x;
        this.player.vel.y *= tile.friction.y;
    }

    var t_y_up   = Math.floor(tY / this.tile_size);
    var t_y_down = Math.ceil(tY / this.tile_size);
    var y_near1  = Math.round((this.player.loc.y - offset) / this.tile_size);
    var y_near2  = Math.round((this.player.loc.y + offset) / this.tile_size);

    var t_x_left  = Math.floor(tX / this.tile_size);
    var t_x_right = Math.ceil(tX / this.tile_size);
    var x_near1   = Math.round((this.player.loc.x - offset) / this.tile_size);
    var x_near2   = Math.round((this.player.loc.x + offset) / this.tile_size);

    var top1    = this.get_tile(x_near1, t_y_up);
    var top2    = this.get_tile(x_near2, t_y_up);
    var bottom1 = this.get_tile(x_near1, t_y_down);
    var bottom2 = this.get_tile(x_near2, t_y_down);
    var left1   = this.get_tile(t_x_left, y_near1);
    var left2   = this.get_tile(t_x_left, y_near2);
    var right1  = this.get_tile(t_x_right, y_near1);
    var right2  = this.get_tile(t_x_right, y_near2);


    if (tile.jump && this.jump_switch > 15) {

        this.player.can_jump = true;

        this.jump_switch = 0;

    } else this.jump_switch++;

    this.player.vel.x = Math.min(Math.max(this.player.vel.x, -this.current_map.vel_limit.x), this.current_map.vel_limit.x);
    this.player.vel.y = Math.min(Math.max(this.player.vel.y, -this.current_map.vel_limit.y), this.current_map.vel_limit.y);

    this.player.loc.x += this.player.vel.x;
    this.player.loc.y += this.player.vel.y;

    this.player.vel.x *= .9;

    if (left1.solid || left2.solid || right1.solid || right2.solid) {

        /* fix overlap */

        while (this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near1).solid
            || this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near2).solid)
            this.player.loc.x += 0.1;

        while (this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near1).solid
            || this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near2).solid)
            this.player.loc.x -= 0.1;

        /* tile bounce */

        var bounce = 0;

        if (left1.solid && left1.bounce > bounce) bounce = left1.bounce;
        if (left2.solid && left2.bounce > bounce) bounce = left2.bounce;
        if (right1.solid && right1.bounce > bounce) bounce = right1.bounce;
        if (right2.solid && right2.bounce > bounce) bounce = right2.bounce;

        this.player.vel.x *= -bounce || 0;

    }

    if (top1.solid || top2.solid || bottom1.solid || bottom2.solid) {

        /* fix overlap */

        while (this.get_tile(x_near1, Math.floor(this.player.loc.y / this.tile_size)).solid
            || this.get_tile(x_near2, Math.floor(this.player.loc.y / this.tile_size)).solid)
            this.player.loc.y += 0.1;

        while (this.get_tile(x_near1, Math.ceil(this.player.loc.y / this.tile_size)).solid
            || this.get_tile(x_near2, Math.ceil(this.player.loc.y / this.tile_size)).solid)
            this.player.loc.y -= 0.1;

        /* tile bounce */

        var bounce = 0;

        if (top1.solid && top1.bounce > bounce) bounce = top1.bounce;
        if (top2.solid && top2.bounce > bounce) bounce = top2.bounce;
        if (bottom1.solid && bottom1.bounce > bounce) bounce = bottom1.bounce;
        if (bottom2.solid && bottom2.bounce > bounce) bounce = bottom2.bounce;

        this.player.vel.y *= -bounce || 0;

        if ((bottom1.solid || bottom2.solid) && !tile.jump) {

            this.player.on_floor = true;
            this.player.can_jump = true;
        }

    }

    // adjust camera

    var c_x = Math.round(this.player.loc.x - this.viewport.x/2);
    var c_y = Math.round(this.player.loc.y - this.viewport.y/2);
    var x_dif = Math.abs(c_x - this.camera.x);
    var y_dif = Math.abs(c_y - this.camera.y);

    if(x_dif > 5) {

        var mag = Math.round(Math.max(1, x_dif * 0.1));

        if(c_x != this.camera.x) {

            this.camera.x += c_x > this.camera.x ? mag : -mag;

            if(this.limit_viewport) {

                this.camera.x =
                    Math.min(
                        this.current_map.width_p - this.viewport.x + this.tile_size,
                        this.camera.x
                    );

                this.camera.x =
                    Math.max(
                        0,
                        this.camera.x
                    );
            }
        }
    }

    if(y_dif > 5) {

        var mag = Math.round(Math.max(1, y_dif * 0.1));

        if(c_y != this.camera.y) {

            this.camera.y += c_y > this.camera.y ? mag : -mag;

            if(this.limit_viewport) {

                this.camera.y =
                    Math.min(
                        this.current_map.height_p - this.viewport.y + this.tile_size,
                        this.camera.y
                    );

                this.camera.y =
                    Math.max(
                        0,
                        this.camera.y
                    );
            }
        }
    }

    if(this.last_tile != tile.id && tile.script) {

        eval(this.current_map.scripts[tile.script]);
    }

    this.last_tile = tile.id;
};

Clarity.prototype.update_player = function () {

    if (!this.player.can_move) return;
    if (this.key.left || this.key.up || this.key.right) {
      this.drawing_message = false;
      this.needs_message = false;
    }

    if (this.key.left) {

        if (this.player.vel.x > -this.current_map.vel_limit.x)
            this.player.vel.x -= this.current_map.movement_speed.left;
    }

    if (this.key.up) {

        if (this.player.can_jump && this.player.vel.y > -this.current_map.vel_limit.y) {

            this.player.vel.y -= this.current_map.movement_speed.jump;
            this.player.can_jump = false;
        }
    }

    if (this.key.right) {

        if (this.player.vel.x < this.current_map.vel_limit.x)
            this.player.vel.x += this.current_map.movement_speed.left;
    }

    if (this.key.shift) {
      this.part_message = this.message;
    }

    this.move_player();
};

Clarity.prototype.draw_player = function (context) {

    context.fillStyle = this.player.colour;

    context.beginPath();

    context.arc(
        this.player.loc.x + this.tile_size / 2 - this.camera.x,
        this.player.loc.y + this.tile_size / 2 - this.camera.y,
        this.tile_size / 2 - 1,
        0,
        Math.PI * 2
    );

    context.fill();
};

Clarity.prototype.show_message = function (context) {
  this.player.can_move = false;
  this.drawing_message = true;

  context.fillStyle = 'rgba(0,0,0,0.0)';
  context.fillRect(
    this.current_map.tile_size,
    this.current_map.tile_size,
    this.current_map.tile_size * 20,
    this.current_map.tile_size * 5
  );

  if (new Date() - this.last_message_draw > this.message_speed) {
    this.part_message = this.message.substr(0, this.part_message.length + 1);
    this.last_message_draw = new Date();
    if (this.part_message.length === this.message.length) {
      this.player.can_move = true;
    }
  }

  context.font = (this.current_map.tile_size * 0.75) + 'px sans-serif';
  context.fillStyle = '#fff';
  context.wrapText(this.part_message, this.current_map.tile_size * 2, this.current_map.tile_size * 2, this.current_map.tile_size * 20, this.current_map.tile_size);
}

Clarity.prototype.update = function () {

    this.update_player();
};

Clarity.prototype.draw = function (context) {

  this.draw_map(context, false);
  this.draw_player(context);

  if (this.needs_message) {
    if (!this.drawing_message) {
      this.part_message = '';
      this.player.vel.x = 0;
      this.player.vel.y = 0;
    }
    this.show_message(context);
  }
};

Clarity.prototype.Loop = function() {
  if (this.loading) {
    window.requestAnimFrame(this.Loop.bind(this));
    return;
  }

  this.set_viewport(canvas.width, canvas.height);

  this.ctx.fillStyle = this.current_map.bg_color;
  this.ctx.fillRect(0, 0, canvas.width, canvas.height);

  this.update();
  this.draw(this.ctx);

  window.requestAnimFrame(this.Loop.bind(this));
};

Clarity.prototype.create_intro_tag = function() {
  var h1_tag = document.createElement('h1');
  h1_tag.classList.add('intro_tag');
  document.body.appendChild(h1_tag);
}

Clarity.prototype.update_intro_tag = function() {
  var h1_tag = document.querySelector('.intro_tag');
  h1_tag.innerText = this.current_map.title || "No Title";
  h1_tag.style.color = this.current_map.title_color || "#fff";
  h1_tag.classList.add('active');
  setTimeout(function() {
    h1_tag.classList.remove('active');
  }, 2000);
}

Clarity.prototype.setup = function(initial_map) {

  var canvas = document.getElementById('canvas');
  this.ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  this.create_intro_tag();

  this.load_map_http(initial_map);
  this.Loop();

  /* Limit the viewport to the confines of the map */
  this.limit_viewport = false;
}

module.exports = Clarity;
