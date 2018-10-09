package com.gdssoft.oa.service.hrm.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.hrm.HireIssueDao;
import com.gdssoft.oa.model.hrm.HireIssue;
import com.gdssoft.oa.service.hrm.HireIssueService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class HireIssueServiceImpl extends BaseServiceImpl<HireIssue> implements HireIssueService{
	private HireIssueDao dao;
	
	public HireIssueServiceImpl(HireIssueDao dao) {
		super(dao);
		this.dao=dao;
	}

}