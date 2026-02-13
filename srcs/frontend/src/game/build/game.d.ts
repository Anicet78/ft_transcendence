export interface GameModule {
	_main(): number;
	callMain(args: string[]): void;
	getMessage(args: {}): void;
	finishGame(): void;
}

declare function createModule(options?: any): Promise<GameModule>;
export default createModule;