class PaintView {
  constructor() {
    this.DOM.canvas.height = window.innerHeight * 0.9;
    this.DOM.canvas.width = window.innerWidth * 0.75;

    this.DOM.pallete.style.height = `${window.innerHeight * 0.9}px`;
    this.DOM.pallete.style.width = `${window.innerWidth * 0.18}px`;

    this.rect = this.DOM.canvas.getBoundingClientRect();
    this.context = this.DOM.canvas.getContext('2d');
    this.actualListener = 'drawLine';
    this.actualColor;
    this.mouseIsPressed;
    this.lastMousePositions = { x: 0, y: 0 };
    this.fileLoaded;

    this.bindLineOption();
    this.DOM.lineOption.click();
    this.bindSquareOption();
    this.bindCircleOption();
    this.bindTriangleOption();
    this.bindHeartOption();
    this.bindTextOption();
    this.bindImageOption();

    this.controlColorPicker();
    this.controlLineWidth();
    this.bindClearButton();
    this.bindExportButton();

    this.context.lineWidth = 10;
    this.context.lineJoin = 'round';
    this.context.lineCap = 'round';

    this.clearCanvas();
  }

  DOM = {
    canvas: document.getElementById('paint'),
    pallete: document.getElementById('pallete'),
    lineOption: document.getElementById('lineOption'),
    squareOption: document.getElementById('squareOption'),
    circleOption: document.getElementById('circleOption'),
    triangleOption: document.getElementById('triangleOption'),
    heartOption: document.getElementById('heartOption'),
    textOption: document.getElementById('textOption'),
    textInput: document.getElementById('textInput'),
    imageOption: document.getElementById('imageOption'),
    colorPicker: document.getElementById('colorPicker'),
    lineWidthChooser: document.getElementById('lineWidthChooser'),
    clearButton: document.getElementById('clearButton'),
    exportButton: document.getElementById('exportButton')
  };

  drawLine = event => {
    if (this.mouseIsPressed) {
      this.context.beginPath();
      this.context.moveTo(this.lastMousePositions.x, this.lastMousePositions.y);
      this.context.lineTo(event.offsetX, event.offsetY);
      this.context.stroke();
      this.lastMousePositions = { x: event.offsetX, y: event.offsetY };
    }
  };

  drawSquare = event => {
    if (event.type === 'mousedown') {
      this.lastMousePositions = { x: event.offsetX, y: event.offsetY };
    } else {
      const [x, y] = [event.offsetX, event.offsetY];
      this.context.strokeRect(x, y, this.lastMousePositions.x - x, this.lastMousePositions.y - y);
    }
  };

  drawCircle = event => {
    const radius = 20;
    this.context.beginPath();
    this.context.arc(event.offsetX, event.offsetY, radius, 0, 2 * Math.PI, false);
    this.context.fill();
    this.context.stroke();
  };

  drawTriangle = event => {
    this.context.beginPath();
    this.context.moveTo(event.offsetX, event.offsetY);
    this.context.lineTo(event.offsetX, event.offsetY + 200);
    this.context.lineTo(event.offsetX + 200, event.offsetY + 200);
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
  };

  drawHeart = event => {
    this.context.beginPath();
    this.context.moveTo(event.offsetX - 75, event.offsetY + 40);
    this.context.bezierCurveTo(event.offsetX - 75, event.offsetY + 37, event.offsetX - 70, event.offsetY + 25, event.offsetX - 50, event.offsetY + 25);
    this.context.bezierCurveTo(event.offsetX - 20, event.offsetY + 25, event.offsetX - 20, event.offsetY + 62.5, event.offsetX - 20, event.offsetY + 62.5);
    this.context.bezierCurveTo(event.offsetX - 20, event.offsetY + 80, event.offsetX - 40, event.offsetY + 102, event.offsetX - 75, event.offsetY + 120);
    this.context.bezierCurveTo(event.offsetX - 110, event.offsetY + 102, event.offsetX - 130, event.offsetY + 80, event.offsetX - 130, event.offsetY + 62.5);
    this.context.bezierCurveTo(event.offsetX - 130, event.offsetY + 62.5, event.offsetX - 130, event.offsetY + 25, event.offsetX - 100, event.offsetY + 25);
    this.context.bezierCurveTo(event.offsetX - 85, event.offsetY + 25, event.offsetX - 75, event.offsetY + 37, event.offsetX - 75, event.offsetY + 40);
    this.context.fill();
    this.context.closePath();
  };

  drawText = event => {
    this.context.font = '30px Arial';
    this.context.strokeText(this.DOM.textInput.value, event.offsetX, event.offsetY);
  };

  drawImage = event => {
    const img = this.DOM.imageOption.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(img);

    let position = [event.offsetX, event.offsetY];
    reader.onloadend = event => {
      if (event.target.readyState == FileReader.DONE) {
        console.log('image done!');
        const result = new Image();
        result.src = event.target.result;
        result.width = img.width * 0.2;
        result.height = img.height * 0.2;

        let [x, y] = position;
        this.context.drawImage(result, x, y);
      }
    };
  };

