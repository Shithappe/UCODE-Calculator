let history = document.querySelector("div#calc div#out input#history")
let expression = document.querySelector("div#calc div#out input#expression")

class Calc {
    constructor(str) {
        this.reset(str)
        this.mode = "dec"
        this.unitFrom = ""
        this.unitTo = ""
    }

    reset(str = "0") {
        this.history = ""
        this.str = str
        this.mem = "0"

        this.updateInput()
    }

    updateInput(string = null) {
        history.value = this.history
        expression.value = this.str
    }

    calculate(answer = null) {
        this.str = expression.value

        if (this.str[0] == "0" && this.str[1] != ".") {
            this.str = this.str.slice(1)
        }

        this.history = this.str

        if (!answer) {
            try {
                this.str = Math.round((eval(this.str.toString().replace("÷", "/").replace("^", "**")) + Number.EPSILON) * 1000) / 1000
            }
            catch {
                this.str = "Error"
            }
        }
        else {
            this.str = answer
        }

        this.updateInput(this.str)
    }

    press(button) {
        if (button == "=") {
            if (this.mode == "hex") {
                let str1 = this.str.split(" ")[0]
                let str2 = this.str.split(" ")[this.str.split(" ").length - 1]

                this.history = this.str

                this.str = this.toHexadecimal(eval(`${this.toDecimalHexadecimal(str1)} ${this.str.split(" ")[1]} ${this.toDecimalHexadecimal(str2)}`))

                this.updateInput()
            }
            else if (this.mode == "bin") {
                let str1 = this.str.split(" ")[0]
                let str2 = this.str.split(" ")[this.str.split(" ").length - 1]

                this.history = this.str

                console.log(eval(`${this.toDecimalBinary(str1)} ${this.str.split(" ")[1]} ${this.toDecimalBinary(str2)}`))

                this.str = this.toBinary(eval(`${this.toDecimalBinary(str1)} ${this.str.split(" ")[1]} ${this.toDecimalBinary(str2)}`))

                this.updateInput()
            }
            else if (this.mode == "length") {
                let res = +this.str

                console.log(this.unitFrom, this.unitTo)

                if (this.unitFrom == "mm") {
                    res *= 0.001
                } else if (this.unitFrom == "cm") {
                    res *= 0.01
                } else if (this.unitFrom == "km") {
                    res *= 1000
                }

                if (this.unitTo == "mm") {
                    res *= 1000
                } else if (this.unitTo == "cm") {
                    res *= 100
                } else if (this.unitTo == "km") {
                    res *= 0.001
                }

                this.history = this.str
                this.str = res

                this.updateInput()
            }
            else if (this.mode == "weight") {
                let res = +this.str

                console.log(this.unitFrom, this.unitTo)

                if (this.unitFrom == "mg") {
                    res *= 0.001
                } else if (this.unitFrom == "kg") {
                    res *= 1000
                } else if (this.unitFrom == "t") {
                    res *= 1000000
                }

                if (this.unitTo == "mg") {
                    res *= 1000
                } else if (this.unitTo == "kg") {
                    res *= 0.001
                } else if (this.unitTo == "t") {
                    res *= 0.000001
                }

                this.history = this.str
                this.str = res

                this.updateInput()
            }
            else {
                this.calculate()
            }
        }
        else if (button == "AC") {
            this.str = "0"
        }
        else if (button == "%") {
            this.calculate(this.str / 100)
        }
        else if (button == "+/-") {
            let operands = this.str.split(" ")
            let lastOperand = operands[operands.length - 1]

            if (lastOperand[0] == "-") {
                lastOperand = lastOperand.substring(1);
            } else {
                lastOperand = "-" + lastOperand
            }

            this.str = operands.slice(0, -1).join(" ") + " " + lastOperand
        }
        else if (button == "x!") {
            this.calculate()

            let res = 1

            for (let i = this.str; i >= 1; i--) {
                res *= i
            }

            this.str = res
        }
        else if (button == "x\u{207F}") {
            this.str += " " + "^" + " "
        }
        else if (button == "\u{221A}x") {
            this.calculate()

            this.str = Math.sqrt(this.str)
        }
        else if (button == "MC") {
            this.mem = "0"
        }
        else if (button == "MR") {
            this.mem = this.str
        }
        else if (button == "M+") {
            this.calculate()
            this.str += +this.mem
        }
        else if (button == "M-") {
            this.calculate()
            this.str -= this.mem
        }
        else if (!isNaN(button) || button == ".") {
            if (this.str == "0") {
                this.str = ""
            }

            if (button == ".") {
                let operands = this.str.split(" ")
                let lastOperand = operands[operands.length - 1]

                if (!lastOperand.includes(".")) {
                    if (lastOperand.length == 0) {
                        lastOperand = "0"
                    }

                    this.str = operands.slice(0, -1).join(" ") + " " + lastOperand
                    this.str += button
                }
            }
            else {
                this.str += button
            }
        }
        else {
            if (this.mode == "hex") {
                if (button == "A" || button == "B" || button == "C" || button == "D" || button == "E" || button == "F") {
                    this.str += button
                }
                else {
                    this.str += " " + button + " "
                }
            }
            else if (this.mode == "length" || this.mode == "weight" || this.mode == "area") {
                if (!isNaN(button)) {
                    this.str += button
                }
            }
            else {
                this.str += " " + button + " "
            }
        }

        this.updateInput()
    }

    toBinary(str) {
        return str.toString(2)
    }

    toDecimalBinary(str) {
        return parseInt(str, 2)
    }

    calcBinary(str1, str2) {
        return toBinary(toDecimalBinary(str1) + toDecimalBinary(str2))
    }

    toHexadecimal(str) {
        return str.toString(16).toUpperCase()
    }

    toDecimalHexadecimal(str) {
        return parseInt(str, 16);
    }
}

let calc = new Calc()

document.querySelectorAll("div#calc div.buttons input").forEach(function (button) {
    button.addEventListener("click", function () {
        calc.press(button.value)
    })
})

document.querySelectorAll("div#calc div#conv div").forEach(function (button) {
    button.addEventListener("click", function() {
        let mode = button.id.replace("mode-", "")

        document.querySelectorAll("div.buttons").forEach(function(button) {
            button.classList.add("hidden")
        })

        document.querySelector("div#" + mode + "").classList.remove("hidden")
        calc.mode = mode

        if (mode == "length") {
            calc.unitFrom = "mm"
            calc.unitTo = "cm"
        }
        else if (mode == "weight") {
            calc.unitFrom = "mg"
            calc.unitTo = "g"
        }
        else if (mode == "area") {
            calc.unitFrom = "cm2"
            calc.unitTo = "m2"
        }
    })
})

document.querySelectorAll("div#calc div input.unit-from").forEach(function (button) {
    button.addEventListener("click", function () {
        document.querySelectorAll("div#calc div input.unit-from").forEach(function(button) {
            button.classList.remove("active")
        })

        button.classList.add("active")

        calc.unitFrom = button.value
    })
})

document.querySelectorAll("div#calc div input.unit-to").forEach(function (button) {
    button.addEventListener("click", function () {
        document.querySelectorAll("div#calc div input.unit-to").forEach(function(button) {
            button.classList.remove("active")
        })

        button.classList.add("active")

        calc.unitTo = button.value
    })
})

document.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
        calc.press("=")
    }
})

// converter
// 3 add features (Pi, e, delete last symbol, buffer)
