package com.gdssoft.oa.service.flow;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;
import java.util.Map;

import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.core.service.BaseService;
/**
 * 流程表单服务类
 * @author csx
 *
 */
public interface ProcessFormService extends BaseService<ProcessForm>{
	/**
	 * 取得某个流程实例的所有表单
	 * @param runId
	 * @return
	 */
	public List getByRunId(Long runId);
	/**
	 * 根据schemacode取得某个流程实例的所有表单
	 * @param runId
	 * @return
	 */
	public List getBySchemacodeRunId(Long runId,String Schemacode);
	
	/**
	 * 查找某个流程某个任务的表单数据
	 * @param runId
	 * @param activityName
	 * @return
	 */
	public ProcessForm getByRunIdActivityName(Long runId,String activityName);
	
	/**
	 * 取得某一流程某一任务已经执行的次数，如某一任务被不断驳回，就会被执行多次。
	 * @return
	 */
	public Long getActvityExeTimes(Long runId,String activityName);
	
	/**
	 * 构造最新的流程实例对应的所有字段及数据
	 * @param runId
	 * @return
	 */
	public Map getVariables(Long runId);
	public Map getVariables(Long runId,String SchemaCode);
	/**
	 * 构造出以活动名称为key,审批人+审批意见+审批时间组合值为value
	 * @param runId
	 * @return
	 */
	public Map<String,List<ProcessForm>> getProcessFormDetail(Long runId);
	
}


