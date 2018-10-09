package com.gdssoft.oa.dao.flow;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import java.util.Map;

import com.gdssoft.oa.model.flow.ProcessFormNextTask;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface ProcessFormNextTaskDao extends BaseDao<ProcessFormNextTask>{
	/**
	 * 取得某个流程实例的所有表单
	 * @param runId
	 * @return
	 */
	public List getByTaskId(Long taskId);
	public List getByFormId(Long formId);
	public Map<Object,Object> getPreTaskCount(String taskId,String sourceName);
	
}