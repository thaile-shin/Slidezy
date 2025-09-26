function Slidezy(selector, options = {}) {
    this.container = document.querySelector(selector);
    if (!this.container) {
        console.error(`Slidezy: Container "${selector} not found"`);
    }

    this.opt = Object.assign(
        {
            items: 1,
            loop: false,
        },
        options
    );
    this.slides = Array.from(this.container.children);
    this.currentIndex = this.opt.loop ? this.opt.items : 0;

    this._init();
    this._createNavigation();
    this._updatePosition();
}

Slidezy.prototype._init = function () {
    this.container.classList.add("slidezy-wrapper");

    this._createTrack();
};

Slidezy.prototype._createTrack = function () {
    this.track = document.createElement("div");
    // this.track.classList.add('slidezy-track');
    this.track.className = "slidezy-track";
    const cloneHead = this.slides
        .slice(-this.opt.items)
        .map((node) => node.cloneNode(true));
    const cloneTail = this.slides
        .slice(0, this.opt.items)
        .map((node) => node.cloneNode(true));

    this.slides = cloneHead.concat(this.slides.concat(cloneTail));

    this.slides.forEach((slide) => {
        slide.classList.add("slidezy-slide");
        slide.style.flexBasis = `calc(100% / ${this.opt.items})`;
        this.track.appendChild(slide);
    });

    this.container.appendChild(this.track);
};

Slidezy.prototype._createNavigation = function () {
    this.prevBtn = document.createElement("button");
    this.nextBtn = document.createElement("button");

    this.prevBtn.textContent = "<";
    this.nextBtn.textContent = ">";

    this.prevBtn.className = "slidezy-prev";
    this.nextBtn.className = "slidezy-next";

    this.container.append(this.prevBtn, this.nextBtn);

    this.prevBtn.onclick = () => this.moveSlide(-1);
    this.nextBtn.onclick = () => this.moveSlide(1);
};

Slidezy.prototype.moveSlide = function (step) {
    if (this._isAnimating) return;
    this._isAnimating = true;
    if (this.opt.loop) {
        this.currentIndex =
            (this.currentIndex + step + this.slides.length) %
            this.slides.length;
        this.track.ontransitionend = () => {
            const maxIndex = this.slides.length - this.opt.items;
            if (this.currentIndex <= 0) {
                this.currentIndex = maxIndex - this.opt.items;
            }else if (this.currentIndex >= maxIndex) {
                this.currentIndex = this.opt.items;
            }
            this._updatePosition(true);
            this._isAnimating = false;
        }
    } else {
        this.currentIndex = Math.min(
            Math.max(this.currentIndex + step, 0),
            this.slides.length - this.opt.items
        );
    }

    this._updatePosition();
};

Slidezy.prototype._updatePosition = function (instant = false) {
    this.track.style.transition = instant ? `none` : `transform ease 0.3s`;
    this.offset = -(this.currentIndex * (100 / this.opt.items));
    this.track.style.transform = `translateX(${this.offset}%)`;
};
