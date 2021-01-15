(function() {
  var $ = function(id){return document.getElementById(id)};

  var canvas = this.__canvas = new fabric.Canvas('c', {
    isDrawingMode: true
  }); 

  fabric.Object.prototype.transparentCorners = false;

  var canvasWrapper = $('canvas-wrapper'),
      drawingColorEl = $('drawing-color'),
      drawingLineWidthEl = $('drawing-line-width'),
      clearEl = $('clear-canvas'),
      undoEl = $('undo-stroke'),
      drawSizes = Array.from(document.querySelectorAll('input[name="draw-size"]'))
      stateHistory = []

  let updateDrawSize = () => {
    canvas.freeDrawingBrush.width = parseInt(getDrawSize(), 10) || 1;
  }
  let getDrawSize = () => {
    return document.querySelector('input[name="draw-size"]:checked').value;
  }

  canvas.setDimensions(
    {width: canvasWrapper.offsetWidth, height: canvasWrapper.offsetHeight}
  );

  // auto adjust the canvas size
  window.onresize = function() {
    canvas.setDimensions(
      {width: canvasWrapper.offsetWidth, height: canvasWrapper.offsetHeight}
    );
  }

  // handle clear
  clearEl.onclick = function() { 
    canvas.clear();
    saveState(); 
  };

  // handle history and undo
  let saveState = () => {
    stateHistory.push(JSON.stringify(canvas));
  }
  canvas.on('path:created', saveState);
  undoEl.onclick = () => {
    if (stateHistory.length > 0) {
      stateHistory.pop();
      let previousState = stateHistory[stateHistory.length - 1];
      if (previousState == null) {
        previousState = {};
      }
      canvas.loadFromJSON(previousState, () => {
        canvas.renderAll();
      })
    }
  }

  // set listeners for the size options
  drawSizes.forEach((option) => {
    option.onchange = updateDrawSize;
  })

  $('drawing-mode-selector').onchange = function() {
    canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);

    if (canvas.freeDrawingBrush) {
      var brush = canvas.freeDrawingBrush;
      brush.color = drawingColorEl.value;
      if (brush.getPatternSrc) {
        brush.source = brush.getPatternSrc.call(brush);
      }
      brush.width = parseInt(getDrawSize(), 10) || 1;
    }
  };

  drawingColorEl.onchange = function() {
    var brush = canvas.freeDrawingBrush;
    brush.color = this.value;
    if (brush.getPatternSrc) {
      brush.source = brush.getPatternSrc.call(brush);
    }
  };

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = drawingColorEl.value;
    canvas.freeDrawingBrush.width = parseInt(getDrawSize(), 10) || 1;
  }
})();