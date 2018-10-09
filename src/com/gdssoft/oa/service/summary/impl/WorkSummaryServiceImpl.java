package com.gdssoft.oa.service.summary.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.summary.WorkSummaryDao;
import com.gdssoft.oa.model.summary.DepartmentSummary;
import com.gdssoft.oa.model.summary.WorkSummary;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.summary.WorkSummaryService;

public class WorkSummaryServiceImpl extends BaseServiceImpl<WorkSummary> implements WorkSummaryService{
	@SuppressWarnings("unused")
	private WorkSummaryDao dao;
		
	public WorkSummaryServiceImpl(WorkSummaryDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	public List<DepartmentSummary> listbyDept(WorkSummary worksummary,PagingBean pb)
	{
		return dao.listbyDept(worksummary,pb);
	}
	
	public List<WorkSummary> getAll(HttpServletRequest request,QueryFilter queryFilter)
	{
		return dao.getAll(request,queryFilter);
	}
	
	public void authorizedSummary(Long id,String isAuthorized)
	{
		 WorkSummary workSummary = get(id);
		 workSummary.setIsAuthorized(Integer.parseInt(isAuthorized));//1=通过审核
		 dao.authorizedSummary(workSummary);
	}
	public List<WorkSummary> getbyauth(AppUser user,PagingBean pb){
		return dao.getbyauth(user, pb);
	};
}