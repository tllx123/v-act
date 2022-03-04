interface TransactionInfo {
  [instanceId: string]: { preInstanceIds: string[]; transactionType: string }
}

interface RuleInstances {
  [ruleInstanceId: string]: {
    ruleName: string
    condition: string
    inParams: string
    ruleCode: string
    enable: boolean
    needLog: boolean
    instanceCode: string
    instanceId?: string
    transactionType: string
  }
}

export { type TransactionInfo, type RuleInstances }
