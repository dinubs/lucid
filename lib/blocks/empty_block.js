import Block from "./block";

class EmptyBlock extends Block {
  constructor(game) {
    super(game);
    this.solid = false;
    this.jump = false;
    this.color = 'transparent';
  }
}

export default EmptyBlock;
