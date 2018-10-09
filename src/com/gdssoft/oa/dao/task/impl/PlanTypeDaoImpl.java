package com.gdssoft.oa.dao.task.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.task.PlanTypeDao;
import com.gdssoft.oa.model.task.PlanType;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class PlanTypeDaoImpl extends BaseDaoImpl<PlanType> implements PlanTypeDao{

	public PlanTypeDaoImpl() {
		super(PlanType.class);
	}

}