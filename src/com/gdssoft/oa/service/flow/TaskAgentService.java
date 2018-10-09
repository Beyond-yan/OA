package com.gdssoft.oa.service.flow;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.flow.TaskAgent;

public interface TaskAgentService extends BaseService<TaskAgent>{
	/**
	 * 根据taskId删除任务代办
	 * @param taskId
	 */
	public void delTaskGrants(Long taskId);
}


