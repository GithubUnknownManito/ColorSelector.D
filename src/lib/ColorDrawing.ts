import JElement from "jelement.library.d/src/index";
import ColorDrawingOptions from "./ColorDrawingOptions";
export const hasOwn = {}.hasOwnProperty;

export default class ColorDrawing {
  constructor(
    selector: string | HTMLElement,
    options?: any | ColorDrawingOptions
  ) {
    this.reber();
    this.appendTo(selector);
  }
  private wrapper: any = null;
  private canvas: any = null;
  private rgbaColor: any = JElement("");
  private hexColor: any = null;
  private inputBox: any = null;
  private displayBox: any = null;
  private foregroundColorBox: any = null;
  private backgroundColorBox: any = null;
  private barColor: any = null;
  private boxColor: any = null;
  private drawing: any = null;

  private activate: any = "foreground";
  private _currentColor: any = null;

  public get currentColor(): any {
    return this._currentColor;
  }

  public set currentColor(v: any) {
    if (this.activate == "foreground") {
      this.foregroundColorBox.css("background-color", `rgb(${v})`);
    } else {
      this.backgroundColorBox.css("background-color", `rgb(${v})`);
    }
    console.log("currentColor", v);
    this._currentColor = v;
  }

  reber() {
    this.wrapper = JElement("<div class='color_wrapper'>");
    this.canvas = JElement(
      "<canvas width='286' height='256' class='color_wrapper-drawing'>"
    );

    const content = JElement("<div class='color_wrapper-content'>");

    this.barColor = JElement(
      "<div class='color_wrapper-ward color_wrapper-bar' style='top:0px'>"
    );

    this.boxColor = JElement(
      "<div class='color_wrapper-ward color_wrapper-bax' style='left:40px;top:20px;'>"
    );
    this.foregroundColorBox = JElement(
      "<div class='color_wrapper-display--model color_wrapper-display-foreground'>"
    );
    this.backgroundColorBox = JElement(
      "<div class='color_wrapper-display--model color_wrapper-display-background'>"
    );

    this.displayBox = JElement("<div class='color_wrapper-display'>");
    this.inputBox = JElement("<div class='color_wrapper-input'>");

    this.rgbaColor.addElement(JElement.createElement("<input value='0'>"));
    this.rgbaColor.addElement(JElement.createElement("<input value='0'>"));
    this.rgbaColor.addElement(JElement.createElement("<input value='0'>"));
    this.hexColor = JElement("<input value='0'>");

    this.drawing = this.canvas.at(0).getContext("2d");

    const gradientBar = this.drawing.createLinearGradient(0, 0, 0, 256);
    gradientBar.addColorStop(0, "#f00");
    gradientBar.addColorStop(1 / 6, "#f0f");
    gradientBar.addColorStop(2 / 6, "#00f");
    gradientBar.addColorStop(3 / 6, "#0ff");
    gradientBar.addColorStop(4 / 6, "#0f0");
    gradientBar.addColorStop(5 / 6, "#ff0");
    gradientBar.addColorStop(1, "#f00");

    this.drawing.fillStyle = gradientBar;
    this.drawing.fillRect(0, 0, 20, 256);

    this.displayBox
      .append(this.foregroundColorBox)
      .append(this.backgroundColorBox);

    this.inputBox.append(this.rgbaColor).append(this.hexColor);

    content.append(this.displayBox).append(this.inputBox);

    this.wrapper
      .append(this.canvas)
      .append(content)
      .append(this.barColor)
      .append(this.boxColor);

    const that = this;
    let click = false;
    this.canvas
      .on("mousedown", function (e) {
        click = true;
        const ePos = {
          x: e.offsetX || e.layerX,
          y: e.offsetY || e.layerY,
        };

        let rgbaStr: any = "#000";
        if (ePos.x >= 0 && ePos.x < 20 && ePos.y >= 0 && ePos.y < 256) {
          // in
          rgbaStr = that.getRgbaAtPoint(ePos, "bar");
          that.colorBox("rgba(" + rgbaStr + ")");
        } else if (
          ePos.x >= 30 &&
          ePos.x < 30 + 256 &&
          ePos.y >= 0 &&
          ePos.y < 256
        ) {
          rgbaStr = that.getRgbaAtPoint(ePos, "box");
        } else {
          return;
        }
        that.currentColor = rgbaStr.slice(0, 3).join();
      })
      .on("mousemove", function (e) {
        if (click) {
          const ePos = {
            x: e.offsetX || e.layerX,
            y: e.offsetY || e.layerY,
          };
          let rgbaStr: any = "#000";
          if (ePos.x >= 0 && ePos.x < 20 && ePos.y >= 0 && ePos.y < 256) {
            // in
            rgbaStr = that.getRgbaAtPoint(ePos, "bar");
            that.colorBox("rgba(" + rgbaStr + ")");
          } else if (
            ePos.x >= 30 &&
            ePos.x < 30 + 256 &&
            ePos.y >= 0 &&
            ePos.y < 256
          ) {
            rgbaStr = that.getRgbaAtPoint(ePos, "box");
          } else {
            return;
          }
          that.currentColor = rgbaStr.slice(0, 3).join();
        }
      })
      .on("mouseup", function () {
        click = false;
      });

    this.colorBox();
  }

  getRgbaAtPoint(pos, area) {
    let imgData;
    if (area == "bar") {
      const barColorHeight = this.barColor.height();
      let top = pos.y - barColorHeight / 2;
      if (top < 0) {
        top = 0;
      }
      if (pos.y + barColorHeight > 256) {
        top = 256 - barColorHeight;
      }
      this.barColor.css("top", `${top}px`);
      imgData = this.drawing.getImageData(0, 0, 20, 256);
    } else {
      const boxColorWidth = this.boxColor.width();
      const boxColorHeight = this.boxColor.height();

      let left = pos.x - boxColorWidth / 2;
      let top = pos.y - boxColorHeight / 2;
      if (top < 0) {
        top = 0;
      }
      if (pos.y + boxColorHeight > 256) {
        top = 256 - boxColorHeight;
      }

      this.boxColor.css("top", `${top}px`).css("left", `${left}px`);
      imgData = this.drawing.getImageData(
        0,
        0,
        this.canvas[0].width,
        this.canvas[0].height
      );
    }

    const data = imgData.data;
    const dataIndex = (pos.y * imgData.width + pos.x) * 4;
    return [
      data[dataIndex],
      data[dataIndex + 1],
      data[dataIndex + 2],
      (data[dataIndex + 3] / 255).toFixed(2),
    ];
  }

  colorBox(color?: string) {
    color = color || "rgba(255,0,0,1)";
    // 底色填充，也就是（举例红色）到白色
    const gradientBase = this.drawing.createLinearGradient(30, 0, 256 + 30, 0);
    gradientBase.addColorStop(1, color);
    gradientBase.addColorStop(0, "rgba(255,255,255,1)");
    this.drawing.fillStyle = gradientBase;
    this.drawing.fillRect(30, 0, 256, 256);
    // 第二次填充，黑色到透明
    const my_gradient1 = this.drawing.createLinearGradient(0, 0, 0, 256);
    my_gradient1.addColorStop(0, "rgba(0,0,0,0)");
    my_gradient1.addColorStop(1, "rgba(0,0,0,1)");
    this.drawing.fillStyle = my_gradient1;
    this.drawing.fillRect(30, 0, 256, 256);
  }

  appendTo(selector: string | HTMLElement) {
    this.wrapper.appendTo(selector);
  }
}
