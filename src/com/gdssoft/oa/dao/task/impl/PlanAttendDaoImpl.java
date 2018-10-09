package com.gdssoft.oa.dao.task.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.ArrayList;
import java.util.List;

import com.gdssoft.oa.dao.task.PlanAttendDao;
import com.gdssoft.oa.model.task.PlanAttend;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class PlanAttendDaoImpl extends BaseDaoImpl<PlanAttend> implements PlanAttendDao{

	public PlanAttendDaoImpl() {
		super(PlanAttend.class);
	}

	@Override
	public List<PlanAttend> FindPlanAttend(Long planId,Short isDep,Short isPrimary) {
		StringBuffer hql=new StringBuffer("from PlanAttend vo where vo.workPlan.planId=?");
		ArrayList list=new ArrayList();
		list.add(planId);
		if(isDep!=null){
			hql.append(" and vo.isDep=?");
			list.add(isDep);
		}
		if(isPrimary!=null){
			hql.append(" and vo.isPrimary=?");
			list.add(isPrimary);
		}
		return findByHql(hql.toString(), list.toArray());
	}

}