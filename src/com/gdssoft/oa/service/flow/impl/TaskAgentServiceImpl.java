package com.gdssoft.oa.service.flow.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.flow.SealApplyDao;
import com.gdssoft.oa.dao.flow.TaskAgentDao;
import com.gdssoft.oa.model.flow.SealApply;
import com.gdssoft.oa.model.flow.TaskAgent;
import com.gdssoft.oa.model.system.UserAgent;
import com.gdssoft.oa.service.flow.SealApplyService;
import com.gdssoft.oa.service.flow.TaskAgentService;

public class TaskAgentServiceImpl extends BaseServiceImpl<TaskAgent> implements TaskAgentService{
	@SuppressWarnings("unused")
	private TaskAgentDao dao;
	
	public TaskAgentServiceImpl(TaskAgentDao dao) {
		super(dao);
		this.dao=dao;
	}

	/**
	 * 取得某个用户的代理用户列表
	 * @param userId
	 * @return
	 */
	public List<TaskAgent> getByTaskId(Long taskId){
		return dao.getByTaskId(taskId);
	}
	
	public void delTaskGrants(Long taskId){
		List<TaskAgent> list=getByTaskId(taskId);
		for(TaskAgent taskAgent:list){
			dao.remove(taskAgent);
		}
	}
}