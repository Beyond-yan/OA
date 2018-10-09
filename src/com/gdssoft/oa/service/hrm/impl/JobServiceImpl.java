package com.gdssoft.oa.service.hrm.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.hrm.JobDao;
import com.gdssoft.oa.model.hrm.Job;
import com.gdssoft.oa.service.hrm.JobService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class JobServiceImpl extends BaseServiceImpl<Job> implements JobService{
	private JobDao dao;
	
	public JobServiceImpl(JobDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<Job> findByDep(Long depId) {
		return dao.findByDep(depId);
	}

}