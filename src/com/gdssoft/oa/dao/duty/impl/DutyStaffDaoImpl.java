package com.gdssoft.oa.dao.duty.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.duty.DutyStaffDao;
import com.gdssoft.oa.model.duty.DutyStaff;

@SuppressWarnings("unchecked")
public class DutyStaffDaoImpl extends BaseDaoImpl<DutyStaff> implements DutyStaffDao{

	public DutyStaffDaoImpl() {
		super(DutyStaff.class);
	}
	
	public List<DutyStaff> getDutyList(Long sectionId, int startSize,Date startDate,Date endDate) {
		String conditions = "";
		if (startDate != null)
			conditions += " and d.dutyDate >= :startDate";
		if (endDate != null)
			conditions += " and d.dutyDate <= :endDate";
		String sql = " from DutyStaff d where d.sectionId="+sectionId+conditions+" "+"order by d.dutyDate asc";
		Query q=getSession().createQuery(sql);
		if (startDate != null)
			q.setParameter("startDate", startDate);
		if (endDate != null)
			q.setParameter("endDate", endDate);
		q.setFirstResult(startSize);
		q.setMaxResults(14);
		return q.list();
	}
	public Long getCount(Long sectionId,Date startDate,Date endDate){
		String conditions = "";
		if (startDate != null)
			conditions += " and d.dutyDate >= :startDate";
		if (endDate != null)
			conditions += " and d.dutyDate <= :endDate";
		String sql = "select count(*) from DutyStaff d where d.sectionId="+sectionId+conditions;
		Query q=getSession().createQuery(sql);
		if (startDate != null)
			q.setParameter("startDate", startDate);
		if (endDate != null)
			q.setParameter("endDate", endDate);
		List olist=q.list();
		Long count = null;
		if (olist != null) {
			count = (Long) olist.get(0);
		}
		return count;
	}
}