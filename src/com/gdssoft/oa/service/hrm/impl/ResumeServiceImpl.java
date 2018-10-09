package com.gdssoft.oa.service.hrm.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.hrm.ResumeDao;
import com.gdssoft.oa.model.hrm.Resume;
import com.gdssoft.oa.service.hrm.ResumeService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class ResumeServiceImpl extends BaseServiceImpl<Resume> implements ResumeService{
	private ResumeDao dao;
	
	public ResumeServiceImpl(ResumeDao dao) {
		super(dao);
		this.dao=dao;
	}

}