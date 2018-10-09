package com.gdssoft.oa.service.duty.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.duty.DutyPlanDao;
import com.gdssoft.oa.model.duty.DutyPlan;
import com.gdssoft.oa.service.duty.DutyPlanService;

public class DutyPlanServiceImpl extends BaseServiceImpl<DutyPlan> implements DutyPlanService{
	@SuppressWarnings("unused")
	private DutyPlanDao dao;
	
	public DutyPlanServiceImpl(DutyPlanDao dao) {
		super(dao);
		this.dao=dao;
	}

}