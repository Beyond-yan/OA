package com.gdssoft.oa.service.personal.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.personal.PersonnelCardHistoryDao;
import com.gdssoft.oa.model.personal.PersonnelCardHistory;
import com.gdssoft.oa.service.personal.PersonnelCardHistoryService;

public class PersonnelCardHistoryServiceImpl extends BaseServiceImpl<PersonnelCardHistory> implements PersonnelCardHistoryService{
	@SuppressWarnings("unused")
	private PersonnelCardHistoryDao dao;
	
	public PersonnelCardHistoryServiceImpl(PersonnelCardHistoryDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<PersonnelCardHistory> getSignRecores(Date startTime,
			Date endTime) {
		return dao.getSignRecores(startTime, endTime);
	}

	@Override
	public List<PersonnelCardHistory> getSignOffRecores(Date startTime,
			Date endTime) {
		// TODO Auto-generated method stub
		return dao.getSignOffRecores(startTime, endTime);
	}

}