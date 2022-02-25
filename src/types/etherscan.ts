export type ContractDetailsResponse = Array<{
	SourceCode: string
	ContractName: string
	CompilerVersion: string
	OptimizationUser: string
	Runs: string
	ConstructorArguments: string
	EVMVersion: string
	Library: string
	LicenseType: string
	Proxy: string
	Implementation: string
	SwarmSource: string
}>
