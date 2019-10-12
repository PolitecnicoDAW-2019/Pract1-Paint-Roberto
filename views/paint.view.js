class PaintView {
  constructor() {
    //this.loadPaint();
    this.bindCanvas(this.drawLine);
    this.bindLineOption();
    this.bindClearButton(this.clearCanvas);
  }

  dom = {
    canvas: document.getElementById('paint'),
    lineOption: document.getElementById('line'),
    clearButton: document.getElementById('clearButton')
  };

  actualListener;
  rect = this.dom.canvas.getBoundingClientRect();
  context = this.dom.canvas.getContext('2d');

  loadPaint = () => {
    fetch('/views/paint.view.html')
      .then(response => response.text())
      .then(html => {
        const content = new DOMParser().parseFromString(html, 'text/html');
        document.getElementById('root').innerHTML = content.body.innerHTML;
      });
  };

  getMousePosition = event => {
    return {
      x: event.clientX - this.rect.left,
      y: event.clientY - this.rect.top
    };
  };

  bindCanvas = selectedOption => {
    this.actualListener = selectedOption;
    this.dom.canvas.addEventListener('click', selectedOption);
  };

  unBindListener = () => {
    this.dom.canvas.removeEventListener('click', this.actualListener);
  };

  bindLineOption = () =>
    this.dom.lineOption.addEventListener('click', () => {
      this.unBindListener();
      this.bindCanvas(this.drawLine);
    });

  /*drawLine = event => {
    const mousePosition = this.getMousePosition(event);

    this.context.fillStyle = '#000000';
    this.context.fillRect(mousePosition.x, mousePosition.y, 4, 4);
  };*/

  drawLine = event => {};

  clearCanvas = () => {
    //const context = this.dom.canvas.getContext('2d');
    context.clearRect(0, 0, this.dom.canvas.width, this.dom.canvas.height);
  };

  bindClearButton = clearFunction =>
    this.dom.clearButton.addEventListener('click', clearFunction);
}
