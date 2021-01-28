class CommandHelper {
  constructor(private readonly executablePath: string) {}
}

export const commandHelper = (executablePath: string) =>
  new CommandHelper(executablePath);
