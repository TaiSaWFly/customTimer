class Timer {
  #html;
  #head;
  #body;
  #openTimerBtn;
  #timerContainerHTML;
  #startTimerHTML;
  #startTimerConteiner;
  #timerForm;
  #clearInterval;
  #inputData;
  #timerData;

  constructor() {
    this.#html = document.querySelector("html");
    this.#head = this.#html.querySelector("head");
    this.#body = this.#html.querySelector("body");
    this.#openTimerBtn = null;
    this.#timerContainerHTML = false;
    this.#startTimerHTML = false;
    this.#startTimerConteiner = null;
    this.#timerForm = null;
    this.#clearInterval = null;
    this.#inputData = {
      second: 0,
      minute: 0,
      hour: 0,
      day: 0,
    };
    this.#timerData = {
      second: 0,
      minute: 0,
      hour: 0,
      day: 0,
    };
  }

  run() {
    this.#preLoad();
    this.#openTimer(this.#openTimerBtn);
  }

  //_____PreLoad and Append Font + Creat ButtonOpenTimer____//
  #preLoad() {
    const links = this.#head.querySelectorAll("link");
    this.#setStyles(this.#body, ["position: relative;", "height: 100vh;"]);
    this.#setStyles(this.#html, ["font-size: 10px;"]);
    !this.#hasDocumenFont(links)
      ? this.#loadFont(
          "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap"
        )
      : false;

    this.#openTimerBtn = this.#createrUseButton(
      "openTimer",
      "open",
      "btn",
      "Открыть Таймер"
    );
    this.#body.append(this.#openTimerBtn);
  }

  //___________________Utils______________________//
  #openTimer(button) {
    button.addEventListener("click", () => {
      if (!this.#timerContainerHTML) {
        this.#renderTimer();
        this.#timerContainerHTML = true;

        const timerContainer = document.querySelector("#timerContainer");
        timerContainer.classList.add("show");

        timerContainer.className === "timer-container show"
          ? this.#setAnimation(timerContainer, ["transform: scale(1);"], 0)
          : false;
      }
    });
  }

  //___________________logics______________________//
  #startTimer() {
    const timerContainer = document.querySelector("#timerContainer");
    const timerForm = timerContainer.querySelector("#timerForm");
    const timerTitle = timerContainer.querySelector("#timerTitle");

    timerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const inputs = event.target.querySelectorAll("input");

      inputs.forEach((input) => {
        if (input.id === "day") {
          this.#inputData.day = Number(input.value);
          this.#timerData.day = this.#inputData.day * (60 * 60 * 24);
        }

        if (input.id === "hour") {
          this.#inputData.hour = Number(input.value);
          this.#timerData.hour = this.#inputData.hour * (60 * 60);
        }

        if (input.id === "minute") {
          this.#inputData.minute = Number(input.value);
          this.#timerData.minute = this.#inputData.minute * 60;
        }

        if (input.id === "second") {
          this.#inputData.second = Number(input.value);
          this.#timerData.second = this.#inputData.second;
        }
      });

      const emptyField = (data) => {
        let flag = true;
        const notEmpty = [];
        Object.values(data).forEach((data) =>
          data !== 0 ? notEmpty.push(data) : false
        );
        notEmpty.length !== 0 ? (flag = false) : (flag = true);

        return flag;
      };

      if (!this.#startTimerHTML && !emptyField(this.#inputData)) {
        setTimeout(() => {
          timerContainer.append(
            this.#renderStartTimer(
              this.#parseNumber(this.#inputData.day),
              this.#parseNumber(this.#inputData.hour),
              this.#parseNumber(this.#inputData.minute),
              this.#parseNumber(this.#inputData.second)
            )
          );
          this.#startTimerConteiner = document.querySelector("#startTimer");
        }, 400);

        const toCurrentDate = new Date(
          Date.parse(new Date()) +
            (this.#timerData.day +
              this.#timerData.hour +
              this.#timerData.minute +
              this.#timerData.second +
              1) *
              1000
        );

        this.#startTimerHTML = true;
        inputs.forEach((input) => (input.value = ""));

        setTimeout(() => {
          this.#setAnimation(timerForm, ["transform: translateX(110%);"], 0);
          setTimeout(() => {
            timerForm.remove();
          }, 350);
        });

        setTimeout(() => {
          timerTitle.textContent = "Таймер Запущен";
          this.#setAnimation(
            this.#startTimerConteiner,
            ["transform: translateX(0%);"],
            0
          );
        }, 410);

        setTimeout(() => {
          this.#stopAndRemoveTimer(
            toCurrentDate,
            this.#startTimerConteiner,
            timerTitle
          );
          this.#stopTimer();
        }, 440);
      }
    });
  }

  #countDown(toCurrentDate) {
    const startTimerContainer = document.querySelector(
      ".start_timer-container"
    );
    const startTimersItems =
      startTimerContainer.querySelectorAll("[data-time]");
    const newDate = new Date();
    const different = Math.floor((toCurrentDate - newDate) / 1000);

    this.#timerData.second = different % 60;
    this.#timerData.minute = Math.floor((different / 60) % 60);
    this.#timerData.hour = Math.floor((different / 3600) % 24);
    this.#timerData.day = Math.floor(different / 86400);

    startTimersItems.forEach((item) => {
      item.dataset.time === "day"
        ? (item.textContent = this.#parseNumber(this.#timerData.day))
        : false;
      item.dataset.time === "hour"
        ? (item.textContent = this.#parseNumber(this.#timerData.hour))
        : false;
      item.dataset.time === "minute"
        ? (item.textContent = this.#parseNumber(this.#timerData.minute))
        : false;
      item.dataset.time === "second"
        ? (item.textContent = this.#parseNumber(this.#timerData.second))
        : false;
    });

    return different;
  }

  #stopAndRemoveTimer(toCurrentDate, startTimer, timerTitle) {
    const stopAndRemoveTimer = setInterval(() => {
      if (this.#countDown(toCurrentDate) === -1) {
        setTimeout(() => {
          setTimeout(() => {
            this.#setAnimation(startTimer, ["transform: translateX(110%);"], 0);
            setTimeout(() => {
              startTimer.remove();
            }, 350);
          });

          setTimeout(() => {
            this.#renderConfirmNewTimer();
            timerTitle.textContent = "Запустить Новый Таймер?";
            const confirmContainer =
              document.querySelector("#confirmContainer");

            setTimeout(() => {
              this.#setAnimation(
                confirmContainer,
                ["transform: translateX(0%);"],
                0
              );
            });
          }, 360);
        }, 1000);

        this.#startTimerHTML = false;
        clearInterval(stopAndRemoveTimer);
        this.#clearData();
      }
    }, 500);

    this.#clearInterval = stopAndRemoveTimer;
  }

  #stopTimer() {
    const timerTitle = document.querySelector("#timerTitle");
    const startTimer = document.querySelector("#startTimer");

    startTimer.addEventListener(
      "click",
      (event) => {
        const stopTimerBtn = startTimer.querySelector("[data-btn=stop]");
        const isStopTimerBtn = event.target.dataset.btn === "stop";

        if (isStopTimerBtn) {
          this.#startTimerHTML = false;
          timerTitle.textContent = "Таймер Остановлен!";
          stopTimerBtn.textContent = "Остановлен!";
          clearInterval(this.#clearInterval);

          setTimeout(() => {
            this.#setAnimation(startTimer, ["transform: translateX(110%);"], 0);
            setTimeout(() => {
              startTimer.remove();
            }, 350);
          }, 1700);

          setTimeout(() => {
            this.#renderConfirmNewTimer();
            timerTitle.textContent = "Запустить Новый Таймер?";
            const confirmContainer =
              document.querySelector("#confirmContainer");

            setTimeout(() => {
              this.#setAnimation(
                confirmContainer,
                ["transform: translateX(0%);"],
                0
              );
            });
          }, 2200);
        }
      },
      { once: true }
    );
  }

  #removeTimer(timerContainer) {
    const deletTimerContainer = document.querySelector("#deletTimerContainer");

    deletTimerContainer.addEventListener(
      "click",
      () => {
        clearInterval(this.#clearInterval);
        this.#timerContainerHTML = false;
        this.#startTimerHTML = false;
        this.#setAnimation(timerContainer, ["transform: scale(0);"], 0);

        setTimeout(() => {
          timerContainer.remove();
        }, 350);
      },
      { once: true }
    );
  }

  #confirmTimer() {
    const timerContainer = document.querySelector("#timerContainer");
    const confirmContainer = document.querySelector("#confirmContainer");
    const timerTitle = timerContainer.querySelector("#timerTitle");

    confirmContainer.addEventListener("click", (event) => {
      const { target } = event;
      const isConfirmBtn = target.dataset.btn === "confirm";
      const isCancelBtn = target.dataset.btn === "cancel";

      if (isConfirmBtn) {
        setTimeout(() => {
          timerContainer.append(this.#createrTimerForm());
          this.#timerForm = document.querySelector("#timerForm");
          this.#setStyles(this.#timerForm, ["transform: translateX(-110%);"]);
          this.#startTimer();
        }, 400);

        setTimeout(() => {
          this.#setAnimation(
            confirmContainer,
            ["transform: translateX(110%);"],
            0
          );
          setTimeout(() => {
            confirmContainer.remove();
          }, 350);
        });

        setTimeout(() => {
          timerTitle.textContent = "Таймер Обратного Отчёта";
          this.#setAnimation(
            this.#timerForm,
            ["transform: translateX(0%);"],
            0
          );
        }, 450);
      }

      if (isCancelBtn) {
        this.#timerContainerHTML = false;
        this.#setAnimation(timerContainer, ["transform: scale(0);"], 0);
        setTimeout(() => {
          timerContainer.remove();
        }, 350);
      }
    });
  }

  #moveTimer(takeAnElement, moveElement) {
    const moveModal = ({ movementX, movementY }) => {
      let getElStyles = window.getComputedStyle(moveElement);
      let left = parseInt(getElStyles.left);
      let top = parseInt(getElStyles.top);

      moveElement.style.left = `${left + movementX}px`;
      moveElement.style.top = `${top + movementY}px`;
    };

    takeAnElement.addEventListener("mousedown", () => {
      moveElement.classList.add("movement");
      moveElement.className === "timer-container show movement"
        ? this.#setStyles(moveElement, ["cursor: move;"])
        : false;
      takeAnElement.addEventListener("mousemove", moveModal);
    });

    document.addEventListener("mouseup", () => {
      moveElement.classList.remove("movement");
      moveElement.className === "timer-container show"
        ? this.#setStyles(moveElement, ["cursor: default;"])
        : false;

      takeAnElement.removeEventListener("mousemove", moveModal);
    });
  }
  //logics______________________//

  //___________________Render and Creators______________________//
  #renderTimer() {
    const timerContainer = document.createElement("div");
    timerContainer.id = "timerContainer";
    timerContainer.className = "timer-container";

    const deleteButtonTimer = document.createElement("div");
    deleteButtonTimer.id = "deletTimerContainer";
    const before = document.createElement("span");
    before.className = "before";
    const after = document.createElement("span");
    after.className = "after";
    deleteButtonTimer.append(before, after);

    const timerTitle = document.createElement("div");
    timerTitle.id = "timerTitle";
    timerTitle.className = "timer-title";
    timerTitle.textContent = "Таймер Обратного Отчёта";

    timerContainer.append(
      timerTitle,
      this.#createrTimerForm(),
      deleteButtonTimer
    );
    this.#body.append(timerContainer);

    this.#startTimer();
    this.#removeTimer(timerContainer);
    this.#moveTimer(timerTitle, timerContainer);

    //___________________Set Styles______________________
    this.#setStyles(timerContainer, [
      "font-family: Montserrat;",
      "font-weight: 600;",
      "font-size: 2.5rem;",
      "text-align: center;",
      "color: #000;",
      "min-width: 494px;",
      "min-height: 288px;",
      "padding: 35px;",
      "background: #eee;",
      "border-radius: 20px;",
      "box-shadow: 1px 1px 20px #000;",
      "overflow: hidden;",
      "position: absolute;",
      "top: 20%;",
      "left: 35%;",
      "transform: scale(0);",
      "transition: transform .3s ease-in-out;",
    ]);
    this.#setStyles(deleteButtonTimer, [
      "width: 30px;",
      "height: 30px;",
      "cursor: pointer;",
      "background: transparent;",
      "position: absolute;",
      "right: 10px;",
      "top: 10px;",
      "transition: transform .3s ease-in-out;",
    ]);
    this.#setStyles(before, [
      "display: block;",
      "width: 100%;",
      "height: 2.5px;",
      "background: rgb(229, 63, 50);",
      "box-shadow: 0 0 5px rgba(229, 63, 50, .5);",
      "position: absolute;",
      "top: 50%;",
      "transform: translateY(-50%);",
      "transform: rotate(45deg);",
    ]);
    this.#setStyles(after, [
      "display: block;",
      "width: 100%;",
      "height: 2.5px;",
      "background: rgb(229, 63, 50);",
      "box-shadow: 0 0 5px rgba(229, 63, 50, .5);",
      "position: absolute;",
      "top: 50%;",
      "transform: translateY(-50%);",
      "transform: rotate(-45deg);",
    ]);
    this.#setStyles(timerTitle, [
      "padding-bottom: 30px;",
      "transition: text-shadow .25s ease-in-out;",
    ]);

    this.#hover(
      timerTitle,
      "#timerTitle",
      ["cursor: move;", "text-shadow: 1px 1px 13px rgb(193, 136, 160);"],
      ["cursor: default;", "text-shadow: none;"]
    );

    this.#hover(
      deleteButtonTimer,
      "#deletTimerContainer",
      ["transform: rotate(90deg);"],
      ["transform: rotate(0deg);"]
    );
  }

  #createrTimerForm() {
    const timerForm = document.createElement("form");
    timerForm.id = "timerForm";
    timerForm.className = "timer-form";

    const startTimerButton = this.#createrUseButton(
      "startTimerBtn",
      "start",
      "btn",
      "Запустить Таймер"
    );

    timerForm.append(
      this.#renderInput("number", "day", "day", "Введите Дни"),
      this.#renderInput("number", "hour", "hour", "Введите Часы"),
      this.#renderInput("number", "minute", "minute", "Введите Минуты"),
      this.#renderInput("number", "second", "second", "Введите Секунды"),
      startTimerButton
    );

    //___________________Set Styles______________________
    this.#setStyles(timerForm, [
      "display: flex;",
      "flex-direction: column;",
      "align-items: center;",
      "transform: translateX(0);",
      "transition: transform .3s ease-in-out;",
    ]);

    return timerForm;
  }

  #renderInput(type, id, name, text) {
    const inputForm = document.createElement("div");
    inputForm.className = "input-form";

    const input = document.createElement("input");
    input.className = "input";
    input.type = type;
    input.id = id;
    input.name = name;
    input.placeholder = text;
    input.min = 0;

    inputForm.append(input);

    //___________________Set Styles______________________
    this.#setStyles(inputForm, ["width: 100%;", "margin-bottom: 20px;"]);
    this.#setStyles(input, [
      "display: block;",
      "width: 100%;",
      "font-family: Montserrat;",
      "font-weight: 400;",
      "font-size: 1.8rem;",
      "padding: .7rem 1rem;",
      "background: transparent;",
      "outline: none;",
      "border: 0;",
      "border-bottom: solid 2px rgba(0, 0, 0, .35);",
      "transition: border .35s ease-in-out;",
    ]);
    this.#hover(
      input,
      "input",
      ["border-bottom-color: rgba(0, 0, 0, .8);"],
      ["border-bottom-color: rgba(0, 0, 0, .35);"]
    );

    return inputForm;
  }

  #renderStartTimer(day, hour, minute, second) {
    const startTimer = document.createElement("div");
    startTimer.id = "startTimer";
    startTimer.className = "start_timer";

    const startTimerContainer = document.createElement("div");
    startTimerContainer.className = "start_timer-container";

    const stopTimerButton = this.#createrUseButton(
      "stopTimerBtn",
      "stop",
      "btn",
      "Остановить Таймер"
    );

    startTimer.append(startTimerContainer, stopTimerButton);
    startTimerContainer.append(
      this.#creatorTimerValue("Дни", "day", day),
      this.#creatorTimerValue("Часы", "hour", hour),
      this.#creatorTimerValue("Минуты", "minute", minute),
      this.#creatorTimerValue("Секунды", "second", second)
    );

    //___________________Set Styles______________________
    this.#setStyles(startTimer, [
      "display: flex;",
      "flex-direction: column;",
      "align-items: center;",
      "transform: translateX(-110%);",
      "transition: transform .3s ease-in-out;",
    ]);
    this.#setStyles(startTimerContainer, [
      "display: flex;",
      "margin-bottom: 20px;",
    ]);
    this.#setStyles(stopTimerButton, [
      "font-family: Montserrat;",
      "font-weight: 600;",
      "font-size: 1.5rem;",
      "text-align: center;",
      "color: rgba(225, 225, 225, 1);",
      "display: block;",
      "padding: 1rem;",
      "cursor: pointer;",
      "background: linear-gradient(45deg, rgba(62, 117, 220, 1) 25%, rgba(204, 137, 154, 1) 75%);",
      "border: 0;",
      "border-radius: 20px;",
      "box-shadow: 1px 1px 10px rgba(0, 0, 0, 1);",
      "transition: all .2s ease-in-out;",
    ]);

    this.#hover(
      stopTimerButton,
      "#stopTimerBtn",
      ["color: #eee;", "box-shadow: 1px 1px 20px rgba(3, 3, 3, 1);"],
      [
        "color: rgba(225, 225, 225, 1);",
        "box-shadow: 1px 1px 10px rgba(0, 0, 0, 1);",
      ]
    );

    return startTimer;
  }

  #creatorTimerValue(text, dataset, textTime) {
    const element = document.createElement("div");
    element.textContent = `${text}`;

    const elementValue = document.createElement("span");
    elementValue.dataset.time = `${dataset}`;
    elementValue.textContent = textTime;

    element.append(elementValue);

    //___________________Set Styles______________________
    this.#setStyles(element, [
      "font-size: 1.6rem;",
      "font-weight: 400;",
      "color: #eee;",
      "min-width: 91px;",
      "margin: 7.5px;",
      "padding: 55px 9px 10px 9px;",
      "background: rgb(62, 117, 220);",
      "border-radius: 10px;",
      "box-shadow: 1px 1px 10px rgba(0, 0, 0, 1);",
      "position: relative;",
    ]);
    this.#setStyles(elementValue, [
      "font-size: 3rem;",
      "font-weight: 600;",
      "position: absolute;",
      "top: 10px;",
      "left: 50%;",
      "transform: translateX(-50%);",
    ]);

    return element;
  }

  #renderConfirmNewTimer() {
    const timerContainer = document.querySelector("#timerContainer");

    const confirmContainer = document.createElement("div");
    confirmContainer.id = "confirmContainer";
    confirmContainer.className = "confirm-container";

    confirmContainer.append(
      this.#createrUseButton("confirmBtn", "confirm", "btn", "Запустить"),
      this.#createrUseButton("confirmBtn", "cancel", "btn", "Отменить")
    );
    timerContainer.append(confirmContainer);
    this.#confirmTimer();

    //___________________Set Styles______________________
    this.#setStyles(confirmContainer, [
      "display: flex;",
      "justify-content: space-around;",
      "margin-top: 55px;",
      "transform: translateX(-110%);",
      "transition: transform .3s ease-in-out;",
    ]);
  }

  #createrUseButton(id, dataset, className, text) {
    const useButton = document.createElement("button");
    useButton.id = `${id}`;
    useButton.dataset.btn = `${dataset}`;
    useButton.className = `${className}`;
    useButton.textContent = `${text}`;

    //___________________Set Styles______________________
    this.#setStyles(useButton, [
      "font-family: Montserrat;",
      "font-weight: 600;",
      "font-size: 1.5rem;",
      "text-align: center;",
      "color: rgba(225, 225, 225, 1);",
      "display: block;",
      "padding: 1rem;",
      "cursor: pointer;",
      "background: linear-gradient(45deg, rgba(62, 117, 220, 1) 25%, rgba(204, 137, 154, 1) 75%);",
      "border: 0;",
      "border-radius: 20px;",
      "box-shadow: 1px 1px 10px rgba(0, 0, 0, 1);",
      "transition: all .2s ease-in-out;",
    ]);

    this.#hover(
      useButton,
      ".btn",
      ["color: #eee;", "box-shadow: 1px 1px 20px rgba(3, 3, 3, 1);"],
      [
        "color: rgba(225, 225, 225, 1);",
        "box-shadow: 1px 1px 10px rgba(0, 0, 0, 1);",
      ]
    );

    return useButton;
  }
  //Render and Creators______________________//

  //___________________Utils______________________//
  #clearData() {
    Object.values(this.#inputData).forEach((data) => (data = 0));
    Object.values(this.#timerData).forEach((data) => (data = 0));
  }

  #parseNumber(number) {
    let parseNumber = `${number}`;
    return number < 0
      ? (parseNumber = `00`)
      : number <= 9
      ? (parseNumber = `0${number}`)
      : parseNumber;
  }

  #loadFont(fontUrl) {
    const linkFont = document.createElement("link");
    linkFont.href = `${fontUrl}`;
    linkFont.rel = "stylesheet";

    this.#head.append(linkFont);
  }

  #hasDocumenFont(linksArr) {
    let hasFont = false;
    Array.from(linksArr).find((attr) =>
      attr.href ===
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap"
        ? (hasFont = true)
        : false
    );

    return hasFont;
  }

  #setStyles(element, [...property]) {
    const getElStyles = element.getAttribute("style");

    if (getElStyles === null) {
      const setProperty = property.reduce(
        (acc, props) => (acc += `${props} `),
        ""
      );
      element.setAttribute("style", `${setProperty}`);
    } else {
      const setProperty = property.reduce(
        (acc, props) => (acc += `${props} `),
        ""
      );
      element.setAttribute("style", `${getElStyles} ${setProperty}`);
    }
  }

  #setAnimation(element, [...propertyAndMutableValue], delay) {
    const getElStyles = element.getAttribute("style");
    const setProperty = propertyAndMutableValue.reduce(
      (acc, props) => (acc += `${props} `),
      ""
    );

    setTimeout(() => {
      element.setAttribute("style", `${getElStyles} ${setProperty}`);
    }, delay);
  }

  #hover(
    element,
    cssSelector,
    [...propertyAndMutableValue],
    [...propertyAndDefaultValue]
  ) {
    const getElStyles = element.getAttribute("style");
    element.addEventListener("mouseover", (event) => {
      const setProperty = propertyAndMutableValue.reduce(
        (acc, props) => (acc += `${props} `),
        ""
      );
      const isElement = event.target.closest(`${cssSelector}`);
      isElement
        ? isElement.setAttribute("style", `${getElStyles} ${setProperty}`)
        : false;
    });

    element.addEventListener("mouseout", (event) => {
      const setProperty = propertyAndDefaultValue.reduce(
        (acc, props) => (acc += `${props} `),
        ""
      );
      const isElement = event.target.closest(`${cssSelector}`);
      isElement
        ? isElement.setAttribute("style", `${getElStyles} ${setProperty}`)
        : false;
    });
  }
}

const timer = new Timer();
timer.run();
