const arithmeticError = () => new Error("Enter a complete expression using numbers and arithmetic operators.");

export function calculateExpression(expression) {
  if (typeof expression !== "string" || expression.length > 160) throw arithmeticError();
  const input = expression.replaceAll("×", "*").replaceAll("÷", "/").replaceAll("−", "-");
  const tokens = input.match(/\d+(?:\.\d*)?|\.\d+|\S/g) ?? [];
  const precedence = new Map([["+", 1], ["-", 1], ["*", 2], ["/", 2]]);
  let current = 0;

  function operand() {
    const token = tokens[current++];
    if (token === "(") {
      const value = parse(1);
      if (tokens[current++] !== ")") throw arithmeticError();
      return value;
    }
    if (token === "+" || token === "-") return (token === "-" ? -1 : 1) * operand();
    if (/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(token ?? "")) return Number(token);
    throw arithmeticError();
  }

  function parse(minimum) {
    let value = operand();
    while (precedence.get(tokens[current]) >= minimum) {
      const operator = tokens[current++];
      const rhs = parse(precedence.get(operator) + 1);
      switch (operator) {
        case "+": value += rhs; break;
        case "-": value -= rhs; break;
        case "*": value *= rhs; break;
        case "/":
          if (rhs === 0) throw new Error("Division by zero is undefined.");
          value /= rhs;
          break;
      }
    }
    return value;
  }

  const value = parse(1);
  if (current !== tokens.length || !Number.isFinite(value)) throw arithmeticError();
  return Object.is(value, -0) ? 0 : value;
}

export function elapsedTime(value, now = new Date()) {
  const parsed = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!parsed) throw new Error("Enter a valid starting date.");
  const [year, month, day] = parsed.slice(1).map(Number);
  const start = new Date(0);
  start.setFullYear(year, month - 1, day);
  start.setHours(0, 0, 0, 0);
  if (!year || start.getFullYear() !== year || start.getMonth() !== month - 1 || start.getDate() !== day) {
    throw new Error("Enter a valid starting date.");
  }
  if (start > now) throw new Error("Choose a starting date in the past or today.");
  const seconds = Math.floor((now - start) / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor(seconds / 60),
    seconds,
  };
}
