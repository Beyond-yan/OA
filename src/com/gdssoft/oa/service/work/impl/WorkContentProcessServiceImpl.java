package com.gdssoft.oa.service.work.impl;

import java.util.List;

import com.gdssoft.oa.dao.work.WorkContentProcessDao;
import com.gdssoft.oa.model.work.WorkContentProcess;
import com.gdssoft.oa.service.work.WorkContentProcessService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class WorkContentProcessServiceImpl extends BaseServiceImpl<WorkContentProcess> implements WorkContentProcessService{
	private WorkContentProcessDao dao;
	
	public WorkContentProcessServiceImpl(WorkContentProcessDao dao) {
		super(dao);
		this.dao=dao;
	}
	public List<WorkContentProcess> getProcessListById(Long workContentId){
		return dao.getProcessListById(workContentId);
	}
}

