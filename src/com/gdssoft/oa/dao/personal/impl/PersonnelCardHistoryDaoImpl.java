package com.gdssoft.oa.dao.personal.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.personal.PersonnelCardHistoryDao;
import com.gdssoft.oa.model.personal.PersonnelCardHistory;

@SuppressWarnings("unchecked")
public class PersonnelCardHistoryDaoImpl extends BaseDaoImpl<PersonnelCardHistory> implements PersonnelCardHistoryDao{

	public PersonnelCardHistoryDaoImpl() {
		super(PersonnelCardHistory.class);
	}

	@Override
	public List<PersonnelCardHistory> getSignRecores(Date startTime,
			Date endTime) {
		String hql="from PersonnelCardHistory pch where pch.recordDt>=? and pch.recordDt<=?";
		return findByHql(hql,new Object[]{startTime,endTime});
	}
	
	@Override
	public List<PersonnelCardHistory> getSignOffRecores(Date startTime,
			Date endTime) {
		String hql="from PersonnelCardHistory pch where pch.recordDt>=? and pch.recordDt<=? order by pch.recordDt desc";
		return findByHql(hql,new Object[]{startTime,endTime});
	}

}