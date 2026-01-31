import { WorkflowContext, GeneratedReport } from '../types/index';
/**
 * Execute report generation workflow
 */
export declare function executeReportWorkflow(env: any, context: WorkflowContext): Promise<GeneratedReport>;
/**
 * Retrieve cached report
 */
export declare function getCachedReport(env: any, reportId: string): Promise<GeneratedReport | null>;
//# sourceMappingURL=reportGeneration.d.ts.map