package com.gdssoft.oa.dao.duty.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.duty.DutyPlanDao;
import com.gdssoft.oa.model.duty.DutyPlan;

@SuppressWarnings("unchecked")
public class DutyPlanDaoImpl extends BaseDaoImpl<DutyPlan> implements DutyPlanDao{

	public DutyPlanDaoImpl() {
		super(DutyPlan.class);
	}

}