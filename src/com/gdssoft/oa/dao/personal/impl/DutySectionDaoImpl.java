package com.gdssoft.oa.dao.personal.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.dao.personal.DutySectionDao;
import com.gdssoft.oa.model.personal.Duty;
import com.gdssoft.oa.model.personal.DutySection;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class DutySectionDaoImpl extends BaseDaoImpl<DutySection> implements DutySectionDao{

	public DutySectionDaoImpl() {
		super(DutySection.class);
	}

	@Override
	public List<DutySection> getAllDutySection() {
		String hql="from DutySection dy";
		Date curDate=new Date();
		return findByHql(hql,null);
	}

}