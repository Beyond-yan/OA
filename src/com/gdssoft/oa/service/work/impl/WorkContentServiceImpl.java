package com.gdssoft.oa.service.work.impl;

import com.gdssoft.oa.dao.work.WorkContentDao;
import com.gdssoft.oa.model.work.WorkContent;
import com.gdssoft.oa.service.work.WorkContentService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class WorkContentServiceImpl extends BaseServiceImpl<WorkContent> implements WorkContentService{
	private WorkContentDao dao;
	
	public WorkContentServiceImpl(WorkContentDao dao) {
		super(dao);
		this.dao=dao;
	}
}

