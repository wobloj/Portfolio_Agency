const webroukCustomRangeTemplate = document.createElement("template");
webroukCustomRangeTemplate.innerHTML = `
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap');
    :host {
      --w-primary-color-fb: hsl(214, 100%, 49%);
      --w-text-color-fb: hsl(0, 100%, 100%);
      --w-line-color-fb: hsl(0, 100%, 100%);
      --w-handle-size: 1.5rem;
      --w-triangle-width: 0.5rem;
      --w-radius-size: 0.25rem;
    }
    :host * {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    .webroukRange {
      position: relative;
      height: var(--w-handle-size);
      padding: calc(var(--w-handle-size) * 2) 0 calc(var(--w-handle-size) / 2);
    }
    .webroukRange__line {
      position: relative;
      height: calc(var(--w-handle-size) / 4);
      margin-top: calc(var(--w-handle-size) / -8);
      background-color: var(--w-line-color, var(--w-line-color-fb));
      border-radius: var(--w-radius-size);
    }
    .webroukRange__line__connect {
      position: absolute;
      top: -2px;
      height: 100%;
      background-color: var(--w-primary-color, var(--w-primary-color-fb));
    }
    .webroukRange__iniVal,
    .webroukRange__handle__curVal,
    .webroukRange__singleVal {
      font-family: 'Inter', sans-serif;
      font-size:16px;
      position: absolute;
      -webkit-transform: translate(-50%, 110%);
      -ms-transform: translate(-50%, 120%);
      transform: translate(-50%, 110%);
      color: var(--w-text-color, var(--w-text-color-fb));
      white-space: nowrap;
      padding: 3px 5px;
      border-radius: var(--w-radius-size);
    }
    .webroukRange__iniVal::after,
    .webroukRange__handle__curVal::after,
    .webroukRange__singleVal::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      -webkit-transform: translateX(-50%);
      -ms-transform: translateX(-50%);
      transform: translateX(-50%);
      height: calc(var(--w-triangle-width) * 0.8);
      width: calc(var(--w-triangle-width) * 1.5);
      background-color: inherit;
      -webkit-clip-path: polygon(50% 100%, 0 0, 100% 0);
      clip-path: polygon(50% 100%, 0 0, 100% 0);
    }
    .webroukRange__iniVal {
      top: 0;
    }
    .webroukRange__iniVal--start {
      left: 0;
    }
    .webroukRange__iniVal--end {
      left: 100%;
    }
    .webroukRange__handle {
      position: absolute;
      top: calc((var(--w-handle-size) - (var(--w-handle-size) / 4)) / -2);
      -webkit-transform: translateX(-50%);
      -ms-transform: translateX(-50%);
      transform: translateX(-50%);
      height: var(--w-handle-size);
      width: var(--w-handle-size);
      background-color: var(--w-primary-color, var(--w-primary-color-fb));
      outline: 8px solid var(--w-line-color, var(--w-line-color-fb));
      border-radius: 50%;
      -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
      cursor: -webkit-grab;
      cursor: grab;
    }
    .webroukRange__handle__curVal {
      user-select:none;
      left: 50%;
    }
    .webroukRange__handle:focus {
      z-index: 2;
    }
    .webroukRange__handle:active {
      cursor: -webkit-grabbing;
      cursor: grabbing;
    }
    .webroukRange__singleVal {
      top: calc((var(--w-handle-size) * -2) + (var(--w-handle-size) / 8));
      left: 50%;
      white-space: nowrap;
    }
    .webroukRange--showSingle .webroukRange__handle__curVal {
      visibility: hidden;
    }
    .webroukRange--hideStart .webroukRange__iniVal--start {
      visibility: hidden;
    }
    .webroukRange--hideEnd .webroukRange__iniVal--end {
      visibility: hidden;
    }
    .webroukRange:not(.webroukRange--showSingle) .webroukRange__singleVal {
      visibility: hidden;
    }
  </style>

  <div class="webroukRange" part="root">
    <span class="webroukRange__iniVal webroukRange__iniVal--start" part="value-start"></span>
    <span class="webroukRange__iniVal webroukRange__iniVal--end" part="value-end"></span>

    <div class="webroukRange__line">
      <div class="webroukRange__line__connect">
        <div class="webroukRange__singleVal" part="value-single">
          <span class="webroukRange__singleVal__from"></span>
          -
          <span class="webroukRange__singleVal__to"></span>
        </div>
      </div>

      <div class="webroukRange__handle webroukRange__handle--lower" tabindex="0" part="handle handle-lower">
        <span class="webroukRange__handle__curVal webroukRange__handle__curVal--from" part="value-from"></span>
      </div>
      <div class="webroukRange__handle webroukRange__handle--upper" tabindex="0" part="handle handle-upper">
        <span class="webroukRange__handle__curVal webroukRange__handle__curVal--to" part="value-to"></span>
      </div>
    </div>

    <slot></slot>
  </div>
`;

