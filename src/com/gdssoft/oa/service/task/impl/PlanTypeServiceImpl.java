package com.gdssoft.oa.service.task.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import com.gdssoft.oa.dao.task.PlanTypeDao;
import com.gdssoft.oa.model.task.PlanType;
import com.gdssoft.oa.service.task.PlanTypeService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class PlanTypeServiceImpl extends BaseServiceImpl<PlanType> implements PlanTypeService{
	private PlanTypeDao dao;
	
	public PlanTypeServiceImpl(PlanTypeDao dao) {
		super(dao);
		this.dao=dao;
	}

}