  unbindDrawLine = () => {
    this.DOM.canvas.removeEventListener('mousemove', this.drawLine);
    this.DOM.canvas.removeEventListener('mouseup', this.switchMouseIsPressedValue);
    this.DOM.canvas.removeEventListener('mouseout', this.switchMouseIsPressedValue);
    this.DOM.canvas.removeEventListener('mousedown', this.switchMouseIsPressedValue);
  };

  unbindDrawSquare = () => {
    this.DOM.canvas.removeEventListener('mousedown', this.drawSquare);
    this.DOM.canvas.removeEventListener('mouseup', this.drawSquare);
  };

  unbindDrawCircle = () => this.DOM.canvas.removeEventListener('click', this.drawCircle);
  unbindDrawTriangle = () => this.DOM.canvas.removeEventListener('click', this.drawTriangle);
  unbindDrawHeart = () => this.DOM.canvas.removeEventListener('click', this.drawHeart);
  unbindDrawText = () => this.DOM.canvas.removeEventListener('click', this.drawText);
  unbindDrawImage = () => this.DOM.canvas.removeEventListener('click', this.drawImage);

  unBindListener = () => {
    const options = {
      drawLine: this.unbindDrawLine,
      drawSquare: this.unbindDrawSquare,
      drawHeart: this.unbindDrawHeart,
      drawCircle: this.unbindDrawCircle,
      drawTriangle: this.unbindDrawTriangle,
      drawText: this.unbindDrawText,
      drawImage: this.unbindDrawImage
    };
    options[this.actualListener]();
  };

  switchMouseIsPressedValue = event => {
    const events = {
      mousedown: () => {
        this.mouseIsPressed = true;
        this.lastMousePositions = { x: event.offsetX, y: event.offsetY };
      },
      mouseout: () => (this.mouseIsPressed = false),
      mouseup: () => (this.mouseIsPressed = false)
    };
    events[event.type]();
  };

  bindLineOption = () => {
    this.DOM.lineOption.addEventListener('click', () => {
      this.unBindListener();
      this.actualListener = 'drawLine';
      this.DOM.canvas.addEventListener('mousemove', this.drawLine);
      this.DOM.canvas.addEventListener('mouseup', this.switchMouseIsPressedValue);
      this.DOM.canvas.addEventListener('mouseout', this.switchMouseIsPressedValue);
      this.DOM.canvas.addEventListener('mousedown', this.switchMouseIsPressedValue);
    });
  };

  bindSquareOption = () => {
    this.DOM.squareOption.addEventListener('click', () => {
      this.unBindListener();
      this.actualListener = 'drawSquare';
      this.DOM.canvas.addEventListener('mousedown', this.drawSquare);
      this.DOM.canvas.addEventListener('mouseup', this.drawSquare);
    });
  };

  bindHeartOption = () => {
    this.DOM.heartOption.addEventListener('click', () => {
      this.unBindListener();
      this.actualListener = 'drawHeart';
      this.DOM.canvas.addEventListener('click', this.drawHeart);
    });
  };

  bindCircleOption = () => {
    this.DOM.circleOption.addEventListener('click', () => {
      this.unBindListener();
      this.actualListener = 'drawCircle';
      this.DOM.canvas.addEventListener('click', this.drawCircle);
    });
  };

  bindTriangleOption = () => {
    this.DOM.triangleOption.addEventListener('click', () => {
      this.unBindListener();
      this.actualListener = 'drawTriangle';
      this.DOM.canvas.addEventListener('click', this.drawTriangle);
    });
  };

  bindTextOption = () => {
    this.DOM.textOption.addEventListener('click', () => {
      this.unBindListener();
      this.actualListener = 'drawText';
      this.DOM.canvas.addEventListener('click', this.drawText);
    });
  };

  bindImageOption = () => {
    this.DOM.imageOption.addEventListener('click', () => {
      this.fileLoaded = false;
      this.unBindListener();
      this.actualListener = 'drawImage';
      this.DOM.canvas.addEventListener('click', this.drawImage);
    });
  };

  controlColorPicker = () => this.DOM.colorPicker.addEventListener('change', this.updateContext);
  controlLineWidth = () => this.DOM.lineWidthChooser.addEventListener('change', this.updateContext);

  updateContext = () => {
    this.context.strokeStyle = this.DOM.colorPicker.value;
    this.context.fillStyle = this.DOM.colorPicker.value;
    this.context.lineWidth = this.DOM.lineWidthChooser.value;
  };

  clearCanvas = () => {
    const previousColor = this.context.fillStyle;
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.DOM.canvas.width, this.DOM.canvas.height);
    this.context.fillStyle = previousColor;
  };

  bindClearButton = () => this.DOM.clearButton.addEventListener('click', this.clearCanvas);

  exportCanvas = () => (this.DOM.exportButton.href = this.DOM.canvas.toDataURL('image/png').replace(/^data:image\/png/, 'data:application/octet-stream'));

  bindExportButton = () => this.DOM.exportButton.addEventListener('click', this.exportCanvas);
}