class WebroukCustomRange extends HTMLElement {

  _numWithCommas = (val) => String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  _mousePosition = [0, 0];
  _offset        = [0, 0];
  _isLowerDown   = false;
  _isUpperDown   = false;

  _prefixChar;
  _suffixChar;
  _startVal;
  _endVal;
  _fromVal;
  _toVal;

  _rangeSlider;
  _line;
  _connect;
  _lower;
  _upper;
  _start;
  _end;
  _from;
  _to;
  _singleFrom;
  _singleTo;
  _input;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(webroukCustomRangeTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    this._prefixChar          = this.getAttribute("prefix-char") || "";
    this._suffixChar          = this.getAttribute("suffix-char") || "";
    this._startVal            = this.getAttribute("start") || 0;
    this._endVal              = this.getAttribute("end") || 100;
    this._fromVal             = this.getAttribute("from") || this._startVal;
    this._toVal               = this.getAttribute("to") || this._endVal;

    this._rangeSlider         = this.shadowRoot.querySelector(".webroukRange");
    this._line                = this.shadowRoot.querySelector(".webroukRange__line");
    this._connect             = this.shadowRoot.querySelector(".webroukRange__line__connect");
    this._lower               = this.shadowRoot.querySelector(".webroukRange__handle--lower");
    this._upper               = this.shadowRoot.querySelector(".webroukRange__handle--upper");
    this._start               = this.shadowRoot.querySelector(".webroukRange__iniVal--start");
    this._end                 = this.shadowRoot.querySelector(".webroukRange__iniVal--end");
    this._from                = this.shadowRoot.querySelector(".webroukRange__handle__curVal--from");
    this._to                  = this.shadowRoot.querySelector(".webroukRange__handle__curVal--to");
    this._singleFrom          = this.shadowRoot.querySelector(".webroukRange__singleVal__from");
    this._singleTo            = this.shadowRoot.querySelector(".webroukRange__singleVal__to");
    this._input               = this.shadowRoot.querySelector("slot").assignedNodes().find(el => el.nodeName === "INPUT");

    this._start.innerText     = this._numWithCommas(`${this._prefixChar}${this._startVal}${this._suffixChar}`);
    this._end.innerText       = this._numWithCommas(`${this._prefixChar}${this._endVal}${this._suffixChar}`);
    this._from.innerText      = this._singleFrom.innerText = this._numWithCommas(`${this._prefixChar}${this._fromVal}${this._suffixChar}`);
    this._to.innerText        = this._singleTo.innerText = this._numWithCommas(`${this._prefixChar}${this._toVal}${this._suffixChar}`);
    this._input.value         = `${this._fromVal},${this._toVal}`;

    this._initRangeSlider();

    this._lower.addEventListener("mousedown", this._onGrabbingLowerHandle.bind(this));
    this._lower.addEventListener("touchstart", this._onGrabbingLowerHandle.bind(this));
    this._upper.addEventListener("mousedown", this._onGrabbingUpperHandle.bind(this));
    this._upper.addEventListener("touchstart", this._onGrabbingUpperHandle.bind(this));

    document.addEventListener("mouseup", this._onReleasingHandle.bind(this));
    document.addEventListener("touchend", this._onReleasingHandle.bind(this));

    document.addEventListener("mousemove", this._onMovingHandle.bind(this));
    document.addEventListener("touchmove", this._onMovingHandle.bind(this));

    window.addEventListener("resize", this._initRangeSlider.bind(this));
  }

  disconnectedCallback() {
    this._lower.removeEventListener("mousedown", this._onGrabbingLowerHandle);
    this._lower.removeEventListener("touchstart", this._onGrabbingLowerHandle);
    this._upper.removeEventListener("mousedown", this._onGrabbingUpperHandle);
    this._upper.removeEventListener("touchstart", this._onGrabbingUpperHandle);

    document.removeEventListener("mouseup", this._onReleasingHandle);
    document.removeEventListener("touchend", this._onReleasingHandle);
    document.removeEventListener("mousemove", this._onMovingHandle);
    document.removeEventListener("touchmove", this._onMovingHandle);
    window.removeEventListener("resize", this._initRangeSlider);
  }

