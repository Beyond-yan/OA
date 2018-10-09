package com.gdssoft.oa.service.flow;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;
import java.util.Map;

import com.gdssoft.oa.model.flow.ProcessFormNextTask;
import com.gdssoft.core.service.BaseService;
/**
 * 流程表单服务类
 * @author csx
 *
 */
public interface ProcessFormNextTaskService extends BaseService<ProcessFormNextTask>{
	/**
	 * 取得某个流程实例的所有表单
	 * @param runId
	 * @return
	 */
	public List getByTaskId(Long taskId);
	public List getByFormId(Long formId);
	public Map<Object,Object> getPreTaskCount(String taskId,String sourceName);
}


