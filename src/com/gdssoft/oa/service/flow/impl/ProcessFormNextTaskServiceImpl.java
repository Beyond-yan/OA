package com.gdssoft.oa.service.flow.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;
import java.util.Map;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.flow.ProcessFormNextTaskDao;
import com.gdssoft.oa.model.flow.ProcessFormNextTask;
import com.gdssoft.oa.service.flow.ProcessFormNextTaskService;

public class ProcessFormNextTaskServiceImpl extends BaseServiceImpl<ProcessFormNextTask> implements ProcessFormNextTaskService{
	private ProcessFormNextTaskDao dao;
	
	public ProcessFormNextTaskServiceImpl(ProcessFormNextTaskDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	/**
	 * 取得某个流程实例的所有表单
	 * @param runId
	 * @return
	 */
	public List getByTaskId(Long taskId){
		return dao.getByTaskId(taskId);
	}
	public List getByFormId(Long formId){
		return dao.getByFormId(formId);
	}
	public Map<Object,Object> getPreTaskCount(String taskId,String sourceName){
		return dao.getPreTaskCount(taskId,sourceName);
	}
}