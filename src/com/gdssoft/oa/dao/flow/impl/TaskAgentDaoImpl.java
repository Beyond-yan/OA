package com.gdssoft.oa.dao.flow.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.flow.SealApplyDao;
import com.gdssoft.oa.dao.flow.TaskAgentDao;
import com.gdssoft.oa.model.flow.SealApply;
import com.gdssoft.oa.model.flow.TaskAgent;
import com.gdssoft.oa.model.system.UserAgent;

@SuppressWarnings("unchecked")
public class TaskAgentDaoImpl extends BaseDaoImpl<TaskAgent> implements TaskAgentDao{

	public TaskAgentDaoImpl() {
		super(TaskAgent.class);
	}
	
	public List<TaskAgent> getByTaskId(Long taskId){
		String hql="from TaskAgent ta where ta.taskId=?";
		return findByHql(hql, new Object[]{taskId});
	}

}