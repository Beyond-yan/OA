package com.gdssoft.oa.dao.summary.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.ArrayList;
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.summary.WorkSummarySumDao;
import com.gdssoft.oa.model.summary.WorkSummary;
import com.gdssoft.oa.model.summary.WorkSummarySum;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;

@SuppressWarnings("unchecked")
public class WorkSummarySumDaoImpl extends BaseDaoImpl<WorkSummarySum> implements WorkSummarySumDao{

	private ArrayList<Object> paramList = new ArrayList<Object>();
	public WorkSummarySumDaoImpl() {
		super(WorkSummarySum.class);
	}
	public void authorizedSummary(WorkSummarySum workSummarySum){
		getHibernateTemplate().update("WorkSummarySum", workSummarySum);
	}
	public List<WorkSummarySum> getbyauth(AppUser user,PagingBean pb)
	{
		List<WorkSummarySum> list = new ArrayList<WorkSummarySum>();
		boolean isAdmin = false;
		for (AppRole role : (user.getRoles()).toArray(new AppRole[0])) {
			if (role.getRoleId() == -1L)// 管理员权限
			{
				isAdmin = true;
				break;
			}
		}
		String hql= "";
		String condstr = "";
		hql = "from WorkSummarySum ws where ws.isAuthorized = 0 ";
		if (!isAdmin)// 非管理员不显示数据
		{
		}
		else
		{
			list = findByHql(hql, paramList.toArray(),pb);
		}						
		return list;
	}	
}