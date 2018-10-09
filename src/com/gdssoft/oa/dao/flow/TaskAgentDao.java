package com.gdssoft.oa.dao.flow;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.flow.SealApply;
import com.gdssoft.oa.model.flow.TaskAgent;

/**
 * 
 * @author 
 *
 */
public interface TaskAgentDao extends BaseDao<TaskAgent>{
	/**
	 * 根据TaskId获取任务代理列表
	 * @param taskId
	 * @return
	 */
	public List<TaskAgent> getByTaskId(Long taskId);
}