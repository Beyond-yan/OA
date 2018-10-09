package com.gdssoft.oa.service.hrm.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.hrm.JobChangeDao;
import com.gdssoft.oa.model.hrm.JobChange;
import com.gdssoft.oa.service.hrm.JobChangeService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class JobChangeServiceImpl extends BaseServiceImpl<JobChange> implements JobChangeService{
	private JobChangeDao dao;
	
	public JobChangeServiceImpl(JobChangeDao dao) {
		super(dao);
		this.dao=dao;
	}

}