  _initRangeSlider() {
    this._lower.style.left    = this._connect.style.left = `${(this._fromVal / this._endVal) * this._line.getBoundingClientRect().width}px` || 0;
    this._upper.style.left    = `${(this._toVal / this._endVal) * this._line.getBoundingClientRect().width}px` || "100%";
    this._connect.style.width = this._upper.getBoundingClientRect().x - this._lower.getBoundingClientRect().x + "px";

    this._updateRangeSliderStatus();
  }

  _onGrabbingLowerHandle(e) {
    this._isLowerDown = true;
    const pointerX = e.clientX || e.changedTouches[0].clientX;
    this._offset[0] = this._lower.offsetLeft - pointerX;
  }

  _onGrabbingUpperHandle(e) {
    this._isUpperDown = true;
    const pointerX = e.clientX || e.changedTouches[0].clientX;
    this._offset[1] = this._upper.offsetLeft - pointerX;
  }

  _onReleasingHandle() {
    if (this._isLowerDown || this._isUpperDown) {
      this._input.dispatchEvent(new Event("change"));
      this._input.dispatchEvent(new Event("input"));
      if (this.closest("form")) {
        this.closest("form").dispatchEvent(new Event("change"));
        this.closest("form").dispatchEvent(new Event("input"));
      }
    }

    this._isLowerDown = false;
    this._isUpperDown = false;
  }

  _onMovingHandle(e) {
    const sliderWidth = this._line.getBoundingClientRect().width;

    if (this._isLowerDown) {
      const pointerX = e.clientX || e.changedTouches[0].clientX;
      this._mousePosition[0] = pointerX;
      const currentPosition = this._mousePosition[0] + this._offset[0];

      if (currentPosition >= 0 && currentPosition <= (this._toVal / this._endVal) * sliderWidth) {
        this._lower.style.left = this._connect.style.left = `${currentPosition}px`;
        this._connect.style.width = this._upper.getBoundingClientRect().x - this._lower.getBoundingClientRect().x + "px";
        this._from.innerText = this._singleFrom.innerText = this._numWithCommas(`${this._prefixChar}${Math.ceil(this._endVal * (currentPosition / sliderWidth))}${this._suffixChar}`);
        this._fromVal = Math.ceil(this._endVal * (currentPosition / sliderWidth));
      }
    }

    if (this._isUpperDown) {
      const pointerX = e.clientX || e.changedTouches[0].clientX;
      this._mousePosition[1] = pointerX;
      const currentPosition = this._mousePosition[1] + this._offset[1];

      if (currentPosition >= (this._fromVal / this._endVal) * sliderWidth && currentPosition <= sliderWidth) {
        this._upper.style.left = `${currentPosition}px`;
        this._connect.style.width = this._upper.getBoundingClientRect().x - this._lower.getBoundingClientRect().x + "px";
        this._to.innerText = this._singleTo.innerText = this._numWithCommas(`${this._prefixChar}${Math.ceil(this._endVal * (currentPosition / sliderWidth))}${this._suffixChar}`);
        this._toVal = Math.ceil(this._endVal * (currentPosition / sliderWidth));
      }
    }

    if (this._isLowerDown || this._isUpperDown) {
      this._input.value = `${this._fromVal},${this._toVal}`;

      this._updateRangeSliderStatus();
    }
  }

  _updateRangeSliderStatus() {
    if (this._to.getBoundingClientRect().x <= this._from.getBoundingClientRect().x + this._from.getBoundingClientRect().width) {
      this._rangeSlider.classList.add("webroukRange--showSingle");
    } else {
      this._rangeSlider.classList.remove("webroukRange--showSingle");
    }

    if (this._from.getBoundingClientRect().x <= this._start.getBoundingClientRect().x + this._start.getBoundingClientRect().width) {
      this._rangeSlider.classList.add("webroukRange--hideStart");
    } else {
      this._rangeSlider.classList.remove("webroukRange--hideStart");
    }

    if (this._to.getBoundingClientRect().x + this._to.getBoundingClientRect().width >= this._end.getBoundingClientRect().x) {
      this._rangeSlider.classList.add("webroukRange--hideEnd");
    } else {
      this._rangeSlider.classList.remove("webroukRange--hideEnd");
    }
  }
}

window.customElements.define("webrouk-custom-range", WebroukCustomRange);
