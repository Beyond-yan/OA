package com.gdssoft.oa.dao.flow;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import java.util.Map;

import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface ProcessFormDao extends BaseDao<ProcessForm>{
	/**
	 * 取得某个流程实例的所有表单
	 * @param runId
	 * @return
	 */
	public List getByRunId(Long runId);
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
}